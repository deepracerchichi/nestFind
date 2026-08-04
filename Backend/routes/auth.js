import express from "express";
import {register, login, refreshToken,forgotPassword, resetPassword, logOut, verifyEmail} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refreshToken", refreshToken);
router.post("/logout", logOut);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;