import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import strict from "node:assert/strict";

export const register = async (req, res) => {
    const { username, email, password} = req.body;
    if (!username || !email || !password) return res.status(400).json({message: "All fields are required"});
    
    try {
        
        const existingUser = await User.findOne({ email});
        if (existingUser) return res.status(409).json({message: "User already exists"});

        const hashedPswrd = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPswrd,
        });
        await user.save();

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
            sameSite: "strict"
        });

        res.status(200).json({
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

        
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

        res.status(200).json({
            newaccessToken,
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

        return res.status(200).json({message: "Logged out successfully!"});
    } catch (error) {
        console.error("Error logging out", error)
        return res.status(500).json({message: "Server Error"})
    }
}