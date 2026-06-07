import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const sanitize = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("name, email, password are required");
  }
  if (await User.findOne({ email })) {
    res.status(409);
    throw new Error("Email already registered");
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ user: sanitize(user), token: generateToken(user._id) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  res.json({ user: sanitize(user), token: generateToken(user._id) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  // Stub — wire Nodemailer here. We always return ok to avoid email enumeration.
  res.json({ ok: true });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitize(req.user) });
});
