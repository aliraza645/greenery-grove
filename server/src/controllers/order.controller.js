import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

const fail = (res, status, message, errors) => {
  res.status(status);
  const err = new Error(message);
  err.errors = errors;
  throw err;
};

export const createOrder = asyncHandler(async (req, res) => {
  const {
    items, shipping, subtotal, shippingCost = 0, discount = 0, total,
    couponCode, paymentMethod = "cod",
  } = req.body;

  const errors = {};

  if (!Array.isArray(items) || items.length === 0) {
    errors.items = "Order must contain at least one item.";
  } else {
    const bad = items
      .map((it, i) => ({ i, id: String(it?.product ?? "") }))
      .filter(({ id }) => !mongoose.Types.ObjectId.isValid(id));
    if (bad.length) {
      errors.items = `Invalid product id(s) at index ${bad.map((b) => b.i).join(", ")}. Please refresh your cart.`;
    }
    items.forEach((it, i) => {
      if (!Number.isFinite(it?.quantity) || it.quantity < 1) {
        errors[`items.${i}.quantity`] = "Quantity must be at least 1.";
      }
    });
  }

  const requiredShip = ["fullName", "address", "city", "country", "postalCode", "phone"];
  if (!shipping || typeof shipping !== "object") {
    errors.shipping = "Shipping address is required.";
  } else {
    requiredShip.forEach((f) => {
      const v = String(shipping[f] ?? "").trim();
      if (!v) errors[`shipping.${f}`] = `${f} is required.`;
    });
    if (shipping.phone && !/^[+\d][\d\s\-()]{6,19}$/.test(String(shipping.phone).trim())) {
      errors["shipping.phone"] = "Invalid phone number.";
    }
    if (shipping.postalCode && !/^[A-Za-z0-9\s-]{3,12}$/.test(String(shipping.postalCode).trim())) {
      errors["shipping.postalCode"] = "Invalid postal code.";
    }
  }

  if (Object.keys(errors).length) {
    return fail(res, 400, "Validation failed", errors);
  }

  const order = await Order.create({
    user: req.user._id,
    items, shipping, subtotal, shippingCost, discount, total, couponCode,
    paymentMethod: "cod",
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
  const allowed = ["pending", "paid", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(req.body.status)) {
    return fail(res, 400, "Invalid status", { status: `Must be one of ${allowed.join(", ")}` });
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json(order);
});
