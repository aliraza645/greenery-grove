import { Router } from "express";
import { getCart, addToCart, updateItem, removeItem, clearCart } from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protect);
router.get("/", getCart);
router.post("/", addToCart);
router.put("/:productId", updateItem);
router.delete("/:productId", removeItem);
router.delete("/", clearCart);
export default router;
