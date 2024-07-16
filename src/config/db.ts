import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to DB Successfully!");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Error in connecting to DB!", err);
    });

    // typescript use here to typecast the DB_URL.
    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.log("Failed to connect to DB!");
    process.exit(1);
  }
};

export default connectDB;
