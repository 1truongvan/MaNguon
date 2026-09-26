import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payment_date: { 
    type: String, 
    enum: ["VNPAY", "MOMO", "COD", "ATM"], 
    required: true 
  },
  transaction_id: { type: String, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "VND" },
  status: { type: String, enum: ["pending","success","failed","refunded"], default: "pending" },
  gateway_response: { type: mongoose.Schema.Types.Mixed },
  paid_at: { type: Date },
  refunded_at: { type: Date },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
