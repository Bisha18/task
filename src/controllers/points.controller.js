import ClaimHistory from "../model/claimHistory.model.js";
import User from "../model/user.model.js";
import getRankedUsers from "../utils/rankedUser.js";
import { io } from "../utils/socket.js";

export const claimPoints = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "User id is required" });

  try {
    const randomPoints = Math.floor(Math.random() * 10) + 1;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoints: randomPoints } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await ClaimHistory.create({
      userId: updatedUser._id,
      pointsClaimed: randomPoints
    });

    const rankedUsers = await getRankedUsers();
    io.emit('leaderboard_update', rankedUsers);

    res.json({
      message: "Points claimed successfully",
      user: updatedUser,
      pointsAwarded: randomPoints
    });
  } catch (error) {
    res.status(500).json({ error: "Error claiming points" });
  }
};

export const getClaimHistory = async (req, res) => {
  try {
    const history = await ClaimHistory.find().populate('userId', 'username').sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const claimHistoryForSpecificUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await ClaimHistory.find({ userId }).populate('userId', 'username').sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Error getting claim history" });
  }
};
