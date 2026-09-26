import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  order_number: { type: String, required: true, unique: true },

  // 📦 Thông tin người nhận
  customer_name: { type: String, required: true },
  customer_phone: { type: String, required: true },
  customer_email: { type: String },
  shipping_address: { type: String, required: true },
  shipping_ward: { type: String },
  shipping_district: { type: String },
  shipping_province: { type: String },

  // 🛒 DANH SÁCH SẢN PHẨM (QUAN TRỌNG NHẤT)
items: [
  {
    product_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }
],

  // 💰 Giá tiền
  subtotal: { type: Number, required: true },
  shipping_fee: { type: Number, default: 0 },
  discount_amount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total_price: { type: Number, required: true },

  // 💳 Thanh toán & giao hàng
  payment_method: { 
    type: String, 
    enum: ["COD", "VNPAY", "MOMO","ATM"], 
    default: "COD" 
  },
  payment_status: { 
    type: String, 
    enum: ["pending", "paid", "failed", "refunded"], 
    default: "pending" 
  },
  shipping_method: { type: String, enum: ["Standard", "Express"], default: "Standard" },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },

  // 📝 Ghi chú
  customer_note: { type: String },
  admin_note: { type: String },
  cancel_reason: { type: String },

  // ⏱️ Thời gian xử lý
  confirmed_at: { type: Date },
  shipped_at: { type: Date },
  delivered_at: { type: Date },
  cancelled_at: { type: Date },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
