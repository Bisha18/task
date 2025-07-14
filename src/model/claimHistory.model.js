import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  pointsClaimed:{
    type:Number,
    required:true
  }
},{timestamps:true});

const ClaimHistory = mongoose.model('ClaimHistory',historySchema);

export default ClaimHistory;