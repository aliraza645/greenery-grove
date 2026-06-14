import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadProducts() {
  const p = JSON.parse(fs.readFileSync(path.join(__dirname, "products.json"), "utf8"));
  // ensure required fields and defaults match Product schema
  return p.map((prod) => ({
    name: prod.name,
    price: prod.price ?? 0,
    category: prod.category ?? "indoor",
    stock: prod.stock ?? 0,
    images: Array.isArray(prod.images) && prod.images.length ? prod.images : [prod.image ?? "/placeholder.jpg"],
    light: prod.light ?? "medium",
    careLevel: prod.careLevel ?? "easy",
    petSafe: prod.petSafe ?? false,
    description: prod.description ?? "",
    rating: prod.rating ?? 0,
    numReviews: prod.numReviews ?? prod.reviews ?? 0,
    featured: prod.featured ?? prod.bestSeller ?? false,
  }));
}

async function run() {
  await connectDB();
  console.log("Clearing existing data...");
  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);

  console.log("Creating users...");
  const admin = await User.create({ name: "Admin", email: "admin@gmail.com", password: "admin123", role: "admin" });
  const user = await User.create({ name: "Demo User", email: "user@example.com", password: "password123" });

  console.log("Loading products from products.json...");
  const products = loadProducts();

  const inserted = await Product.insertMany(products);

  console.log(`Inserted ${inserted.length} products.`);
  console.log(`Admin created: ${admin.email} / admin123`);
  console.log(`Demo user created: ${user.email} / password123`);

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
