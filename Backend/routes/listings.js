import express from "express";
import {
    createListing,
    deleteListing,
    getListings, getMyListings,
    getOneListing,
    updateListing
} from "../controllers/listingController.js";
import {verifyRole, verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

//  Public routes , no login needed to browse listings
router.get("/", getListings);
router.get("/:id", getOneListing);

//Protected routes, must be logged in AND be admin
router.post("/", verifyToken, verifyRole("admin"), createListing);
router.patch("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);
router.get("/me", verifyToken, verifyRole("admin"), getMyListings);

export default router;