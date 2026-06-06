import express from "express";
import {verifyToken} from "../middleware/authMiddleware.js";
import {upload} from "../config/cloudinary.js";
import {uploadImage} from "../controllers/uploadController.js";

const router= express.Router();

router.post("/", verifyToken, upload.array("images", 10), uploadImage);

export default router;