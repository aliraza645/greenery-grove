import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

const fail = (res, status, message, errors) => {
  res.status(status);
  const e = new Error(message);
  e.errors = errors;
  throw e;
};

function validateProductPayload(body, { partial = false } = {}) {
  const errors = {};
  const name = String(body.name ?? "").trim();
  const description = String(body.description ?? "").trim();
  const category = String(body.category ?? "").trim();
  const price = Number(body.price);
  const salePrice = body.salePrice !== undefined && body.salePrice !== null && body.salePrice !== ""
    ? Number(body.salePrice) : undefined;
  const stock = body.stock !== undefined ? Number(body.stock) : 0;
  const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];

  if (!partial || body.name !== undefined) if (name.length < 2) errors.name = "Product name is required.";
  if (!partial || body.price !== undefined) {
    if (!Number.isFinite(price) || price <= 0) errors.price = "Price must be greater than 0.";
  }
  if (salePrice !== undefined) {
    if (!Number.isFinite(salePrice) || salePrice < 0) errors.salePrice = "Sale price must be ≥ 0.";
    else if (Number.isFinite(price) && salePrice > price) errors.salePrice = "Sale price must be ≤ price.";
  }
  if (!partial || body.stock !== undefined) {
    if (!Number.isFinite(stock) || stock < 0) errors.stock = "Stock must be ≥ 0.";
  }
  if (!partial || body.category !== undefined) if (!category) errors.category = "Category is required.";
  if (!partial || body.description !== undefined) if (!description) errors.description = "Description is required.";
  if (!partial || body.images !== undefined) if (images.length === 0) errors.images = "At least one image is required.";

  return { errors, clean: { ...body, name, description, category, price, stock, images, ...(salePrice !== undefined && { salePrice }) } };
}

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
  const { errors, clean } = validateProductPayload(req.body);
  if (Object.keys(errors).length) return fail(res, 400, "Validation failed", errors);
  const product = await Product.create(clean);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { errors, clean } = validateProductPayload(req.body, { partial: true });
  if (Object.keys(errors).length) return fail(res, 400, "Validation failed", errors);
  const product = await Product.findByIdAndUpdate(req.params.id, clean, { new: true, runValidators: true });
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
