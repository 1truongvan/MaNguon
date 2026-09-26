import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", unique: true, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postal_code: { type: String },
  phone: { type: String, required: true },
  shipping_method: { type: String, enum: ["standard", "express", "pickup"], default: "standard" },
  tracking_number: { type: String },
  shipping_status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
  shipped_at: { type: Date },
  delivered_at: { type: Date },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

const Shipping = mongoose.model("Shipping", shippingSchema);
export default Shipping;
