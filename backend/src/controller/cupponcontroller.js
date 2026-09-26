import Coupon from "../models/coupon.js";

// [GET] /api/coupons - Lấy danh sách coupon
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

// [POST] /api/coupons - Tạo coupon (Admin)
export const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json({ success: true, message: "Tạo mã giảm giá thành công", data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: "Không thể tạo coupon", error });
  }
};

// [PUT] /api/coupons/:id - Cập nhật coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: "Không tìm thấy coupon" });
    res.json({ success: true, message: "Cập nhật thành công", data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: "Lỗi khi cập nhật", error });
  }
};

// [DELETE] /api/coupons/:id - Xóa coupon
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Không tìm thấy coupon" });
    res.json({ success: true, message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa coupon", error });
  }
};

// [POST] /api/coupons/apply - Áp dụng mã giảm giá
export const applyCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code });

    if (!coupon || !coupon.is_active)
      return res.status(400).json({ success: false, message: "Mã giảm giá không hợp lệ" });

    const now = new Date();
    if (now < coupon.valid_from || now > coupon.valid_until)
      return res.status(400).json({ success: false, message: "Mã giảm giá đã hết hạn" });

    if (subtotal < (coupon.min_order_value || 0))
      return res.status(400).json({ success: false, message: "Đơn hàng không đủ điều kiện áp dụng" });

    let discountAmount = 0;
    if (coupon.discount_type === "percentage") {
      discountAmount = (subtotal * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    } else if (coupon.discount_type === "fixed") {
      discountAmount = coupon.discount_value;
    }

    const totalAfterDiscount = Math.max(0, subtotal - discountAmount);

    res.json({
      success: true,
      message: "Áp dụng mã giảm giá thành công",
      data: {
        code: coupon.code,
        discountAmount,
        totalAfterDiscount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi áp dụng mã giảm giá", error });
  }
};
