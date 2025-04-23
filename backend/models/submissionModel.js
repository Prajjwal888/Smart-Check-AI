import mongoose, { Schema } from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "checked", "flagged", "evaluated", "late"],
      default: "pending",
    },
    grade: { type: Number },
    plagiarismScore: { type: Number },
    matchedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
