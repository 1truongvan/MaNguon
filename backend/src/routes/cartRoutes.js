import express from "express";
import { addToCart, getCart, updateCartItem, removeCartItem, clearCart } from "../controller/cartController.js";
import { verifyToken,isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Thêm sản phẩm
router.post("/add", verifyToken, addToCart);
// Lấy giỏ hàng
router.get("/", verifyToken, getCart);
// Cập nhật số lượng
router.put("/:id", verifyToken, updateCartItem);

// Xóa sản phẩm
router.delete("/:id", verifyToken, removeCartItem);

// Xóa toàn bộ giỏ
router.delete("/clear/all", verifyToken, clearCart);

export default router;
