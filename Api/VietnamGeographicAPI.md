# Vietnam Geographic API

## 📌 Giới thiệu
Vietnam Geographic API cung cấp thông tin về các đơn vị hành chính của Việt Nam, bao gồm tỉnh/thành phố, quận/huyện và phường/xã. API hỗ trợ tìm kiếm và truy xuất dữ liệu dễ dàng.

## 🚀 Khởi chạy API
### Chạy trên máy cá nhân:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

### Chạy trên Hugging Face Spaces:
- Đảm bảo có các file **app.py**, **requirements.txt**, **Dockerfile**.
- Đẩy code lên Hugging Face và truy cập API qua URL được cấp.

## 📜 Danh sách API

### 1️⃣ Lấy danh sách tất cả tỉnh/thành phố
**Endpoint:**
```
GET /api/list
```
**Response:**
```json
[
    {"name": "Hà Nội"},
    {"name": "Hồ Chí Minh"},
    {"name": "Đà Nẵng"}
]
```

---
### 2️⃣ Lấy danh sách quận/huyện của một tỉnh/thành phố
**Endpoint:**
```
GET /api/city/{city_name}/districts
```
**Ví dụ:**
```
GET /api/city/Hà Nội/districts
```
**Response:**
```json
[
    {"name": "Ba Đình"},
    {"name": "Hoàn Kiếm"},
    {"name": "Tây Hồ"}
]
```

---
### 3️⃣ Lấy danh sách phường/xã của một quận/huyện
**Endpoint:**
```
GET /api/city/{city_name}/district/{district_name}/wards
```
**Ví dụ:**
```
GET /api/city/Hà Nội/district/Ba Đình/wards
```
**Response:**
```json
[
    {"name": "Phúc Xá"},
    {"name": "Trúc Bạch"},
    {"name": "Vĩnh Phúc"}
]
```

---
### 4️⃣ Lấy thông tin chi tiết về một tỉnh/thành phố
**Endpoint:**
```
GET /api/city/{city_name}
```
**Ví dụ:**
```
GET /api/city/Hà Nội
```
**Response:**
```json
{
    "name": "Hà Nội",
    "districts": [
        {"name": "Ba Đình", "wards": [{"name": "Phúc Xá"}, {"name": "Trúc Bạch"}]},
        {"name": "Hoàn Kiếm", "wards": [{"name": "Hàng Trống"}, {"name": "Hàng Bài"}]}
    ]
}
```

---
### 5️⃣ Tìm kiếm địa danh
**Endpoint:**
```
GET /api/search?q={tên}&type={city/district/ward}
```
**Ví dụ:**
```
GET /api/search?q=Ba&type=district
```
**Response:**
```json
[
    {"name": "Ba Đình", "city": "Hà Nội"},
    {"name": "Ba Tơ", "city": "Quảng Ngãi"}
]
```

---
## 📌 Ghi chú
- `city_name`, `district_name` và `ward_name` cần ghi đúng tên (có dấu).
- API sử dụng dữ liệu từ Hugging Face Spaces: `https://huggingface.co/spaces/pmshoanghot/api_tinh_thanh/resolve/main/vietnam-provinces.json`.

## 🛠 Công nghệ sử dụng
- **FastAPI** (Xây dựng API)
- **Uvicorn** (Chạy server ASGI)
- **Pydantic** (Xác thực dữ liệu)

## 📧 Liên hệ
Nếu có vấn đề hoặc góp ý, hãy liên hệ qua GitHub hoặc Hugging Face Spaces.

🚀 **Happy Coding!**

