import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const SocialAuthComponent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleResponse = useCallback(
    async (response: { credential: string }) => {
      setLoading(true);
      try {
        const decoded = JSON.parse(atob(response.credential.split(".")[1])) as {
          sub: string;
          email: string;
          name: string;
          picture: string;
        };

        const res = await axios.post(
          "http://localhost:3000/api/auth/social/google/callback",
          {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
          }
        );

        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Đăng nhập Google thành công!");
        navigate("/");
      } catch (error: unknown) {
        console.error("Google login error:", error);
        alert("Lỗi đăng nhập Google!");
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // 🔹 Handle Google Login
  const handleGoogleSignUp = useCallback(() => {
    const google = window.google;
    if (google?.accounts?.id) {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById("google-signin") as HTMLElement,
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );
    }
  }, [handleGoogleResponse]);

  // 🔹 Handle Facebook Login
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

  const handleFacebookResponse = async (userInfo: FacebookUserInfo) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/social/facebook/callback",
        {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        }
      );

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Đăng nhập Facebook thành công!");
      navigate("/");
    } catch (error: unknown) {
      console.error("Facebook login error:", error);
      alert("Lỗi đăng nhập Facebook!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load Google SDK
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => handleGoogleSignUp();
      document.body.appendChild(script);
    };

    // Load Facebook SDK
    const loadFacebookScript = () => {
      if (!window.FB) {
        window.fbAsyncInit = function () {
          window.FB?.init({
            appId: "YOUR_FACEBOOK_APP_ID",
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
  }, [handleGoogleSignUp]);

  return (
    <div className="social-auth">
      <div
        id="google-signin"
        style={{ marginBottom: "10px" }}
      ></div>
      <button
        onClick={handleFacebookSignUp}
        disabled={loading}
        className="btn-facebook"
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#1877F2",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {loading ? "Đang xử lý..." : "Đăng nhập bằng Facebook"}
      </button>
    </div>
  );
};

export default SocialAuthComponent;
