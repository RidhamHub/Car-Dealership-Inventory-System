import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("Database is connected");
        })
        await mongoose.connect(`${process.env.MONGODB_URL}/chat-app`)
    } catch (e) {
        console.log("error in connectiong MongoDB : ", e);

    }
}