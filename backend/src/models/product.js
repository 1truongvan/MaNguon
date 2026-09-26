import mongoose from "mongoose";
import "./categories.js"; // ✅ thêm dòng này để đăng ký schema Category


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  discount: Number,
  quantity: Number,
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  images: [String],
  is_new: { type: Boolean, default: false }, // Đánh dấu hàng mới
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model("Product", productSchema);
