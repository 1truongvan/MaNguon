import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  sku: { type: String, required: true, unique: true },
  size: String,
  color: String,
  material: String,
  variant_name: { type: String, required: true },
  price: { type: Number, default: 0 },
  discount_price: { type: Number },
  quantity: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  is_default: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// ⚠️ Đăng ký model đúng tên (ProductVariant)
export default mongoose.model("ProductVariant", productVariantSchema);
