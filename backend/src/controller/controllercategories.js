import Category from "../models/categories.js";

// 🟢 Lấy tất cả danh mục
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("parent_id", "name slug");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 Lấy danh mục theo ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parent_id", "name slug");
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟠 Tạo danh mục mới
export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    // Kiểm tra trùng slug
    const existing = await Category.findOne({ slug });
    if (existing) return res.status(400).json({ message: "Slug đã tồn tại" });

    const newCategory = new Category(req.body);
    await newCategory.save();

    res.status(201).json({ message: "Tạo danh mục thành công", category: newCategory });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🟣 Cập nhật danh mục
export const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.status(200).json({ message: "Cập nhật thành công", category: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔴 Xóa danh mục
export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.status(200).json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
