import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} from "../controller/wishlist.controller.js";

const router = express.Router();

router.post("/", addToWishlist);
router.get("/:userId", getWishlist);
router.delete("/", removeFromWishlist);

export default router;
