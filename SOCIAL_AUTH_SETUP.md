# 🔐 Hướng Dẫn Cấu Hình Đăng Nhập Google & Facebook

## 📋 Yêu Cầu
- Tài khoản Google Cloud Console
- Tài khoản Facebook Developers

---

## 1️⃣ CẤU HÌNH GOOGLE LOGIN

### Bước 1: Tạo OAuth 2.0 Client ID
1. Truy cập: https://console.cloud.google.com/
2. Tạo dự án mới hoặc chọn dự án hiện tại
3. Vào **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Chọn **Web application**
5. Thêm URIs:
   - **Authorized JavaScript origins**: 
     - http://localhost:5173
     - http://localhost:3000
   - **Authorized redirect URIs**:
     - http://localhost:3000/api/auth/social/google/callback
     - http://localhost:5173

### Bước 2: Cập nhật Client ID
- Lấy **Client ID** từ Google Console
- Mở file: `frontend/src/components/page/login.tsx`
- Tìm dòng: `client_id: "YOUR_GOOGLE_CLIENT_ID"`
- Thay thế `YOUR_GOOGLE_CLIENT_ID` bằng Client ID của bạn

### Ví dụ:
```typescript
client_id: "1234567890-abcdefghij.apps.googleusercontent.com",
```

---

## 2️⃣ CẤU HÌNH FACEBOOK LOGIN

### Bước 1: Tạo Facebook App
1. Truy cập: https://developers.facebook.com/
2. Tạo app mới → chọn **Consumer** type
3. Thêm product: **Facebook Login**
4. Configure Facebook Login

### Bước 2: Lấy App ID và App Secret
1. Vào **Settings** → **Basic**
2. Lấy **App ID**
3. Lấy **App Secret**

### Bước 3: Cấu Hình Valid URIs
1. Vào **Products** → **Facebook Login** → **Settings**
2. Thêm vào **Valid OAuth Redirect URIs**:
   - http://localhost:3000/api/auth/social/facebook/callback
   - http://localhost:5173
3. Thêm vào **App Domains**:
   - localhost

### Bước 4: Cập nhật App ID
- Mở file: `frontend/src/components/page/login.tsx`
- Tìm dòng: `appId: "YOUR_FACEBOOK_APP_ID"`
- Thay thế `YOUR_FACEBOOK_APP_ID` bằng App ID của bạn

### Ví dụ:
```typescript
appId: "1234567890123456",
```

---

## 3️⃣ CÀI ĐẶT DEPENDENCIES

### Backend:
```bash
cd backend
npm install passport passport-google-oauth20 passport-facebook express-session
```

### Frontend:
```bash
cd frontend
npm install @react-oauth/google
```

---

## 4️⃣ CHẠY BACKEND VÀ FRONTEND

### Terminal 1 - Backend:
```bash
cd backend
npm start
# Server chạy tại http://localhost:3000
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
# Frontend chạy tại http://localhost:5173
```

---

## 5️⃣ CẤU TRÚC DATABASE

User schema được cập nhật với các trường mới:
```javascript
{
  name: String,
  email: String,
  password: String (optional cho OAuth),
  phone: String,
  googleId: String (unique, sparse),
  facebookId: String (unique, sparse),
  avatar: String,
  role: String,
  created_at: Date,
  updated_at: Date
}
```

---

## 6️⃣ API ENDPOINTS

### Google Callback
```
POST /api/auth/social/google/callback
Body: {
  id: "google_user_id",
  email: "user@gmail.com",
  name: "User Name",
  picture: "profile_picture_url"
}
Response: {
  accessToken: "jwt_token",
  refreshToken: "refresh_token",
  user: { id, name, email, avatar, role }
}
```

### Facebook Callback
```
POST /api/auth/social/facebook/callback
Body: {
  id: "facebook_user_id",
  email: "user@facebook.com",
  name: "User Name",
  picture: { data: { url: "profile_picture_url" } }
}
Response: {
  accessToken: "jwt_token",
  refreshToken: "refresh_token",
  user: { id, name, email, avatar, role }
}
```

---

## 🐛 TROUBLESHOOTING

### Lỗi: "SDK Not Loaded"
- Kiểm tra script load từ Google/Facebook
- Tắt ad blocker nếu có

### Lỗi: "CORS Error"
- Đảm bảo backend có CORS enable
- Check ALLOWED_ORIGINS trong server

### Lỗi: "Email không được trả về từ Facebook"
- Vào Facebook App Settings
- Đảm bảo email permission được bật

### Lỗi: "Invalid Client ID"
- Kiểm tra Client ID chính xác
- Kiểm tra Origin URLs trong Google Console

---

## 📝 NOTES

- Tokens được lưu vào localStorage
- Sử dụng `accessToken` cho các API calls
- `refreshToken` dùng để lấy token mới khi hết hạn
- Avatar tự động được lưu từ Google/Facebook
- Email verification không bắt buộc cho OAuth users

---

## 🔒 SECURITY TIPS

1. **Không commit credentials vào Git**:
   - Sử dụng `.env` file cho IDs
   - Thêm vào `.gitignore`

2. **Validate tokens trên Backend**

3. **Sử dụng HTTPS trong Production**

4. **Refresh tokens thường xuyên**

---

Cần giúp gì thêm? 🚀
