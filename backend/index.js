import express from "express";
import cors from "cors";
import teacherRoute from "./routes/teacherRoutes.js";
import authRoute from "./controllers/auth.js";
import dotenv from 'dotenv'
dotenv.config();
import connectDB from "./config/db.js";
const app = express();
app.use(cors());
app.use(express.json());
connectDB();
const PORT = 5000;

app.use("/api/auth", authRoute);
app.use(teacherRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
