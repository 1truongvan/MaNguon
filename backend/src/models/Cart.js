import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  product_variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", default: null },
  quantity: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

cartItemSchema.index({ user_id: 1, product_id: 1, product_variant_id: 1 }, { unique: true });

export default mongoose.model("CartItem", cartItemSchema);
