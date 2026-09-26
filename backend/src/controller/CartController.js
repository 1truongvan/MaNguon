import CartItem from "../models/Cart.js";
import product from "../models/product.js";
import "../models/ProductVariant.js"
import mongoose from "mongoose";
// 📌 Thêm sản phẩm vào giỏ
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // từ verifyToken
    const { product_id, product_variant_id, quantity } = req.body;
    // Kiểm tra product_id hợp lệ
    if (!mongoose.Types.ObjectId.isValid(product_id)) {
      return res.status(400).json({ message: "sản phẩm ko hợp lệ " });
    }
    // Kiểm tra product_variant_id nếu có
    let variantId = null;
    if (product_variant_id) {
      if (!mongoose.Types.ObjectId.isValid(product_variant_id)) {
        return res.status(400).json({ message: "product_variant_id không hợp lệ" });
      }
      variantId = product_variant_id;
    }
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    let cartItem = await CartItem.findOne({
      user_id: userId,
      product_id,
      product_variant_id: variantId
    });
    if (cartItem) {
      // Nếu đã có, tăng số lượng
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Nếu chưa có, tạo mới
      cartItem = new CartItem({
        user_id: userId,
        product_id,
        product_variant_id: variantId,
        quantity
      });
      await cartItem.save();
    }
    res.status(200).json({ message: "Thêm sản phẩm vào giỏ thành công", cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
// 📌 Lấy giỏ hàng
export const getCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const items = await CartItem.find({ user_id })
      .populate("product_id")
      .populate("product_variant_id");
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng" });
  }
};
// 📌 Cập nhật số lượng
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await CartItem.findById(id);
    if (!item) return res.status(404).json({ message: "Item không tồn tại" });

    item.quantity = quantity;
    item.updated_at = new Date();
    await item.save();

    res.json({ message: "Cập nhật thành công", cartItem: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật giỏ hàng" });
  }
};
// 📌 Xóa sản phẩm
export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    await CartItem.findByIdAndDelete(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
  }
};
// 📌 Xóa toàn bộ giỏ hàng của user
export const clearCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    await CartItem.deleteMany({ user_id });
    res.json({ message: "Xóa toàn bộ giỏ hàng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa giỏ hàng" });
  }
};