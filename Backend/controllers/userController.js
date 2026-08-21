import mongoose from "mongoose";
import User from "../models/user.js";
import Listing from "../models/listing.js";
import bcrypt from "bcrypt";
import { PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from "../utils/validation.js";
import jwt from "jsonwebtoken";


export const getUsers = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await User.countDocuments();
        const users = await User.find().skip(skip).limit(limit).select("-password");
        res.status(200).json({
            users,
            total,
            totalPages: Math.ceil(total/limit),
            currentPage: page,
        });


    } catch (error) {
        console.log("ERROR RETREIVING USERS", error);
        return res.status(500).json({message: "Server error"})
    }

}
//PATCH /api/users/password
export const changePassword = async (req, res) => {

    try {
        const {currentPassword, newPassword} = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({message: "Current and new password are required"})
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            return res.status(400).json({message: PASSWORD_REQUIREMENTS_MESSAGE});
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: "Current password is incomplete"})
        
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            res.status(200).json({message: "Password updated successfully"})
        } catch (error) {
         console.error("Error changing password: ", error);

         res.status(500).json({message: "Server error"})
    }
}

// PATCH /api/users/users/username
export const changeUsername = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(409).json({message: "Username is required"});

        const existingUser = await User.findOne({username, _id: {$ne: req.user.id}});
        if (existingUser) return res.status(409).json({message: "User not found"});

        const user = await User.findByIdAndUpdate(req.user.id, { username }, {new: true}).select("-password");
        if (!user) return res.status(404).json({message: "User not found"});

        res.status(200).json({message: "Username updated successfully", user});

    } catch (error) {
        console.error("Error changing username", e);
        res.status(500).json({message: "Server error"})
    }
}

//POST /api/users/email/request-change

export const requestEmailChange = async (req, res) => {
    try {
        const {newEmail, currentPassword} = req.body;
        if (!newEmail || !currentPassword) {
            return res.status(400).json({message: "New email and current password are required"})
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({message: "User not found"});

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({message: "That email is already in use"});

        const token = jwt.sign(
            {id: user._id, newEmail},
            process.env.EMAIL_VERIFICATION_SECRET,
            { expiresIn: "1d" }
        );

        await sendEmailChangeConfirmation(newEmail, token);

        res.status(200).json({message: "Check your new email to confirm the change"});
    } catch (error) {
        console.error("Error requesting email change", error);
        res.status(500).json({message: "Server error"});
    }
}

//POST /api/users/email/confirm-change

export const confirmEmailChange = async (req, res) => {
    try {
        const {token} = req.body;
        if (!token) return res.status(400).json({message: "Token is required"});

        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        const {id, newEmail} = decoded;
        if (!newEmail) return res.status(400).json({message: "Invalid Token"});

        const existingUser = await User.findOne({email: newEmail, _id: {$ne: id}});
        if (existingUser) return res.status(409).json({message: "The email is already taken."})
        
        const user = await User.findByIdAndUpdate(id, {email: newEmail}, {new: true}).select("-password");
        if (!user) return res.status(404).json({message: "User not found"});

        res.status(200).json({message: "Email updated successfully"})


        } catch (error) {
        
            if (e.name === "TokenExpiredError" || e.name === "JsonWebTokenError") {
                return res.status(400).json({message: "Invalid or expired link"}); 
            }

            console.error("Error confirming the change", error);
            res.status(500).json({message: "Server error"});
    }
}

export const deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({message: "User not found"});
        return res.status(200).json({message: "User deleted successfully!"})
    } catch (error) {
        console.log("Error deleting user", error);
        return res.status(500).json({message: "Server error"});
    }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log("Error getting user Profile", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const saveListing = async (req, res) => {
    try {
        const {listingId} = req.params;

        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400).json({message: "Invalid listing id"});
        }

        const listingExists = await Listing.exists({_id: listingId});
        if (!listingExists) return res.status(404).json({message: "Listing not found"});

        const user = await User.findById(req.user.id);
        const alreadySaved = user.savedListings.includes(listingId);

        if (alreadySaved) {
            //unsave it
            user.savedListings = user.savedListings.filter(
                (id) => id.toString() !== listingId
            );
            await user.save();
            return res.status(200).json({message: "Listings unsaved"});
        }
        user.savedListings.push(listingId);
        await user.save();
        res.status(200).json({message: "Listings saved", saved: true})
    } catch (e) {
        console.error("Error saving listing", e);
        res.status(500).json({message: "Server error"});
    }
};

//GET /api/users/saved
export const getSavedListings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("savedListings");
        res.status(200).json({ listings: user.savedListings});
    } catch (e) {
        console.error("Error getting saved savedlistings", e);
        res.status(500).json({message: "Server error"});
    }
}

// export const updateProfile = async (req, res) => {
//     try {

//     } catch (error) {
//         console.log("Error updating user Profile", error);
//         return res.status(500).json({message: "Server error"});
//     }
// }
