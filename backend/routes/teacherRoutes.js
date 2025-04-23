import express from "express";
import { checkAssignmentPlagiarism, generateQuestions, getAllAssignments, getSubmissions } from "../controllers/teacherController.js";
const teacherRoute = express.Router();

teacherRoute.post("/api/generateQuestions", generateQuestions);
teacherRoute.get("/api/getAssignments",getAllAssignments);
teacherRoute.post("/api/checkPlagiarism/:assignmentId",checkAssignmentPlagiarism);
teacherRoute.get("/api/getSubmissions/:id",getSubmissions);
export default teacherRoute;
