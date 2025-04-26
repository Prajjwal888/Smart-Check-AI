import express from "express";
import { checkAssignmentPlagiarism, evaluate, generateClassPerformance, generateQuestions, getAllAssignments, getAssignmentForSubject, getProfile, getSubjects, getSubmissions } from "../controllers/teacherController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"
const teacherRoute = express.Router();

teacherRoute.post("/api/generateQuestions",generateQuestions);
teacherRoute.get("/api/getAssignment/:subject",authMiddleware,getAssignmentForSubject);
teacherRoute.get("/api/getAssignments",authMiddleware,getAllAssignments);
teacherRoute.post("/api/checkPlagiarism/:assignmentId",authMiddleware,checkAssignmentPlagiarism);
teacherRoute.get("/api/getSubmissions/:id",authMiddleware,getSubmissions);
teacherRoute.get("/api/getProfile",authMiddleware,getProfile);
teacherRoute.get("/api/getSubjects",authMiddleware,getSubjects);
teacherRoute.post("/api/generateClassReport/",authMiddleware,generateClassPerformance);
teacherRoute.post("/api/evaluate/:assignmentId",authMiddleware,evaluate);
// teacherRoute.post("/api/uploadAnswerKey/:assignmentId");
export default teacherRoute;
