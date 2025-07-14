import User from "../model/user.model.js";
import getRankedUsers from "../utils/rankedUser.js"
import { io } from "../utils/socket.js";


// get users in reverse sorted order
export const getSortedUsers = async(req,res)=>{
  try {
    const rankedUsers = await getRankedUsers();
    res.json(rankedUsers);
  } catch (error) {
    res.status(500).json({error:"Error getting ranked users"});
  }
}


// add user
export const addUsers = async(req,res)=>{
  const {username} = req.body;
  if(!username) return res.status(400).json({error:"Username is required"});
  try {
    const newUser = new User(
      {
        username,
        totalPoints:0
      }
    )
   await newUser.save();

   const rankedUsers = await getRankedUsers();
   io.emit('leaderboard_update',rankedUsers);
   res.status(201).json(newUser);
  } catch (error) {
    if(error.code === 11000) return res.status(400).json({error:"User already exists"});
    res.status(500).json({error:"Error creating user"});
  }
}