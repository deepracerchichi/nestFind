import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { connectDB } from "./database/db.js";
import Conversation from "./models/conversation.js";
import Message from "./models/message.js";
import app from "./app.js";

const port = process.env.PORT;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
});

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
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.join(socket.userId);

    socket.on("sendMessage", async ({ conversationId, text }) => {
        try {
            const conversation = await Conversation.findById(conversationId);
            if (!conversation) return;

            const isParticipant = conversation.participants
                .map((id) => id.toString())
                .includes(socket.userId);
            if (!isParticipant) return;

            const message = await Message.create({
                conversation: conversationId,
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
            };

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
