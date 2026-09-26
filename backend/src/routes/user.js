import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  refreshToken,
  createUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  addPaymentMethod,
  deletePaymentMethod,
  changePassword,
} from "../controller/usercontroller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";

const router = express.Router();
router.post("/register", registerUser);

router.post("/login", loginUser);


// Quên mật khẩu
router.post("/forgot-password", forgotPassword);

//  Reset mật khẩu
router.post("/reset-password", resetPassword);
// Lấy thông tin user hiện tại
router.get("/me", verifyToken, getCurrentUser);


//Địa chỉ giao hàng
router.post("/me/shipping-addresses", verifyToken, addShippingAddress);
router.put("/me/shipping-addresses/:addressId", verifyToken, updateShippingAddress);
router.delete("/me/shipping-addresses/:addressId", verifyToken, deleteShippingAddress);

router.post("/me/payment-methods", verifyToken, addPaymentMethod);
router.delete("/me/payment-methods/:methodId", verifyToken, deletePaymentMethod);

// Đổi mật khẩu
router.post("/me/change-password", verifyToken, changePassword);

// ADMIN tạo người dùng ()

router.post("/create", verifyToken, isAdmin, createUser);

// Danh sách user (chỉ admin)
router.get("/", verifyToken, isAdmin, getAllUsers);

//  Lấy thông tin chi tiết user
router.get("/:id", verifyToken, getUserById);

// Cập nhật thông tin (user hoặc admin)
router.put("/:id", verifyToken, updateUser);

// Xóa người dùng
router.delete("/:id", verifyToken, deleteUser);

export default router;
