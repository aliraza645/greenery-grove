import { Router } from "express";
import { listUsers, updateMe } from "../controllers/user.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", protect, admin, listUsers);
router.put("/me", protect, updateMe);
export default router;
