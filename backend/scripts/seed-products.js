require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");

function toType(value) {
  return String(value || "General")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getSafeImage(item, index) {
  if (typeof item.thumbnail === "string" && item.thumbnail.trim()) {
    return item.thumbnail.trim();
  }
  if (Array.isArray(item.images) && typeof item.images[0] === "string" && item.images[0].trim()) {
    return item.images[0].trim();
  }
  return `https://picsum.photos/seed/ecom-${index + 1}/1200/900`;
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecom";
  await mongoose.connect(mongoUri);

  let seller = await User.findOne({ email: "seed.seller@ecom.local" });
  if (!seller) {
    const passwordHash = await bcrypt.hash("Seed@123456", 10);
    seller = await User.create({
      name: "Seed Seller",
      email: "seed.seller@ecom.local",
      passwordHash
    });
  }

  // User asked to clear all existing products first.
  await Product.deleteMany({});

  const response = await fetch("https://dummyjson.com/products?limit=100");
  if (!response.ok) {
    throw new Error(`Failed to fetch products from dummyjson: ${response.status}`);
  }

  const payload = await response.json();
  const sourceProducts = Array.isArray(payload.products) ? payload.products.slice(0, 60) : [];
  if (sourceProducts.length < 60) {
    throw new Error(`Expected 60 products, got ${sourceProducts.length}`);
  }

  const docs = sourceProducts.map((item, index) => ({
    title: item.title,
    type: toType(item.category),
    description: item.description,
    price: Math.max(1, Number(item.price || 1) * 85),
    stock: Math.max(1, Number(item.stock || 1)),
    imageUrl: getSafeImage(item, index),
    sellerId: seller._id
  }));

  await Product.insertMany(docs);
  const totalProducts = await Product.countDocuments();
  const uniqueTypes = [...new Set(docs.map((item) => item.type))];

  console.log(`Seeded ${docs.length} products with real categories and image URLs.`);
  console.log(`Total products in database: ${totalProducts}`);
  console.log(`Types: ${uniqueTypes.join(", ")}`);
  console.log(`Seed seller email: ${seller.email}`);

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Seeding failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
