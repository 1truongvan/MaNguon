import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/product.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete existing products
    await Product.deleteMany({});
    console.log("🗑️  Deleted existing products");

    // Sample products
    const products = [
      {
        name: "Áo Denim Classic",
        description: "Áo denim cổ điển màu xanh, chất liệu bền bỉ",
        price: 599000,
        discount: 50,
        quantity: 100,
        images: ["https://via.placeholder.com/300x400?text=Ao+Denim+1"]
      },
      {
        name: "Quần Jeans Blue",
        description: "Quần jeans xanh dương, phong cách casual",
        price: 799000,
        discount: 50,
        quantity: 80,
        images: ["https://via.placeholder.com/300x400?text=Quan+Jeans+1"]
      },
      {
        name: "Áo Khoác Denim",
        description: "Áo khoác denim, thích hợp cho mùa thu đông",
        price: 899000,
        discount: 50,
        quantity: 60,
        images: ["https://via.placeholder.com/300x400?text=Ao+Khoac+1"]
      },
      {
        name: "Quần Chinos",
        description: "Quần chinos thoải mái, màu beige",
        price: 699000,
        discount: 50,
        quantity: 90,
        images: ["https://via.placeholder.com/300x400?text=Quan+Chinos+1"]
      },
      {
        name: "Áo Polo Premium",
        description: "Áo polo cao cấp, vải cotton 100%",
        price: 499000,
        discount: 50,
        quantity: 120,
        images: ["https://via.placeholder.com/300x400?text=Ao+Polo+1"]
      },
      {
        name: "Quần Short",
        description: "Quần short thể thao, thoáng khí",
        price: 399000,
        discount: 50,
        quantity: 150,
        images: ["https://via.placeholder.com/300x400?text=Quan+Short+1"]
      },
      {
        name: "Áo Sơ Mi Denim",
        description: "Áo sơ mi denim, kiểu dáng hiện đại",
        price: 549000,
        discount: 50,
        quantity: 70,
        images: ["https://via.placeholder.com/300x400?text=Ao+Somi+1"]
      },
      {
        name: "Quần Jean Slim Fit",
        description: "Quần jeans slim fit, ôm vừa vặn",
        price: 750000,
        discount: 50,
        quantity: 95,
        images: ["https://via.placeholder.com/300x400?text=Quan+Slim+1"]
      },
      {
        name: "Áo Khoác Denim Premium",
        description: "Áo khoác denim premium, chất liệu nhập khẩu",
        price: 950000,
        discount: 50,
        quantity: 50,
        images: ["https://via.placeholder.com/300x400?text=Ao+Khoac+Premium+1"]
      },
      {
        name: "Quần Baggy Denim",
        description: "Quần baggy denim, phong cách streetwear",
        price: 650000,
        discount: 50,
        quantity: 85,
        images: ["https://via.placeholder.com/300x400?text=Quan+Baggy+1"]
      }
    ];

    const created = await Product.insertMany(products);
    console.log(`✅ Created ${created.length} products`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedProducts();
