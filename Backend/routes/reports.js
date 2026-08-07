import express from "express";
import { getReports, resolveReport } from "../controllers/reportController.js";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole("moderator"), getReports);
router.patch("/:id", verifyToken, verifyRole("moderator"), resolveReport);

export default router;
