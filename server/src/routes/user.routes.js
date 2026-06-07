import { Router } from "express";
import { listUsers } from "../controllers/user.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", protect, admin, listUsers);
export default router;
