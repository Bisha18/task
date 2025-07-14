import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import { io, initSocket } from "./src/utils/socket.js";
import { connectDB } from "./src/utils/db.js";
import populateInitialUsers from "./src/utils/initialUsers.js";

import userRoutes from "./src/routes/user.routes.js";
import claimRoutes from "./src/routes/points.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

initSocket(server); // initializes Socket.IO with CORS

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);

// Start server after DB connection
connectDB().then(() => {
  populateInitialUsers(); // optional
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
