import express from "express";
import {
  createShipping,
  getShippings,
  getShippingById,
  updateShipping,
  deleteShipping
} from "../controller/shippingcontroller.js";

const router = express.Router();

router.post("/", createShipping);
router.get("/", getShippings);
router.get("/:id", getShippingById);
router.put("/:id", updateShipping);
router.delete("/:id", deleteShipping);

export default router;
