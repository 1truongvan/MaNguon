import Shipping from "../models/shipping.js";

// Tạo shipping
export const createShipping = async (req, res) => {
  try {
    const shipping = new Shipping(req.body);
    const saved = await shipping.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Tạo shipping thất bại", error });
  }
};

// Lấy danh sách shipping
export const getShippings = async (req, res) => {
  try {
    const list = await Shipping.find().populate("user_id order_id");
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Lấy danh sách shipping thất bại", error });
  }
};

// Lấy chi tiết
export const getShippingById = async (req, res) => {
  try {
    const shipping = await Shipping.findById(req.params.id).populate("user_id order_id");
    if (!shipping) return res.status(404).json({ message: "Không tìm thấy shipping" });
    res.status(200).json(shipping);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy shipping", error });
  }
};

// Cập nhật shipping
export const updateShipping = async (req, res) => {
  try {
    const updated = await Shipping.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Không tồn tại shipping" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Cập nhật thất bại", error });
  }
};

// Xoá shipping
export const deleteShipping = async (req, res) => {
  try {
    const deleted = await Shipping.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy shipping" });
    res.status(200).json({ message: "Xoá shipping thành công" });
  } catch (error) {
    res.status(500).json({ message: "Xoá thất bại", error });
  }
};
