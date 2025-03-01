Tài liệu hướng dẫn sử dụng Vietnam Geographic API

1. Giới thiệu

Vietnam Geographic API là một API cung cấp thông tin về các đơn vị hành chính của Việt Nam, bao gồm:

Tỉnh/Thành phố

Quận/Huyện

Phường/Xã

API cho phép tìm kiếm và truy xuất dữ liệu dễ dàng, phù hợp với các ứng dụng yêu cầu dữ liệu về địa danh tại Việt Nam.

2. Hướng dẫn khởi chạy API

2.1 Chạy trên máy cá nhân

Người dùng có thể khởi chạy API trên máy cá nhân bằng lệnh sau:

uvicorn app:app --host 0.0.0.0 --port 8000

2.2 Chạy trên Hugging Face Spaces

Người dùng có thể sử dụng API trên Hugging Face Spaces tại địa chỉ:

https://pmshoanghot-apitinhthanhdocker.hf.space/api/...

Yêu cầu:

API được triển khai với các tệp tin app.py, requirements.txt, Dockerfile.

API sử dụng dữ liệu từ Hugging Face Spaces: https://huggingface.co/spaces/pmshoanghot/api_tinh_thanh/resolve/main/vietnam-provinces.json.

3. Danh sách API

3.1 Lấy danh sách tất cả tỉnh/thành phố

Phương thức: GET

Endpoint: /api/list

Dữ liệu trả về:

[
    {"name": "Hà Nội"},
    {"name": "Hồ Chí Minh"},
    {"name": "Đà Nẵng"}
]

3.2 Lấy danh sách quận/huyện của một tỉnh/thành phố

Phương thức: GET

Endpoint: /api/city/{city_name}/districts

Ví dụ: /api/city/Hà Nội/districts

Dữ liệu trả về:

[
    {"name": "Ba Đình"},
    {"name": "Hoàn Kiếm"},
    {"name": "Tây Hồ"}
]

3.3 Lấy danh sách phường/xã của một quận/huyện

Phương thức: GET

Endpoint: /api/city/{city_name}/district/{district_name}/wards

Ví dụ: /api/city/Hà Nội/district/Ba Đình/wards

Dữ liệu trả về:

[
    {"name": "Phúc Xá"},
    {"name": "Trúc Bạch"},
    {"name": "Vĩnh Phúc"}
]

3.4 Tìm kiếm địa danh

Phương thức: GET

Endpoint: /api/search?q={tên}&type={city/district/ward}

Ví dụ: /api/search?q=Ba&type=district

Dữ liệu trả về:

[
    {"name": "Ba Đình", "city": "Hà Nội"},
    {"name": "Ba Tơ", "city": "Quảng Ngãi"}
]

4. Lưu ý khi sử dụng API

city_name, district_name và ward_name cần ghi đúng tên (có dấu).

5. Công nghệ sử dụng

API được xây dựng sử dụng:

FastAPI (Xây dựng API RESTful)

Uvicorn (Chạy server ASGI)

Pydantic (Xác thực dữ liệu)

6. Liên hệ

Mọi thắc mắc hoặc góp ý vui lòng liên hệ qua GitHub hoặc Hugging Face Spaces.

🚀 Chúc bạn coding vui vẻ!