import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to the db");
  } catch (err) {
    console.log(err.message);
  }
};

export default dbConnect;
