import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shipping, subtotal, shippingCost = 0, discount = 0, total, couponCode, paymentMethod = "cod" } = req.body;
  if (!items?.length) {
    res.status(400);
    throw new Error("No items in order");
  }
  const order = await Order.create({
    user: req.user._id,
    items, shipping, subtotal, shippingCost, discount, total, couponCode, paymentMethod,
  });
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.status(201).json(order);
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const listOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json(order);
});
