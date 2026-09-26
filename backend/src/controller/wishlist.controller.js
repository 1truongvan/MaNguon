import Wishlist from "../models/Wishlist.js";

// Thêm sản phẩm vào wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    const exist = await Wishlist.findOne({ user_id, product_id });
    if (exist) return res.status(400).json({ message: "Sản phẩm đã có trong wishlist" });

    const item = await Wishlist.create({ user_id, product_id });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: "Thêm thất bại", error });
  }
};

// Lấy wishlist của người dùng
export const getWishlist = async (req, res) => {
  try {
    const list = await Wishlist.find({ user_id: req.params.userId }).populate("product_id");
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Lấy wishlist thất bại", error });
  }
};

// Xoá sản phẩm khỏi wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    const removed = await Wishlist.findOneAndDelete({ user_id, product_id });
    if (!removed) return res.status(404).json({ message: "Không tìm thấy sản phẩm trong wishlist" });
    res.status(200).json({ message: "Đã xoá khỏi wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Xoá thất bại", error });
  }
};
