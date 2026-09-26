import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  discount_type: { type: String, enum: ["percentage", "fixed", "free_shipping"], required: true },
  discount_value: { type: Number, required: true },
  max_discount_amount: Number,
  min_order_value: Number,
  applicable_to: { type: String, default: "all" }, 
  applicable_ids: { type: [Number], default: [] },
  max_total_uses: Number,
  max_uses_per_user: { type: Number, default: 1 },
  current_uses: { type: Number, default: 0 },
  valid_from: { type: Date, required: true },
  valid_until: { type: Date, required: true },
  is_active: { type: Boolean, default: true },
  is_public: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
export default mongoose.model("Coupon", couponSchema);
