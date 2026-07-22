import express from "express";
import { connectDB } from "./lib/db.js";
import { configDotenv } from "dotenv";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Car Inventry Server is running');
});

//connect to mongoDB
await connectDB();



app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
})


// export server for vercel
export default app;
