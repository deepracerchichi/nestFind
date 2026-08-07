import "dotenv/config";
import express from "express";
import { connectDB } from "./database/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import listingRoutes from "./routes/listings.js"
import uploadRoutes from "./routes/upload.js"
import reportRoutes from "./routes/reports.js";


const port = process.env.PORT
const app = express();

app.use(express.json());//so that when the frontend sends data to the backend in json format it can understand it.

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
})); //so backend and frontend can have different ports

app.use(cookieParser()); //for the middleware

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reports", reportRoutes);

connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});