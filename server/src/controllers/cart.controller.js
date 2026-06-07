import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";

const getOrCreate = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  res.json(await getOrCreate(req.user._id));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const cart = await getOrCreate(req.user._id);
  const existing = cart.items.find((i) => String(i.product?._id ?? i.product) === productId);
  if (existing) existing.quantity += quantity;
  else cart.items.push({ product: productId, quantity });
  await cart.save();
  await cart.populate("items.product");
  res.json(cart);
});

export const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreate(req.user._id);
  const item = cart.items.find((i) => String(i.product?._id ?? i.product) === req.params.productId);
  if (!item) {
    res.status(404);
    throw new Error("Item not in cart");
  }
  item.quantity = Math.max(1, quantity);
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
