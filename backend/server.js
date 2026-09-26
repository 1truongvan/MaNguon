import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";                // 👈 Thêm
import { Server } from "socket.io";     // 👈 Thêm

import productRoutes from "./src/routes/Product.js"; 
import userRoutes from "./src/routes/user.js";       
import categoriesRoutes from "./src/routes/categories.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import OrderRoutes from "./src/routes/OrderRoutes.js";
import reviewRoutes from "./src/routes/review.js";
import couponRoutes from "./src/routes/cupponroutes.js";
import PaymentRoutes from "./src/routes/payments.js";
import ShippingRoutes from "./src/routes/shiping.js";
import Wishlist from "./src/routes/wishlist.js";
import socialAuthRoutes from "./src/routes/socialauth.js";
import ProductVariant from "./src/routes/productVariant.js";
dotenv.config();

const app = express();
const server = http.createServer(app);   // 👈 Dùng http.createServer
const io = new Server(server, {          // 👈 Tạo Socket server
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

console.log("MONGO_URI =", process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ================================
// 🔥 REALTIME CHAT SOCKET.IO
// ================================
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Nhận tin nhắn từ client
  socket.on("send_message", (data) => {
    console.log("📩 Tin nhắn nhận được:", data);

    // Phát lại đến tất cả client
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});
// ================================

// API ROUTES
app.get("/", (req, res) => {
  res.send("🚀 Server & MongoDB Atlas đang hoạt động!");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/Order", OrderRoutes); 
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);

app.use("/api/payments",PaymentRoutes)
app.use("/api/Shipping",ShippingRoutes)
app.use("/api/whishlist",Wishlist)

app.use("/api/payments", PaymentRoutes);
app.use("/api/Shipping", ShippingRoutes);
app.use("/api/whishlist", Wishlist);
app.use("/api/variant", ProductVariant);
app.use("/api/auth/social", socialAuthRoutes);

// 🔥 Chạy server (KHÔNG dùng app.listen)
server.listen(PORT, () => {
  console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
});
