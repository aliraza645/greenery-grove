import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

export const listProducts = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, light, inStock, sort, page = 1, limit = 24 } = req.query;
  const q = {};
  if (category) q.category = category;
  if (light) q.light = light;
  if (inStock === "true") q.stock = { $gt: 0 };
  if (minPrice || maxPrice) q.price = { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) };
  if (search) q.name = { $regex: search, $options: "i" };

  const sortMap = { "price-asc": { price: 1 }, "price-desc": { price: -1 }, newest: { createdAt: -1 } };
  const items = await Product.find(q)
    .sort(sortMap[sort] || { createdAt: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit);
  const total = await Product.countDocuments(q);
  res.json({ items, total, page: +page, pages: Math.ceil(total / +limit) });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ ok: true });
});
