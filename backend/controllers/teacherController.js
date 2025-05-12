import { Client, prepare_files } from "@gradio/client";
import Assignment from "../models/assignmentModel.js";
import Submission from "../models/submissionModel.js";
import axios from "axios";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
const generateQuestions = async (req, res) => {
  const { topic, difficulty, questionTypes, numQuestions } = req.body;
  console.log("Request Body:", req.body);
  const client = await Client.connect(
    "https://ee47b4eebc90df0e12.gradio.live/"
  );
  try {
    const result = await client.predict("/predict", {
      topic,
      difficulty,
      types: questionTypes,
      count: numQuestions,
    });
    const markdownString =
      typeof result?.data === "string"
        ? result.data
        : Array.isArray(result?.data) && typeof result.data[0] === "string"
        ? result.data[0]
        : "";

    if (!markdownString) {
      return res
        .status(500)
        .json({ error: "Invalid response format from AI model." });
    }

    const questions = markdownString
      .split("---")
      .map((q) => {
        const typeMatch = q.match(/\*\*Type\*\*:\s*(.*)/);
        const questionMatch = q.match(/\*\*Question\*\*:\s*(.*)/s);
        const hintMatch = q.match(/\*\*Hint\*\*:\s*(.*)/s);

        if (typeMatch && questionMatch && hintMatch) {
          return {
            type: typeMatch[1].trim(),
            text: questionMatch[1].split("\n")[0].trim(),
            hint: hintMatch[1].split("\n")[0].trim(),
          };
        }
        return null;
      })
      .filter((q) => q !== null);

    // console.log("Parsed Questions:", questions);
    res.json(questions);
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate questions." });
  }
};
const getAllAssignments = async (req, res) => {
  try {
    // console.log(req.user);
    const teacherId = req.user._id;
    const assignments = await Assignment.find({
      createdBy: teacherId,
    }).populate("createdBy", "name email");
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    console.error("Error fetching assignments by teacher:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getSubmissions = async (req, res) => {
  const { id } = req.params;

  try {
    const submissions = await Submission.find({ assignmentId: id })
      .populate("studentId", "name email")
      .populate("matchedWith.student", "name email");

    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const checkAssignmentPlagiarism = async (req, res) => {
  const { assignmentId } = req.params;
  const PLAGIARISM_THRESHOLD = 75;

  try {
    const submissions = await Submission.find({ assignmentId })
      .populate("studentId", "name email")
      .lean();

    if (submissions.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Need at least 2 submissions to compare",
      });
    }
    // console.log(submissions);
    // Call Python API
    const response = await axios.post(
      "https://smart-check-ai-python.onrender.com/checkPlagiarism",
      {
        file_urls: submissions.map((sub) => sub.fileUrl),
        threshold: PLAGIARISM_THRESHOLD,
      }
    );
    // console.log(response.data);

    const similarityResults = response.data.results;
    const now = new Date();

    // Initialize scoreMap
    const scoreMap = {};
    submissions.forEach((_, index) => {
      scoreMap[index] = { maxScore: 0, matches: [] };
    });

    // Process each similarity result
    similarityResults.forEach((result) => {
      const i1 = result.file1_index;
      const i2 = result.file2_index;
      const similarity = result.similarity_score * 100; // Convert to percentage

      scoreMap[i1].maxScore = Math.max(scoreMap[i1].maxScore, similarity);
      scoreMap[i2].maxScore = Math.max(scoreMap[i2].maxScore, similarity);

      if (result.is_plagiarised && similarity >= PLAGIARISM_THRESHOLD) {
        scoreMap[i1].matches.push({
          student: submissions[i2].studentId._id,
          similarity,
        });
        scoreMap[i2].matches.push({
          student: submissions[i1].studentId._id,
          similarity,
        });
      }
    });

    const bulkOps = submissions.map((sub, index) => ({
      updateOne: {
        filter: { _id: sub._id },
        update: {
          $set: {
            status:
              scoreMap[index].maxScore >= PLAGIARISM_THRESHOLD
                ? "flagged"
                : "checked",
            plagiarismScore: scoreMap[index].maxScore,
            checkedAt: now,
            matchedWith: scoreMap[index].matches,
          },
        },
      },
    }));

    await Submission.bulkWrite(bulkOps);

    // Refetch and populate with matched students
    const updatedSubmissions = await Submission.find({ assignmentId })
      .populate("studentId", "name email")
      .populate("matchedWith.student", "name email")
      .sort({ plagiarismScore: -1 });

    // console.log(updatedSubmissions);
    res.status(200).json({
      success: true,
      data: {
        submissions: updatedSubmissions,
        stats: {
          total: submissions.length,
          flagged: updatedSubmissions.filter((s) => s.status === "flagged")
            .length,
          highestSimilarity: Math.max(
            ...updatedSubmissions.map((s) => s.plagiarismScore || 0)
          ),
        },
      },
    });
  } catch (error) {
    console.error("Plagiarism check failed:", error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.detail || "Plagiarism check failed",
      error: error.message,
    });
  }
};

const evaluate = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    console.log(assignmentId);

    // Step 1: Get answer key
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment || !assignment.answerKeyUrl) {
      return res.status(400).json({ error: "Answer key not found." });
    }

    // Step 2: Get submissions with status 'checked'
    const submissions = await Submission.find({
      assignmentId,
      status: "checked",
    });

    if (submissions.length === 0) {
      return res
        .status(400)
        .json({ error: "No checked submissions to evaluate." });
    }

    const file_urls = submissions.map((s) => s.fileUrl);

    // Step 3: Send to FastAPI
    const fastapiResponse = await axios.post(
      "https://smart-check-ai-python.onrender.com/evaluate",
      {
        file_urls,
        answer_key: assignment.answerKeyUrl,
      }
    );

    const evaluationResults = fastapiResponse.data.results;

    // Step 4: Update each submission
    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      const result = evaluationResults;

      // Calculate the average score for this submission
      const avgScore =
        result && result.length > 0
          ? result.reduce((sum, q) => sum + q.score, 0) / result.length
          : 0;

      // Generate the feedback string for this submission by concatenating feedback for each question

      // Update the submission's grade and feedback
      submission.grade = Math.round(avgScore * 20); // out of 100
      submission.feedback = result
        .map((q) => `Q${q.question}: ${q.topic} (${q.score}/5)`)
        .join("; ");
      submission.results = result; // ✅ Store full evaluation data
      submission.status = "evaluated";
      console.log(submission.feedback);
      console.log(submission.results);

      // Save the updated submission
      await submission.save();
    }

    return res.json({
      message: "Evaluation completed",
      evaluated: submissions.length,
    });
  } catch (error) {
    console.error("Evaluation Error:", error.message);
    return res.status(500).json({ error: "Evaluation failed" });
  }
};

