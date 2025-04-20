import express from "express";
import { generateQuestions } from "../controllers/teacherController.js";
const teacherRoute = express.Router();

teacherRoute.post("/api/generate-questions", generateQuestions);

export default teacherRoute;
