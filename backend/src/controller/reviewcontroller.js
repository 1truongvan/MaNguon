import Review from "../models/review.js";
import Product from "../models/product.js";

// 🟢 Tạo đánh giá mới (sau khi mua hàng)
export const createReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user.id; // lấy từ middleware verifyToken

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    // Kiểm tra user đã đánh giá chưa
    const existing = await Review.findOne({ product_id, user_id });
    if (existing) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
    }

    const review = new Review({ product_id, user_id, rating, comment });
    await review.save();

    res.status(201).json({ message: "Đánh giá thành công", review });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo đánh giá", error: error.message });
  }
};

// 🟡 Lấy tất cả đánh giá của 1 sản phẩm
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product_id: productId })
      .populate("user_id", "name email") // chỉ hiển thị tên + email user
      .sort({ created_at: -1 });

    if (reviews.length === 0)
      return res.json({ message: "Chưa có đánh giá cho sản phẩm này" });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đánh giá", error: error.message });
  }
};

// 🟣 Admin hoặc user có thể xóa review của chính mình
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });

    if (review.user_id.toString() !== user_id.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: "Không có quyền xóa đánh giá này" });

    await review.deleteOne();
    res.json({ message: "Đã xóa đánh giá thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa đánh giá", error: error.message });
  }
};
