import express from "express";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controller/cupponcontroller.js";
const router = express.Router();
router.get("/", getCoupons);
router.post("/", createCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);
router.post("/apply", applyCoupon);
export default router;