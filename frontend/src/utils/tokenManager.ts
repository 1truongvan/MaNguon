export const tokenManager = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: Record<string, unknown>) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  isLoggedIn: (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;
    return !tokenManager.isTokenExpired(token);
  },

  // FIX decode Base64URL and UTF-8
  isTokenExpired: (token: string | null): boolean => {
    if (!token) return true;

    try {
      const decodeBase64Url = (str: string) =>
        JSON.parse(decodeURIComponent(atob(str.replace(/-/g, "+").replace(/_/g, "/"))
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")));

      const payload = decodeBase64Url(token.split(".")[1]);
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      console.error("Token decode error:", e);
      return true;
    }
  },
};

export default tokenManager;
