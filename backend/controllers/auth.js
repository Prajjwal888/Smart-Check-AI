import express from "express";
import jwt from "jsonwebtoken";
const authRoute = express.Router();
const SECRET_KEY = "your_secret_key";
import User from "../models/userModel.js";


// 🔐 Login using ID + Password
authRoute.post('/login', async(req, res) => {
    const { email, password, role } = req.body;

//   const user = users.find(u => u.id === id && u.password === password && u.role===role);
try {
    const user = await User.findOne({ email, role });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid ID, password, or role" });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }

});

export default authRoute;
