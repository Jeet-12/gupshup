import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }

    // Notify all clients about the updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        // Remove the disconnected user from the userSocketMap
        for (const [key, value] of Object.entries(userSocketMap)) {
            if (value === socket.id) {
                delete userSocketMap[key];
                break; // Stop the loop once found
            }
        }
        // Notify all clients about the updated online users list after disconnection
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
