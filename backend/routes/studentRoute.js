import express from "express";
import { submitAssignment, getAssignments } from "../controllers/studentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({ storage });

const studentRoute = express.Router();


studentRoute.post("/submitAssignment",authMiddleware, upload.single("file"), submitAssignment);

studentRoute.get("/getAssignments", authMiddleware, getAssignments);
export default studentRoute;
