import express from "express";
import cors from "cors";
import teacherRoute from "./routes/teacherRoutes.js";
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

app.use(teacherRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
