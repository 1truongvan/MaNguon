import express from "express";
import {
  getAllVariants,
  getVariantsByProduct,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
} from "../controller/ProductVariant.js"

const router = express.Router();

router.get("/", getAllVariants);
router.get("/product/:productId", getVariantsByProduct);
router.get("/:id", getVariantById);
router.post("/", createVariant);
router.put("/:id", updateVariant);
router.delete("/:id", deleteVariant);

export default router;
