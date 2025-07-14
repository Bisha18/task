import User from "../model/user.model.js";

const populateInitialUsers = async()=>{
  const initialUsers = [
    { username: 'Shyla', totalPoints: 10005725 },
        { username: 'Swetambari', totalPoints: 10229695 },
        { username: 'GLOBAL KING', totalPoints: 9444665 },
        { username: 'Ashok', totalPoints: 8040750 },
        { username: 'Abhishek', totalPoints: 8024750 },
        { username: 'toqir', totalPoints: 8006380 },
        { username: 'Divine', totalPoints: 8006100 },
        { username: 'Shree Krishna', totalPoints: 8005795 },
        { username: 'Devil', totalPoints: 0 },
  ];

  for(const data of initialUsers){
    try {
      const existingUser = await User.findOne({ username: data.username });

      if (!existingUser) {
        await User.create(data);
        console.log(`Created user: ${data.username}`);
      } else{
        console.log(`User already exists: ${data.username}`);
      }
    } catch (error) {
      console.log(`Error creating user: ${data.username}`,error);
    } 
  }
}

export default populateInitialUsers