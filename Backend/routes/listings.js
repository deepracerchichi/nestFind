import express from "express";
import {
    createListing,
    deleteListing,
    getListings, getMyListings,
    getOneListing,
    updateListing,
    getPendingVerifications,
    verifyListing,
    createReport
} from "../controllers/listingController.js";
import {verifyRole, verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

//  Public routes , no login needed to browse savedlistings
router.get("/", getListings);

//Protected routes, must be logged in AND be admin
router.post("/", verifyToken, verifyRole("admin"), createListing);
// Must come before "/:id" - otherwise Express matches "/me" as {id: "me"}
// and getOneListing tries (and fails) to findById("me").
router.get("/me", verifyToken, verifyRole("admin"), getMyListings);
router.patch("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);
router.get("/:id", getOneListing);
router.get("/pending-verification", verifyToken, verifyRole("moderator"), getPendingVerifications);
router.patch("/:id/verify", verifyToken, verifyRole("moderator"), verifyListing);
router.post("/:id/report", verifyToken, createReport);

export default router;