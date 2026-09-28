import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/login.css";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value && password && value !== password) {
      setConfirmPasswordError("Mật khẩu không khớp");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validation
    if (!password.trim()) {
      setPasswordError("Mật khẩu là bắt buộc");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu không khớp");
      setLoading(false);
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Gửi reset password request");

      const res = await axios.post("https://manguon-4d.onrender.com/api/users/reset-password", {
        token,
        password,
        confirmPassword,
      });

      console.log("✅ Reset password response:", res.data);
      setMessage("✅ " + (res.data.message || "Mật khẩu đã được cập nhật thành công!"));
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error: unknown) {
      console.error("❌ Reset password error:", error);

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setMessage("❌ " + error.response.data.message);
      } else {
        setMessage("❌ Có lỗi xảy ra. Vui lòng thử lại!");
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-container">
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            padding: "20px",
            backgroundColor: "#f8d7da",
            borderRadius: "8px",
            color: "#721c24",
          }}
        >
          <h3>❌ Lỗi</h3>
          <p>Token reset mật khẩu không hợp lệ hoặc đã hết hạn!</p>
          <button
            onClick={() => navigate("/login")}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#d4a574",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="breadcrumb">
        <a href="/">Trang chủ</a> / <span className="current">Reset Mật khẩu</span>
      </div>

      <h2 className="login-title">🔐 RESET MẬT KHẨU</h2>

      <div className="login-box" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <form className="form" onSubmit={handleResetPassword}>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
            Nhập mật khẩu mới để tiếp tục
          </p>

          {/* Password Input */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}>
              🔑 Mật khẩu mới
            </label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu mới"
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
                style={{
                  borderColor: passwordError ? "#dc3545" : "#ccc",
                  backgroundColor: passwordError ? "#fff5f5" : "transparent",
                }}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙉" : "🙈"}
              </span>
            </div>
            {passwordError && (
              <span style={{ fontSize: "12px", color: "#dc3545", marginTop: "4px" }}>
                {passwordError}
              </span>
            )}
          </div>

          {/* Confirm Password Input */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}>
              ✔️ Xác nhận mật khẩu
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={loading}
              style={{
                padding: "12px",
                border: "none",
                borderBottom: confirmPasswordError ? "2px solid #dc3545" : "1px solid #ccc",
                outline: "none",
                fontSize: "15px",
                background: confirmPasswordError ? "#fff5f5" : "transparent",
                backgroundColor: confirmPasswordError ? "#fff5f5" : "transparent",
                width: "100%",
              }}
            />
            {confirmPasswordError && (
              <span style={{ fontSize: "12px", color: "#dc3545", marginTop: "4px" }}>
                {confirmPasswordError}
              </span>
            )}
          </div>

          {/* Message Display */}
          {message && (
            <div
              style={{
                marginBottom: "15px",
                padding: "12px 14px",
                backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
                color: messageType === "success" ? "#155724" : "#721c24",
                borderRadius: "6px",
                textAlign: "center",
                fontWeight: "500",
                border: messageType === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
              }}
            >
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              type="submit"
              disabled={loading || !!passwordError || !!confirmPasswordError}
              className="btn-login"
              style={{
                opacity: loading || !!passwordError || !!confirmPasswordError ? 0.6 : 1,
                cursor:
                  loading || !!passwordError || !!confirmPasswordError
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {loading ? "Đang xử lý..." : "🔄 Reset Mật khẩu"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="btn-login"
              style={{
                backgroundColor: "#999",
                flex: 1,
              }}
            >
              ← Quay lại Đăng nhập
            </button>
          </div>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#999",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #eee",
          }}
        >
          💡 Mật khẩu phải có ít nhất 6 ký tự
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
