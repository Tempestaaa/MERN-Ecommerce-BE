import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_STRING as string).then(() => {
      console.log("Database connected");
    });
  } catch (error) {
    console.log("Database error");
  }
};

export default dbConnect;
