import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";

// Return only the safe user fields (never send the password back).
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check the input is valid
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 2. Make sure the email is not already used
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // 3. Create the user (password is hashed by the model) and send a token
    const user = await User.create({ name, email, password });
    const token = generateToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user and check the password
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