const uploadAnswerKey = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found." });
    }

    cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: "Smart-Check-AI" },
        async (error, cloudinaryResult) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Failed to upload to Cloudinary." });
          }

          assignment.answerKeyUrl = cloudinaryResult.secure_url;
          await assignment.save();

          res.status(201).json({
            success: true,
            message: "Answer key uploaded successfully!",
            fileUrl: cloudinaryResult.secure_url,
          });
        }
      )
      .end(req.file.buffer);
  } catch (err) {
    console.error("Error uploading answer key:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
const getProfile = async (req, res) => {
  try {
    const id = req.user._id;
    const profile = await User.findById(id);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching assignments by teacher:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getSubjects = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    res.status(200).json({ success: true, subjects: user.subjects });
  } catch (error) {
    console.error("Error fetching subjects of teacher:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getAssignmentForSubject = async (req, res) => {
  try {
    const id = req.user._id;
    const { subject } = req.params;
    if (!subject) {
      return res.status(400).json({ error: "Subject ID is required" });
    }
    const filteredAssignments = await Assignment.find({
      createdBy: id,
      subject,
    });
    res.status(200).json({ success: true, assignments: filteredAssignments });
  } catch (error) {
    console.error("Error fetching subjects of teacher:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const generateClassPerformance = async (req, res) => {
  const { assignmentId } = req.body;
  try {
    const submissions = await Submission.find({
      assignmentId,
    }).populate("studentId");
    // console.log(submissions);
    const reportData = {
      submissions: submissions
        .filter((sub) => sub.status === "evaluated")
        .map((sub) => ({
          student_name: sub.studentId.name,
          results: sub.results
            ? sub.results.map((result) => ({
                score: result.score,
                topic: result.topic,
                student_answer: result.student_answer,
                reference_answer: result.reference_answer,
              }))
            : [],
        })),
    };
    // console.log(reportData);
    const response = await axios.post(
      "https://smart-check-ai-python.onrender.com/generatePerformanceReport",
      reportData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/html",
        },
      }
    );

    res.set("Content-Type", "text/html");
    res.send(response.data);
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    res.status(error.response?.status || 500).json({
      error: "Failed to generate performance report",
      details: error.response?.data || error.message,
    });
  }
};
const uploadAssignment = async (req, res) => {
  try {
    const { title, subject, dueDate, description, course } = req.body;
    const teacherId = req.user._id;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "Smart-Check-AI/Assignments" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const cloudinaryResult = await uploadToCloudinary();

    // Save assignment details to DB
    const newAssignment = new Assignment({
      title,
      subject,
      dueDate,
      description,
      course,
      fileUrl: cloudinaryResult.secure_url,
      createdBy: teacherId,
    });

    await newAssignment.save();

    res.status(201).json({ success: true, assignment: newAssignment });
  } catch (err) {
    console.error("Error uploading assignment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
export {
  generateQuestions,
  getAllAssignments,
  checkAssignmentPlagiarism,
  getSubmissions,
  uploadAnswerKey,
  getProfile,
  getSubjects,
  getAssignmentForSubject,
  generateClassPerformance,
  evaluate,
  uploadAssignment,
};
