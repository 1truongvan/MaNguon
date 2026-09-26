# Hướng dẫn tạo tài khoản Admin

## Tài khoản Admin mặc định

**Email:** `admin@icondenim.com`  
**Mật khẩu mặc định:** `admin123`

## Cách 1: Tự động tạo bằng script (Khuyến nghị)

1. Mở terminal trong thư mục `backend`
2. Chạy lệnh:
```bash
npm run create-admin
```

Script sẽ tự động tạo tài khoản admin với thông tin:
- Email: `admin@icondenim.com`
- Mật khẩu: `admin123`
- Role: `admin`

## Cách 2: Đăng ký thủ công

1. Truy cập trang đăng ký: `http://localhost:5173/login`
2. Chuyển sang tab "ĐĂNG KÝ"
3. Điền thông tin:
   - **Họ và tên:** Administrator (hoặc tên bạn muốn)
   - **Email:** `admin@icondenim.com` ⚠️ **BẮT BUỘC**
   - **Mật khẩu:** Mật khẩu bạn muốn (tối thiểu 6 ký tự)
   - **Số điện thoại:** (tùy chọn)
4. Click "ĐĂNG KÝ"
5. Hệ thống sẽ tự động đăng nhập và chuyển đến trang admin

## Đăng nhập vào trang Admin

1. Truy cập: `http://localhost:5173/login`
2. Nhập:
   - **Email:** `admin@icondenim.com`
   - **Mật khẩu:** Mật khẩu bạn đã đặt
3. Click "ĐĂNG NHẬP"
4. Sau khi đăng nhập thành công, truy cập: `http://localhost:5173/admin`

## Lưu ý bảo mật

⚠️ **QUAN TRỌNG:**
- Sau khi đăng nhập lần đầu, **VUI LÒNG ĐỔI MẬT KHẨU** ngay lập tức
- Chỉ email `admin@icondenim.com` mới có quyền truy cập trang admin
- Không chia sẻ thông tin đăng nhập với người khác
- Sử dụng mật khẩu mạnh (ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt)

## Đổi mật khẩu

Sau khi đăng nhập, bạn có thể:
1. Vào trang "Quản lý Người dùng" (`/admin/users`)
2. Tìm tài khoản `admin@icondenim.com`
3. Click icon ✏️ để sửa
4. (Tính năng đổi mật khẩu có thể cần được thêm vào)

## Khôi phục mật khẩu

Nếu quên mật khẩu, bạn có thể:
1. Xóa tài khoản admin hiện tại trong database
2. Chạy lại script `npm run create-admin` để tạo lại với mật khẩu mặc định
3. Hoặc đăng ký lại với email `admin@icondenim.com`

