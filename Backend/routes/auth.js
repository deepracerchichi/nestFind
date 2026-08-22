import express from "express";
import {register, login, refreshToken,forgotPassword, resetPassword, logOut, verifyEmail} from "../controllers/authController.js";
import { registerLimiter, loginLimiter, forgotPasswordLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register",registerLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/refreshToken", refreshToken);
router.post("/logout", logOut);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

export default router;