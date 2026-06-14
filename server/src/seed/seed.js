import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const products = [
  { name: "Monstera Deliciosa", price: 65, category: "indoor", stock: 12, light: "bright", careLevel: "easy", featured: true, images: ["/p-monstera.jpg"], description: "Iconic split-leaf statement plant." },
  { name: "Fiddle Leaf Fig", price: 120, category: "indoor", stock: 6, light: "bright", careLevel: "medium", featured: true, images: ["/p-fiddle.jpg"], description: "Sculptural floor plant with broad leaves." },
  { name: "Snake Plant", price: 38, category: "indoor", stock: 30, light: "low", careLevel: "easy", petSafe: false, images: ["/p-snake.jpg"], description: "Near-indestructible architectural plant." },
  { name: "Pothos Golden", price: 22, category: "indoor", stock: 45, light: "medium", careLevel: "easy", images: ["/p-pothos.jpg"], description: "Trailing vine, perfect for shelves." },
  { name: "Calathea Orbifolia", price: 48, category: "indoor", stock: 14, light: "medium", careLevel: "medium", petSafe: true, images: ["/p-calathea.jpg"], description: "Striped, pet-safe statement leaves." },
  { name: "ZZ Plant", price: 42, category: "indoor", stock: 22, light: "low", careLevel: "easy", images: ["/p-zz.jpg"], description: "Drought-tolerant low-light hero." },
  { name: "Bird of Paradise", price: 145, category: "indoor", stock: 4, light: "direct", careLevel: "medium", images: ["/p-bird.jpg"], description: "Tropical, paddle-leaf floor plant." },
  { name: "Terracotta Pot 8\"", price: 18, category: "pots", stock: 60, images: ["/cat-pots.jpg"], description: "Classic glazed terracotta planter." },
  { name: "Pruning Shears", price: 24, category: "tools", stock: 35, images: ["/cat-tools.jpg"], description: "Precision-cut stainless steel shears." },
];

async function run() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);

  const admin = await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
  });
  await Product.insertMany(products);

  console.log(`Seeded ${products.length} products. Admin: ${admin.email} / admin123`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
