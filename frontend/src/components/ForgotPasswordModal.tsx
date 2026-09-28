import React, { useState } from "react";
import axios from "axios";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Step 1: Request password reset
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  // Step 1 states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [emailError, setEmailError] = useState("");

  // Step 2 states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetMessageType, setResetMessageType] = useState<"success" | "error">("error");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Validate email format
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError("");

    if (value && !validateEmail(value)) {
      setEmailError("Email không hợp lệ");
    }
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

  // Step 1: Send email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email là bắt buộc");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ");
      return;
    }

    setLoading(true);

    try {
      console.log("📧 Gửi forgot password request với email:", email);

      const res = await axios.post("https://manguon-2.onrender.com/api/users/forgot-password", {
        email: email.trim(),
      });

      console.log("✅ Backend response:", res.data);
      setMessage("✅ Email hợp lệ! Tiếp tục để đặt mật khẩu mới");
      setMessageType("success");
      setResetToken(res.data.resetToken); // Get token from response

      // Auto-switch to reset tab after 1.5 seconds
      setTimeout(() => {
        setStep("reset");
        setMessage("");
        setEmail("");
      }, 1500);
    } catch (err: unknown) {
      console.error("❌ Full error object:", err);

      if (axios.isAxiosError(err)) {
        console.error("❌ Axios error response:", err.response?.data);
        const errorMsg =
          err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
        setMessage(errorMsg);
      } else if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Có lỗi xảy ra. Vui lòng thử lại!");
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage("");

    if (!password.trim()) {
      setPasswordError("Mật khẩu là bắt buộc");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu không khớp");
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    setResetLoading(true);

    try {
      console.log("🔄 Gửi reset password request");

      const res = await axios.post("https://manguon-2.onrender.com/api/users/reset-password", {
        token: resetToken,
        password,
        confirmPassword,
      });

      console.log("✅ Reset password response:", res.data);
      setResetMessage("✅ " + (res.data.message || "Mật khẩu đã được cập nhật thành công!"));
      setResetMessageType("success");

      setTimeout(() => {
        onClose();
        setStep("email");
        setResetMessage("");
        setPassword("");
        setConfirmPassword("");
        setResetToken("");
        onSuccess?.();
      }, 2000);
    } catch (error: unknown) {
      console.error("❌ Reset password error:", error);

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setResetMessage("❌ " + error.response.data.message);
      } else {
        setResetMessage("❌ Có lỗi xảy ra. Vui lòng thử lại!");
      }
      setResetMessageType("error");
    } finally {
      setResetLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-modal">
        {/* Close button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          title="Đóng"
          type="button"
        >
          ✕
        </button>

        {/* Step 1: Email Input */}
        {step === "email" ? (
          <>
            <div className="modal-header">
              <h2>🔐 Quên Mật Khẩu?</h2>
              <p className="modal-subtitle">
                Nhập email để nhận hướng dẫn reset mật khẩu
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="forgot-email" className="form-label">
                  📧 Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="nhập email của bạn"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                  className={`form-input ${emailError ? "input-error" : ""}`}
                />
                {emailError && (
                  <span className="error-message">{emailError}</span>
                )}
              </div>

              {message && (
                <div
                  className={`message-box ${
                    messageType === "success" ? "success" : "error"
                  }`}
                >
                  {messageType === "success" ? "✅" : "❌"} {message}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="submit"
                  disabled={loading || !!emailError}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span> Đang xử lý...
                    </>
                  ) : (
                    "📤 Tiếp tục"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
              </div>
            </form>

            <p className="modal-help-text">
              💡 Kiểm tra folder Spam nếu không nhận được hướng dẫn
            </p>
          </>
        ) : (
          <>
            {/* Step 2: Reset Password */}
            <div className="modal-header">
              <h2>🔑 Đặt Mật Khẩu Mới</h2>
              <p className="modal-subtitle">
                Nhập mật khẩu mới để hoàn tất quá trình
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="forgot-password-form">
              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="new-password" className="form-label">
                  🔑 Mật khẩu mới
                </label>
                <div style={{ position: "relative", display: "flex" }}>
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu mới"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={resetLoading}
                    className={`form-input ${passwordError ? "input-error" : ""}`}
                    style={{ flex: 1, marginRight: "8px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      padding: "8px",
                    }}
                  >
                    {showPassword ? "🙉" : "🙈"}
                  </button>
                </div>
                {passwordError && (
                  <span className="error-message">{passwordError}</span>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">
                  ✔️ Xác nhận mật khẩu
                </label>
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  disabled={resetLoading}
                  className={`form-input ${
                    confirmPasswordError ? "input-error" : ""
                  }`}
                />
                {confirmPasswordError && (
                  <span className="error-message">{confirmPasswordError}</span>
                )}
              </div>

              {resetMessage && (
                <div
                  className={`message-box ${
                    resetMessageType === "success" ? "success" : "error"
                  }`}
                >
                  {resetMessageType === "success" ? "✅" : "❌"} {resetMessage}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="submit"
                  disabled={
                    resetLoading || !!passwordError || !!confirmPasswordError
                  }
                  className="btn btn-primary"
                >
                  {resetLoading ? (
                    <>
                      <span className="spinner"></span> Đang xử lý...
                    </>
                  ) : (
                    "✅ Xác nhận"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setPassword("");
                    setConfirmPassword("");
                    setResetMessage("");
                    setPasswordError("");
                    setConfirmPasswordError("");
                  }}
                  disabled={resetLoading}
                  className="btn btn-secondary"
                >
                  ← Quay lại
                </button>
              </div>
            </form>

            <p className="modal-help-text">
              💡 Mật khẩu phải có ít nhất 6 ký tự
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
