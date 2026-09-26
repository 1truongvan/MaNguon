import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.js";

dotenv.config();

const fixAdminRole = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Đã kết nối MongoDB Atlas");

    // Tìm user admin
    const adminEmail = "admin@icondenim.com";
    const user = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!user) {
      console.log(`❌ Không tìm thấy user với email: ${adminEmail}`);
      console.log("📋 Danh sách tất cả users trong database:");
      const allUsers = await User.find({});
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (role: ${u.role || 'undefined'})`);
      });
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`📋 Thông tin user hiện tại:`);
    console.log(`  - Email: ${user.email}`);
    console.log(`  - Role: ${user.role || 'undefined'}`);
    console.log(`  - ID: ${user._id}`);

    // Cập nhật role thành admin
    if (user.role !== "admin") {
      user.role = "admin";
      await user.save();
      console.log(`✅ Đã cập nhật role thành "admin" cho user: ${adminEmail}`);
    } else {
      console.log(`✅ User đã có role "admin" rồi, không cần cập nhật`);
    }

    // Xác nhận lại
    const updatedUser = await User.findById(user._id);
    console.log(`📋 Thông tin user sau khi cập nhật:`);
    console.log(`  - Email: ${updatedUser.email}`);
    console.log(`  - Role: ${updatedUser.role}`);
    console.log(`  - ID: ${updatedUser._id}`);

    await mongoose.disconnect();
    console.log("✅ Đã ngắt kết nối MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

fixAdminRole();

