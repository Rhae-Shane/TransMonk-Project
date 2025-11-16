
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set in env");
  // caching connection for hot reloads
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri, {
    // options can be tuned as needed
  });
  console.log("MongoDB connected");
}
