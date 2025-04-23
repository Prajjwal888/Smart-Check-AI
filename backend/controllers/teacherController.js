import { Client } from "@gradio/client";
import Assignment from "../models/assignmentModel.js";
import Submission from "../models/submissionModel.js";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import mongoose from "mongoose";
import User from "../models/userModel.js";
const generateQuestions = async (req, res) => {
  const { topic, difficulty, questionTypes, numQuestions } = req.body;
  console.log("Request Body:", req.body);
  const client = await Client.connect(
    "https://7b90b4ce705f89c3e0.gradio.live/"
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
    // const teacherId = req.user._id;
    const teacherId = new mongoose.Types.ObjectId("68076062772cca1d470522cc");
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
    const submissions = await Submission.find({ assignmentId: id }).populate('studentId');

    // const results = [];

    // for (const submission of submissions) {
    //   const student = await User.findById(submission.studentId).select('name email');

    //   results.push({
    //     studentName: student?.name || 'Unknown',
    //     studentEmail: student?.email || 'Unknown',
    //     plagiarismScore: submission.plagiarismScore || null,
    //   });
    // }
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const downloadFile = async (url) => {
  const tempPath = path.join(tmpdir(), `${uuidv4()}.pdf`);
  const writer = fs.createWriteStream(tempPath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
    timeout: 30000
  });
  
  await new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
  
  return tempPath;
};

const checkAssignmentPlagiarism = async (req, res) => {
  const { assignmentId } = req.params;
  const PLAGIARISM_THRESHOLD = 75;

  try {
    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email')
      .lean();

    if (submissions.length < 2) {
      return res.status(400).json({ 
        success: false,
        message: "Need at least 2 submissions to compare" 
      });
    }
    console.log(submissions);
    // Call Python API
    const response = await axios.post("http://127.0.0.1:8000/checkPlagiarism", {
      file_urls: submissions.map(sub => sub.fileUrl),
      threshold: PLAGIARISM_THRESHOLD
    });

    const similarityResults = response.data.results;
    const now = new Date();

    // Process results (same as before)
    const scoreMap = {};
    submissions.forEach((_, index) => {
      scoreMap[index] = { maxScore: 0, matches: [] };
    });

    similarityResults.forEach(result => {
      const i1 = result.index1;
      const i2 = result.index2;
      const similarity = result.similarity;

      scoreMap[i1].maxScore = Math.max(scoreMap[i1].maxScore, similarity);
      scoreMap[i2].maxScore = Math.max(scoreMap[i2].maxScore, similarity);

      if (similarity >= PLAGIARISM_THRESHOLD) {
        scoreMap[i1].matches.push({
          student: submissions[i2].studentId._id,
          similarity
        });
        scoreMap[i2].matches.push({
          student: submissions[i1].studentId._id,
          similarity
        });
      }
    });

    // Update submissions (same as before)
    const bulkOps = submissions.map((sub, index) => ({
      updateOne: {
        filter: { _id: sub._id },
        update: {
          $set: {
            status: scoreMap[index].maxScore >= PLAGIARISM_THRESHOLD ? 'flagged' : 'checked',
            plagiarismScore: scoreMap[index].maxScore,
            checkedAt: now,
            ...(scoreMap[index].matches.length > 0 && { 
              matchedWith: scoreMap[index].matches 
            })
          }
        }
      }
    }));

    await Submission.bulkWrite(bulkOps);

    // Return results (same as before)
    const updatedSubmissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email')
      .populate('matchedWith.student', 'name email')
      .sort({ plagiarismScore: -1 });

    res.status(200).json({
      success: true,
      data: {
        submissions: updatedSubmissions,
        stats: {
          total: submissions.length,
          flagged: updatedSubmissions.filter(s => s.status === 'flagged').length,
          highestSimilarity: Math.max(
            ...updatedSubmissions.map(s => s.plagiarismScore || 0)
          )
        }
      }
    });

  } catch (error) {
    console.error('Plagiarism check failed:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.detail || 'Plagiarism check failed',
      error: error.message
    });
  }
};
export { generateQuestions, getAllAssignments, checkAssignmentPlagiarism,getSubmissions };
