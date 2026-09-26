import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên người dùng là bắt buộc"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      validate: {
        validator: function(v) {
          if (!v || v === '') return true;
          return v.length >= 6;
        },
        message: "Mật khẩu ít nhất 6 ký tự khi được cung cấp"
      }
    },
    phone: {
      type: String,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
    },
    avatar: {
      type: String,
      default: "",
    },
    // Thông tin cá nhân bổ sung
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    // Địa chỉ giao hàng (nhiều địa chỉ)
    shippingAddresses: [{
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      ward: { type: String },
      district: { type: String },
      province: { type: String },
      isDefault: { type: Boolean, default: false },
      note: { type: String },
    }],
    //  Phương thức thanh toán
    paymentMethods: [{
      type: { 
        type: String, 
        enum: ["credit_card", "debit_card", "momo", "zalopay", "vnpay", "paypal"],
        required: true 
      },
      cardNumber: { type: String },
      cardHolder: { type: String },
      expiryDate: { type: String },
      cvv: { type: String },
      phone: { type: String }, // Cho ví điện tử
      isDefault: { type: Boolean, default: false },
    }],
    // Cấp độ thành viên
    membershipLevel: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
    },
    membershipPoints: {
      type: Number,
      default: 0,
    },
    // Thiết lập tài khoản
    language: {
      type: String,
      default: "vi",
    },
    timezone: {
      type: String,
      default: "Asia/Ho_Chi_Minh",
    },
    privacySettings: {
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
      allowMarketing: { type: Boolean, default: true },
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_verified_at: {
      type: Date,
      default: null,
    },
    email_verified_at: {
      type: Date,
      default: null,
    },
    last_login_at: {
      type: Date,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
const User = mongoose.model("User", userSchema);
export default User;