import express from "express";
import {register, login, refreshToken, logOut} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refreshToken", refreshToken);
router.post("/logout", logOut);

export default router;