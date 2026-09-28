import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

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
const server = http.createServer(app);

// ========================================
// CORS
// ========================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://manguon-2.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép request không có origin
      // Ví dụ Postman, server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ========================================
// SOCKET.IO
// ========================================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// ========================================
// PORT
// ========================================
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// STATIC FILES
// ========================================
app.use("/uploads", express.static("uploads"));

// ========================================
// MONGODB
// ========================================
console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Kết nối MongoDB Atlas thành công!");
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối MongoDB:", err);
  });

// ========================================
// SOCKET.IO - REALTIME CHAT
// ========================================
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);
socket.on("send_message", (data) => {
    console.log("📩 Tin nhắn nhận được:", data);

    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ========================================
// API TEST
// ========================================
app.get("/", (req, res) => {
  res.json({
    message: "Server & MongoDB Atlas đang hoạt động!",
    status: "OK"
  });
});

// ========================================
// API ROUTES
// ========================================

app.use("/api/products", productRoutes);

app.use("/api/users", userRoutes);

app.use("/api/categories", categoriesRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/Order", OrderRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/coupons", couponRoutes);

app.use("/api/payments", PaymentRoutes);

app.use("/api/Shipping", ShippingRoutes);

app.use("/api/whishlist", Wishlist);

app.use("/api/variant", ProductVariant);

app.use("/api/auth/social", socialAuthRoutes);

// ========================================
// 404
// ========================================
app.use((req, res) => {
  res.status(404).json({
    message: "API không tồn tại",
    path: req.originalUrl
  });
});

// ========================================
// ERROR HANDLER
// ========================================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS không cho phép origin này",
      origin: req.headers.origin
    });
  }

  res.status(500).json({
    message: "Internal Server Error"
  });
});

// ========================================
// START SERVER
// ========================================
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
});
