import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import strict from "node:assert/strict";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from "../utils/email.js";

// Signs a fresh access/refresh token pair for `user` and sets them as
// HttpOnly cookies on `res`, so any endpoint that authenticates a user
// (login, register, ...) ends up in the same logged-in state.
const issueAuthCookies = (user, res) => {
    const accessToken = jwt.sign({
        id: user._id,
        role: user.role,
    },
            process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "15m"
        })


    const refreshToken = jwt.sign({
            id: user._id,
            role: user.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days, matching the token's own expiry
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes in milliseconds
    });
}

export const register = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({message: "All fields are required"});
    if (role && !["user", "admin"].includes(role)) return res.status(400).json({message: "Invalid role"});

    try {

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const message = existingUser.email === email
                ? "User already exists"
                : "Username already taken";
            return res.status(409).json({ message });
        }

        const hashedPswrd = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPswrd,
            role: role || "user",
        });
        await user.save();

        issueAuthCookies(user, res);

        const verificationToken = jwt.sign(
            {id: user._id},
            process.env.EMAIL_VERIFICATION_SECRET,
            {expiresIn: "1d"}
        );

        sendVerificationEmail(user.email, verificationToken).catch((err) => 
            console.error("Failed to send verification email", err)
        );

        res.status(200).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error("Error registering user", error);
        return res.status(500).json({message: "Server Error"});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).json({message: "All fields are required!"});

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({message: "User was not registered."})

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({message: "Invalid credentials"});

        issueAuthCookies(user, res);

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });


    } catch (e) {
            console.log("Error logging in", e);
            return res.status(500).json({message: "Server Error"});
    }
}

export const refreshToken = async (req, res) => {

    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({message: "Token not found"});

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({message: "User no found"});
        const newaccessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        )

        res.cookie("accessToken", newaccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
        });

    } catch (e) {
        if (e.name=== "TokenExpiredError" || e.name === "JsonWebTokenError") {
            return res.status(401).json({message: "Invalid or expired token"});
        
        }
        console.error("Error refreshing token", e);
        res.status(500).json({message: "Server Error"});
    }
}

export const logOut = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    console.error("Error logging out", error);
    return res.status(500).json({ message: "Server Error" });
  }
}

export const verifyEmail = async (req, res) => {
    const {token} = req.body;
    if (!token) return res.status(400).json({message: "Token is required"});

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({message: "User not found"});

        if (user.isVerified) {
            return res.status(200).json({message: "Email already verified"});
        }

        user.isVerified = true;
        await user.save();

        sendWelcomeEmail(user.email, user.username).catch((err) => 
            console.error("Failed to send welcome email", err)
        );

        res.status(200).json({message: "Email verified successfully"});
    } catch (e) {
        if (e.name === "TokenExpiredError" || e.name === "JsonWebTokenError") {
            return res.status(400).json({message: "Invalid or expired link"});


        }

        console.error("Error verifying email", e);
        res.status(500).json({message: "Server Error"});
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const user = await User.findOne({ email });

        if (user) {
            const resetToken = jwt.sign(
                { id: user._id, pwd: user.password.slice(-10) },
                process.env.PASSWORD_RESET_SECRET,
                { expiresIn: "15m" }
            );

            sendPasswordResetEmail(user.email, resetToken).catch((err) =>
                console.error("Failed to send password reset email", err)
            );
        }

        // Same response whether or not the account exists - otherwise this
        // endpoint becomes a way to check which emails are registered users.
        res.status(200).json({
            message: "If that email is registered, a reset link has been sent.",
        });
    } catch (error) {
        console.error("Error requesting password reset", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.PASSWORD_RESET_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (decoded.pwd !== user.password.slice(-10)) {
            return res.status(400).json({ message: "This reset link has already been used or is no longer valid." });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (e) {
        if (e.name === "TokenExpiredError" || e.name === "JsonWebTokenError") {
            return res.status(400).json({ message: "Invalid or expired reset link" });
        }
        console.error("Error resetting password", e);
        res.status(500).json({ message: "Server Error" });
    }
};
