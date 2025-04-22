import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  subjects: [{ type: String }], //taught by teachers and for students the subjects under the course
  course: { type: String }, //for student
  profilePic: { type: String },
});

const User = mongoose.model("User", userSchema);
export default User;
