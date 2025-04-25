import express from "express";
import { checkAssignmentPlagiarism, generateQuestions, getAllAssignments, getProfile, getSubmissions } from "../controllers/teacherController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"
const teacherRoute = express.Router();

teacherRoute.post("/api/generateQuestions", authMiddleware,generateQuestions);
teacherRoute.get("/api/getAssignments",authMiddleware,getAllAssignments);
teacherRoute.post("/api/checkPlagiarism/:assignmentId",authMiddleware,checkAssignmentPlagiarism);
teacherRoute.get("/api/getSubmissions/:id",authMiddleware,getSubmissions);
teacherRoute.get("/api/getProfile",authMiddleware,getProfile);
// teacherRoute.post("/api/uploadAnswerKey/:assignmentId");
export default teacherRoute;
