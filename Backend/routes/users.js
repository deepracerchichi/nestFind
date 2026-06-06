import express from "express";
import {getUsers, deleteUser, getProfile, saveListing, getSavedListings} from "../controllers/userController.js";
import {verifyToken, verifyRole} from "../middleware/authMiddleware.js";



const router =  express.Router();

router.get("/", verifyToken, verifyRole("admin"), getUsers);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteUser);
router.get("/me", verifyToken, getProfile);
router.post("/save/:listingId", verifyToken, saveListing);
router.get("/saved", verifyToken, getSavedListings);

//router.get("/me", verifyToken, updateProfile);

export default router;