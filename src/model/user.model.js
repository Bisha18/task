import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  username:{
    type:String,
    unique:true,
    required:true
  },
  totalPoints:{
    type:Number,
    default:0
  }
})

const User = mongoose.model('User',userSchema);

export default User;