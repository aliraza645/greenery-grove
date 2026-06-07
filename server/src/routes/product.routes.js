import { Router } from "express";
import {
  listProducts, getProduct, createProduct, updateProduct, deleteProduct,
} from "../controllers/product.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", listProducts);
router.get("/:slug", getProduct);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
export default router;
