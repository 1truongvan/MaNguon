import express from "express";
import { getMongoDBInfo, checkDatabaseHealth } from "../controller/adminController.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Tất cả routes đều yêu cầu admin
router.get("/mongodb/info", verifyToken, isAdmin, getMongoDBInfo);
router.get("/mongodb/health", verifyToken, isAdmin, checkDatabaseHealth);

export default router;

