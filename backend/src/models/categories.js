import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema(
  {
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories", // tham chiếu đến chính nó
      default: null,
    },

    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Slug là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
    },

    display_order: {
      type: Number,
      default: 0,
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default mongoose.model("categories", categoriesSchema);
