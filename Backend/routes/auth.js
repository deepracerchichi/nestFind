import express from "express";
import {register, login, refreshToken, logOut, verifyEmail} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refreshToken", refreshToken);
router.post("/logout", logOut);
router.post("/verify-email", verifyEmail);

export default router;