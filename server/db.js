import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const URI = "mongodb+srv://Atul:atulhim4325b@cluster0.x0sraxy.mongodb.net/?appName=Cluster0"
    const conn = await mongoose.connect(URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};
