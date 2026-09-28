import React, { useState, useCallback, useEffect } from "react";
import "../../assets/css/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import tokenManager from "../../utils/tokenManager";
import ForgotPasswordModal from "../ForgotPasswordModal";

interface GoogleAccount {
  initialize: (config: Record<string, unknown>) => void;
  renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
}

interface GoogleAccounts {
  id: GoogleAccount;
}

interface GoogleWindow {
  accounts: GoogleAccounts;
}

declare global {
  interface Window {
    FB?: {
      init: (config: Record<string, unknown>) => void;
      login: (callback: (response: FacebookResponse) => void, options: Record<string, unknown>) => void;
      api: (path: string, method: string, params: Record<string, unknown>, callback: (response: FacebookUserInfo) => void) => void;
    };
  }
}

interface FacebookResponse {
  authResponse?: {
    accessToken: string;
  };
}

interface FacebookUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: {
    data?: {
      url: string;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleWindow;
    FB?: {
      init: (config: Record<string, unknown>) => void;
      login: (callback: (response: FacebookResponse) => void, options: Record<string, unknown>) => void;
      api: (path: string, method: string, params: Record<string, unknown>, callback: (response: FacebookUserInfo) => void) => void;
    };
    fbAsyncInit?: () => void;
  }
}


const LoginPage: React.FC = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Login state
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);

  const navigate = useNavigate();


  // 🔹 Google Callback
const handleGoogleResponse = useCallback(
  async (response: { credential: string }) => {
    try {
      const res = await axios.post(
        "https://manguon-2.onrender.com/api/auth/social/google/callback",
        { credential: response.credential }
      );

      if (res.data.accessToken) {
        tokenManager.setTokens(res.data.accessToken, res.data.refreshToken);
        tokenManager.setUser(res.data.user);
        alert("Đăng nhập Google thành công!");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Google login error:", error?.response?.data || error);
      alert("Lỗi đăng nhập Google!");
    }
  },
  [navigate]
);


  // 🔹 Facebook Callback
  const handleFacebookResponse = useCallback(
    async (userInfo: FacebookUserInfo) => {
      try {
        const res = await axios.post(
          "https://manguon-2.onrender.com/api/auth/social/facebook/callback",
          {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
          }
        );

        tokenManager.setTokens(res.data.accessToken, res.data.refreshToken);
        tokenManager.setUser(res.data.user);

        alert("Đăng nhập Facebook thành công!");
        navigate("/");
      } catch (error: unknown) {
        console.error("Facebook login error:", error);
        alert("Lỗi đăng nhập Facebook!");
      }
    },
    [navigate]
  );

  // 🔹 Load Google & Facebook SDK
  useEffect(() => {
    // Load Google SDK
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        window.google?.accounts.id.initialize({
          client_id: "177231615180-g7c68efiksnjpajguad6sp1qkme6dl81.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });
        window.google?.accounts.id.renderButton(
          document.getElementById("google-signin") as HTMLElement,
          {
            theme: "outline",
            size: "large",
            width: "100%",
          }
        );
      };
      document.body.appendChild(script);
    };

    // Load Facebook SDK
    const loadFacebookScript = () => {
      if (!window.FB) {
        window.fbAsyncInit = function () {
          window.FB?.init({
            appId: "1167329631590386",
            xfbml: true,
            version: "v18.0",
          });
        };

        const script = document.createElement("script");
        script.src =
          "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadGoogleScript();
    loadFacebookScript();
  }, [handleGoogleResponse]);

  // 🔹 Facebook Login
  const handleFacebookSignUp = () => {
    const FB = window.FB;
    if (!FB) {
      alert("Facebook SDK chưa được tải!");
      return;
    }

    FB.login(
      (response: FacebookResponse) => {
        if (response.authResponse) {
          FB.api(
            "/me",
            "GET",
            { fields: "id,name,email,picture" },
            (userInfo: FacebookUserInfo) => {
              handleFacebookResponse(userInfo);
            }
          );
        }
      },
      { scope: "public_profile,email" }
    );
  };

  // Xử lý login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://manguon-2.onrender.com/api/users/login", {
        email: emailOrPhone,
        password: password,
      });

      console.log("Login success:", res.data);

      if (res.data.accessToken) {
        tokenManager.setTokens(res.data.accessToken, res.data.refreshToken);
        tokenManager.setUser(res.data.user);
      }

      alert("Đăng nhập thành công!");
      navigate("/"); // chuyển về Home
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      alert("Đăng nhập thất bại! Vui lòng kiểm tra email/mật khẩu.");
    }
  };

  // Xử lý register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://manguon-2.onrender.com/api/users/register", {
        name,
        phone,
        email,
        password: regPassword,
      });

      console.log("Register success:", res.data);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      setIsLoginTab(true); // chuyển sang tab login
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      alert("Đăng ký thất bại! Vui lòng thử lại.");
    }
  };


  // 🔹 Xử lý quên mật khẩu (deprecated - moved to ForgotPasswordModal component)
  // const handleForgotPassword = async (e: React.FormEvent) => {
  // This function is now handled in ForgotPasswordModal component
  // };

  return (
    <div className="login-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Trang chủ</a> / <a href="/categories">Danh mục</a> /{" "}
        <a href="/account">Tài khoản</a> / <span className="current">Đăng nhập</span>
      </div>

      <h2 className="login-title">ĐĂNG NHẬP TÀI KHOẢN</h2>

      <div className="login-box">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={isLoginTab ? "active" : ""}
            onClick={() => setIsLoginTab(true)}
          >
            ĐĂNG NHẬP
          </button>
          <button
            className={!isLoginTab ? "active" : ""}
            onClick={() => setIsLoginTab(false)}
          >
            ĐĂNG KÝ
          </button>
        </div>

        {isLoginTab ? (
          <form className="form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Nhập số điện thoại hoặc email"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙉" : "🙈"}
              </span>
            </div>
            <button type="submit" className="btn-login">
              ĐĂNG NHẬP
            </button>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="forgot"
              style={{
                background: "none",
                border: "none",
                color: "#d4a574",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Quên mật khẩu?

            </button>

            {/* 🔹 Social Login */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p>Hoặc đăng nhập bằng:</p>
              <div id="google-signin" style={{ marginBottom: "10px" }}></div>
              <button
                type="button"
                onClick={handleFacebookSignUp}
                className="btn-facebook"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#1877F2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Đăng nhập bằng Facebook
              </button>
            </div>
          </form>
        ) : (
          <form className="form" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
            <button type="submit" className="btn-login">
              ĐĂNG KÝ
            </button>
          </form>
        )}
      </div>

      {/* 🔹 Forgot Password Modal Component */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        onSuccess={() => {
          // Optional: Do something after successful password reset request
          console.log("✅ Password reset email sent successfully");
        }}
      />
    </div>
  );
};

export default LoginPage;