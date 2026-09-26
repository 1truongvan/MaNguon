# Hướng dẫn khởi động lại Backend và cập nhật Database

## 1. Cài đặt multer (nếu chưa có)

Mở terminal trong thư mục `backend` và chạy:

```bash
cd backend
npm install multer
```

## 2. Cập nhật Database - Thêm field `is_new` cho các sản phẩm cũ

Chạy script migration để thêm field `is_new` cho tất cả sản phẩm hiện có:

```bash
cd backend
npm run update-is-new
```

Script này sẽ:
- Tìm tất cả sản phẩm chưa có field `is_new`
- Thêm field `is_new: false` cho các sản phẩm đó
- Hiển thị số lượng sản phẩm đã được cập nhật

## 3. Khởi động lại Backend Server

### Cách 1: Sử dụng npm start (Khuyến nghị)

```bash
cd backend
npm start
```

### Cách 2: Sử dụng node trực tiếp

```bash
cd backend
node server.js
```

### Cách 3: Nếu đang chạy, dừng và khởi động lại

1. **Dừng server hiện tại:**
   - Trong terminal đang chạy backend, nhấn `Ctrl + C` (Windows/Linux) hoặc `Cmd + C` (Mac)

2. **Khởi động lại:**
   ```bash
   cd backend
   npm start
   ```

## 4. Kiểm tra Backend đã chạy

Sau khi khởi động, bạn sẽ thấy thông báo:
```
✅ Kết nối MongoDB Atlas thành công!
🚀 Server chạy tại: http://localhost:3000
```

## 5. Kiểm tra field `is_new` trong Database

Sau khi chạy script migration, tất cả sản phẩm sẽ có field `is_new` với giá trị mặc định là `false`.

Bạn có thể kiểm tra bằng cách:
1. Mở trang Admin → Sản phẩm
2. Click "Sửa" một sản phẩm
3. Checkbox "Đánh dấu là hàng mới" sẽ hiển thị (chưa được tick)
4. Tick checkbox và lưu
5. Sản phẩm sẽ có badge "HÀNG MỚI" trong danh sách

## Lưu ý

- **Backend phải được khởi động lại** sau khi thêm field `is_new` vào model
- **Script migration chỉ cần chạy 1 lần** để cập nhật các sản phẩm cũ
- Các sản phẩm mới được tạo sau này sẽ tự động có field `is_new: false` (theo default trong schema)

## Troubleshooting

### Lỗi: "Cannot find module 'multer'"
```bash
cd backend
npm install multer
```

### Lỗi: "MONGO_URI is not defined"
- Kiểm tra file `.env` trong thư mục `backend`
- Đảm bảo có dòng: `MONGO_URI=your_mongodb_connection_string`

### Lỗi: "Port 3000 is already in use"
- Dừng process đang chạy trên port 3000
- Hoặc thay đổi PORT trong file `.env`

