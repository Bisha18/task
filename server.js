import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/utils/db.js";
import populateInitialUsers from "./src/utils/initialUsers.js";
import userRoutes from "./src/routes/user.routes.js";
import claimRoutes from "./src/routes/points.routes.js";
dotenv.config();

const app = express();

// Middleware use for safe parsing between routes
app.use(cors());
app.use(express.json());


// adding initial users
populateInitialUsers();

//routes
app.use('/api/users',userRoutes); // user route
app.use('/api/claims',claimRoutes);  // claim points route 




const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  connectDB();
});
