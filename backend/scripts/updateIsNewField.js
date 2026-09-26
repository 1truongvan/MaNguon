import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../src/models/product.js";

dotenv.config();

const updateProductsIsNew = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Đã kết nối MongoDB Atlas");

    // Cập nhật tất cả sản phẩm chưa có field is_new
    const result = await Product.updateMany(
      { is_new: { $exists: false } }, // Tìm các sản phẩm chưa có field is_new
      { $set: { is_new: false } } // Set mặc định là false
    );

    console.log(`✅ Đã cập nhật ${result.modifiedCount} sản phẩm với field is_new = false`);

    // Đếm tổng số sản phẩm
    const totalProducts = await Product.countDocuments();
    console.log(`📊 Tổng số sản phẩm trong database: ${totalProducts}`);

    await mongoose.disconnect();
    console.log("✅ Đã ngắt kết nối MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

updateProductsIsNew();

