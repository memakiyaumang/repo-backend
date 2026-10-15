import express from "express";
import cors from "cors";
import "dotenv/config";
import route from "./route/userRoute.js";

import connectDB from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route)

const PORT = process.env.PORT

connectDB();

app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});