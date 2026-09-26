import express from "express";
import { verifyToken, isAdmin } from "../middlewares/auth.js";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  cancelOrder,
  updateOrderInfo
} from "../controller/Ordercontroller.js";
const router = express.Router();
router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getUserOrders);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id/update-info", verifyToken, updateOrderInfo);
router.put("/:id/cancel", verifyToken, cancelOrder);  
router.get("/admin/all", verifyToken, isAdmin, getAllOrders);
router.put("/:id", verifyToken, isAdmin, updateOrderStatus);
router.delete("/:id", verifyToken, isAdmin, deleteOrder);
export default router;