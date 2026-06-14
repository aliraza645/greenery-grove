import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const sanitize = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (res, status, message, errors) => {
  res.status(status);
  const e = new Error(message);
  e.errors = errors;
  throw e;
};

export const register = asyncHandler(async (req, res) => {
  const name = String(req.body.name ?? "").trim();
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const password = String(req.body.password ?? "");
  const errors = {};
  if (name.length < 3) errors.name = "Name must be at least 3 characters.";
  if (!emailRe.test(email)) errors.email = "Invalid email address.";
  if (password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (Object.keys(errors).length) return fail(res, 400, "Validation failed", errors);

  if (await User.findOne({ email })) {
    return fail(res, 409, "Email already registered", { email: "This email is already in use." });
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ user: sanitize(user), token: generateToken(user._id) });
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const password = String(req.body.password ?? "");
  const errors = {};
  if (!email) errors.email = "Email is required.";
  if (!password) errors.password = "Password is required.";
  if (Object.keys(errors).length) return fail(res, 400, "Validation failed", errors);

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return fail(res, 401, "Invalid email or password", { credentials: "Email or password is incorrect." });
  }
  res.json({ user: sanitize(user), token: generateToken(user._id) });
});

export const forgotPassword = asyncHandler(async (_req, res) => {
  res.json({ ok: true });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitize(req.user) });
});
