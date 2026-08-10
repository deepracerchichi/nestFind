import "dotenv/config";
import express from "express";
import http from "http";
import {Server} from "socket.io";
import { connectDB } from "./database/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import listingRoutes from "./routes/listings.js"
import uploadRoutes from "./routes/upload.js"
import reportRoutes from "./routes/reports.js";
import jwt from "jsonwebtoken";
import Conversation from "./models/conversation.js";
import Message from "./models/message.js";
import conversationRoutes from "./routes/conversations.js";



const port = process.env.PORT
const app = express();

const server = http.createServer(app); // the object app.listen() used to create silently
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
})
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
app.use("/api/conversations", conversationRoutes);


const parseCookies = (cookieHeader) => {
    if (!cookieHeader) return {};
    return Object.fromEntries(
        cookieHeader.split("; ").map((pair) => {
            const [key, ...rest] = pair.split("=");
            return [key, rest.join("=")];
        })
    );
};

io.use((socket, next) => {
    try {
        const cookies = parseCookies(socket.handshake.headers.cookie);
        const token = cookies.accessToken;
        if (!token) return next(new Error("Authentication required"));

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (error) {
        next(new Error("Authentication failed"));
    }
})

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.join(socket.userId); // their personal room - anything meant for them arrives here

    socket.on("sendMessage", async ({conversationId, text}) => {
        try {
            const conversation = await Conversation.findById(conversationId);

            if (!conversation) return;

            const isParticipant = conversation.participants
                .map((id) => id.toString())
                .includes(socket.userId);
            if (!isParticipant) return;

            const message = await Message.create({
                covnversation: conversationId,
                sender: socket.userId,
                text,
            });

            conversation.lastMessage = text;
            conversation.lastMessageAt = new Date();
            await conversation.save();

            const payload = {
                _id: message._id,
                conversation: conversationId,
                sender: socket.userId,
                text,
                createdAt: message.createdAt,
            }

            // Both participants, not just the recipient - this covers the
            // sender's own other open tabs too, and gives the frontend one
            // single code path for "a message arrived" instead of two.
            conversation.participants.forEach((participantId) => {
                io.to(participantId.toString()).emit("newMessage", payload);
            });
        } catch (e) {
            console.error("Error sending message:", e);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

connectDB();

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});