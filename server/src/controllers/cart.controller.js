import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";

const getOrCreate = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const badId = (res, id) => {
  res.status(400);
  const e = new Error("Invalid product id");
  e.errors = { productId: `"${id}" is not a valid product id.` };
  throw e;
};

export const getCart = asyncHandler(async (req, res) => {
  res.json(await getOrCreate(req.user._id));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!mongoose.Types.ObjectId.isValid(productId)) return badId(res, productId);
  const qty = Math.max(1, Number(quantity) || 1);
  const cart = await getOrCreate(req.user._id);
  const existing = cart.items.find((i) => String(i.product?._id ?? i.product) === productId);
  if (existing) existing.quantity += qty;
  else cart.items.push({ product: productId, quantity: qty });
  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
});

export const updateItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) return badId(res, productId);
  const qty = Math.max(1, Number(req.body.quantity) || 1);
  const cart = await getOrCreate(req.user._id);
  const item = cart.items.find((i) => String(i.product?._id ?? i.product) === productId);
  if (!item) {
    res.status(404);
    throw new Error("Item not in cart");
  }
  item.quantity = qty;
  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreate(req.user._id);
  cart.items = cart.items.filter((i) => String(i.product?._id ?? i.product) !== req.params.productId);
  await cart.save();
  res.json(cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreate(req.user._id);
  cart.items = [];
  await cart.save();
  res.json(cart);
});
