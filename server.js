import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { io, initSocket } from "./src/utils/socket.js";
import { connectDB } from "./src/utils/db.js";
import populateInitialUsers from "./src/utils/initialUsers.js";

import userRoutes from "./src/routes/user.routes.js";
import claimRoutes from "./src/routes/points.routes.js";

dotenv.config();

// helps in server monitoring in evry 14 minutes
import cronJob from "./src/scripts/cron.js"; 
cronJob.start(); // starts the cron job


const app = express();
const server = http.createServer(app);

initSocket(server); // initializes Socket.IO with CORS

app.use(cors({
  origin: ["http://localhost:5173", "https://task-frontend-rank.vercel.app"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);

// Start server after DB connection
connectDB().then(() => {
  populateInitialUsers(); // optional
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`✅ Server running on ${process.env.API_URL}`);
  });
});
