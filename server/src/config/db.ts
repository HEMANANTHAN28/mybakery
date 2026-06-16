import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bakery';
    console.log(`Connecting to MongoDB at: ${connUri}...`);
    
    // Connect to MongoDB
    const conn = await mongoose.connect(connUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB. Make sure MongoDB is running.');
    console.error(error);
    // We won't exit the process so the server can run or retry, 
    // but in a production app we might exit.
  }
};
