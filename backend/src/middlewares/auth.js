import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("🔐 verifyToken - Auth header:", authHeader ? "exists" : "missing");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ verifyToken - No authorization header or invalid format");
      return res.status(401).json({ message: "Không có token" });
    }
    
    const token = authHeader.split(" ")[1]; // "Bearer token"
    if (!token) {
      console.log("❌ verifyToken - No token after Bearer");
      return res.status(401).json({ message: "Không có token" });
    }

    console.log("🔐 verifyToken - Token exists, length:", token.length);
    
    const decoded = jwt.verify(token, "secretkey");
    console.log("🔐 verifyToken - Token decoded successfully, userId:", decoded.id);
    
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      console.log("❌ verifyToken - User not found in database, userId:", decoded.id);
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    console.log("✅ verifyToken - User found:", {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    });

    next();
  } catch (err) {
    console.error("❌ verifyToken - Error:", err.message);
    res.status(403).json({ message: "Token không hợp lệ", error: err.message });
  }
};

// Kiểm tra quyền admin
export const isAdmin = (req, res, next) => {
  console.log("🔐 isAdmin - Checking admin permission:", {
    hasUser: !!req.user,
    userId: req.user?._id,
    userEmail: req.user?.email,
    userRole: req.user?.role
  });
  
  if (!req.user) {
    console.log("❌ isAdmin - No user in request");
    return res.status(403).json({ message: "Không tìm thấy thông tin người dùng" });
  }
  
  if (req.user.role !== "admin") {
    console.log("❌ isAdmin - User is not admin. Role:", req.user.role);
    return res.status(403).json({ 
      message: "Bạn không có quyền admin",
      currentRole: req.user.role 
    });
  }
  
  console.log("✅ isAdmin - User is admin, permission granted");
  next();
};
