import mongoose from 'mongoose';

// --- 1. SET YOUR CONNECTION STRING ---
// (Use your NEW secure password and the database name we agreed on)
const CONNECTION_STRING = process.env.MONGODB_URI

/**
 * --- CONNECT FUNCTION ---
 * Call this ONCE when your server starts.
 */
export async function connectDB() {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Exit process with failure
    process.exit(1);
  }
}