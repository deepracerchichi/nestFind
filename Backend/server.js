import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";

dotenv.config();

const port = process.env.PORT
const app = express();
connectDB();
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});