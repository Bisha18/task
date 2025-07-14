import User from "../model/user.model.js";
import getRankedUsers from "../utils/rankedUser.js";
import { io } from "../utils/socket.js";

export const getSortedUsers = async (req, res) => {
  try {
    const ranked = await getRankedUsers();
    res.json(ranked);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const addUsers = async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username is required" });

  try {
    const user = new User({ username, totalPoints: 0 });
    await user.save();

    const ranked = await getRankedUsers();
    io.emit("leaderboard_update", ranked);
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(500).json({ error: "Error creating user" });
  }
};
