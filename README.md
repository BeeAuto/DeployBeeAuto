# Hướng Dẫn Sử Dụng & Deploy Lên GitHub Pages (.github.io)

Trang web tĩnh bảo vệ file tải về bằng danh sách mật khẩu với giao diện Glassmorphism hiện đại.

---

## 1. Cấu Trúc Thư Mục

- `index.html`: Trang nhập mật khẩu truy cập.
- `download.html`: Trang tải tệp `.zip` (chỉ vào được khi đã nhập đúng mật khẩu).
- `passwords.js`: Danh sách các mật khẩu hợp lệ (hỗ trợ cả mật khẩu thường và mã hóa SHA-256).
- `app.js` & `download.js`: Logic kiểm tra mật khẩu và điều hướng.
- `style.css`: Giao diện hiện đại, responsive máy tính & điện thoại.
- `hash-generator.html`: Công cụ tạo mã SHA-256 nhanh cho mật khẩu mới.
- `files/tai-lieu.zip`: Nơi đặt file zip cần chia sẻ.

---

## 2. Cách Thay Đổi Mật Khẩu

Mở file `passwords.js`:

```javascript
const CONFIG = {
  downloadFileName: "tai-lieu.zip",
  downloadFilePath: "./files/tai-lieu.zip",

  // Cách 1: Thêm mật khẩu dạng chữ thông thường vào danh sách:
  allowedPasswords: [
    "matkhau123",
    "vip2026",
    "download888",
    "mat_khau_moi_cua_ban"
  ],

  // Cách 2: Thêm mã băm SHA-256 (bảo mật hơn, người khác F12 không đọc được chữ gốc):
  allowedHashes: [
    "7139798771d20ec0e0ce910f7908d192737e5b6772668f142c23f1f2a7516631"
  ]
};
```

> **Mẹo:** Bạn có thể mở file `hash-generator.html` trên trình duyệt để tự sinh chuỗi băm SHA-256 cho mật khẩu bất kỳ.

---

## 3. Cách Đổi File .ZIP

1. Đặt file `.zip` của bạn vào thư mục `files/`.
2. Mở file `passwords.js`, sửa `downloadFileName` và `downloadFilePath` trùng tên file bạn vừa copy vào:
   ```javascript
   downloadFileName: "ten-file-cua-ban.zip",
   downloadFilePath: "./files/ten-file-cua-ban.zip",
   ```

---

## 4. Các Bước Deploy Lên GitHub Pages (github.io)

### Bước 1: Khởi tạo Git và đẩy lên GitHub
Chạy các lệnh sau trong terminal tại thư mục dự án:

```bash
git init
git add .
git commit -m "Khoi tao trang web download bao mat"
git branch -M main
git remote add origin https://github.com/<tai-khoan-github-cua-ban>/<ten-repository>.git
git push -u origin main
```

### Bước 2: Kích hoạt GitHub Pages
1. Vào repository trên **GitHub**.
2. Chọn tab **Settings** (Cài đặt) -> Chọn mục **Pages** ở thanh menu bên trái.
3. Ở phần **Build and deployment**:
   - **Source**: Chọn `Deploy from a branch`.
   - **Branch**: Chọn `main` và thư mục `/ (root)`.
4. Bấm **Save**.
5. Đợi khoảng 1-2 phút, GitHub sẽ hiển thị đường link website của bạn:
   `https://<tai-khoan-github-cua-ban>.github.io/<ten-repository>/`
