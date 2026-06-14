import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  // Email is intentionally not updatable.
  if (typeof name === "string" && name.trim()) user.name = name.trim();
  await user.save();
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});
