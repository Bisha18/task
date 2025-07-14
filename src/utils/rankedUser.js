import User from "../model/user.model.js";

const getRankedUsers = async () => {
  try {
    const users = await User.find().sort({ totalPoints: -1 }).lean();
    return users.map((user,idx)=>({
      ...user,
      rank:idx+1
    }))
  } catch (error) {
    console.log(`Error getting ranked users: ${error}`);
  }
};

export default getRankedUsers;