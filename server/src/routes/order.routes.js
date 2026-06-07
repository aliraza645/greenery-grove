import { Router } from "express";
import { createOrder, myOrders, listOrders, updateStatus } from "../controllers/order.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/", protect, createOrder);
router.get("/mine", protect, myOrders);
router.get("/", protect, admin, listOrders);
router.put("/:id/status", protect, admin, updateStatus);
export default router;
