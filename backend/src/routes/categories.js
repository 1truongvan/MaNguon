import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/controllercategories.js";

import { verifyToken, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public: xem danh mục
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin-only: thêm, sửa, xóa
router.post("/", verifyToken, isAdmin ,createCategory);
router.put("/:id", verifyToken,isAdmin,  updateCategory);
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

export default router;