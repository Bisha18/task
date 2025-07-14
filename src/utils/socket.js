import { Server } from "socket.io";

export let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected");
    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected");
    });
  });
};
