

## Giới thiệu

PBL5 Ecommerce là một giải pháp thương mại điện tử đầy đủ tính năng tích hợp AI, xây dựng trên nền tảng Spring Boot (Backend) và React.js (Frontend). Hệ thống hỗ trợ đầy đủ các chức năng của một sàn thương mại điện tử hiện đại với trải nghiệm người dùng tối ưu.

## Kiến trúc hệ thống

<img src="https://lh3.googleusercontent.com/pw/AP1GczMcEqqUu2He194Kp0593U55ICd3GuTn4khnkiTtaMrNKgrfouuo9t5YCtcPJgbrfW4F-W03DCgdCbevH62PoaaeTejiNKRnv4IR9sTV9Wl-m-1IemquwcvusOm-TaCdpbN_d5_UW9uwSOwAIVVQwm8x=w951-h508-s-no-gm" alt="Sơ đồ hệ thống" width="600" />

### Thành phần chính:

- **Frontend**: React JS
- **Backend**: Spring Framework
- **Database**: MySQL
- **Lưu trữ dữ liệu**: Amazon S3
- **APIs**:
  - FastAPI Chatbot (Gemma 3-1b)
  - FastAPI Geographic (API hỗ trợ dữ liệu địa lý Việt Nam)
  - FastAPI Shipping (API tính phí vận chuyển)

## Giải pháp AI - RAG Chatbot

<img src="https://lh3.googleusercontent.com/pw/AP1GczOI38wntZEXJh52Y8VeBn7GmZfBB4yMplYJb73vbXIbJY03yHAF0Zj3l5qDi284LNn95T0Ku7K9siLv1RcC-bKTatl5Xa2FtHqRKoGpTcC_6W1KrbT7L6cXa-7Dpd6DC3WpmCNBLwnZJjK3A5fUmKaJ=w1001-h620-s-no-gm" alt="Sơ đồ hoạt động Chatbot" width="600" />

Chatbot tích hợp trong hệ thống sử dụng kỹ thuật RAG (Retrieval Augmented Generation) với mô hình Gemma 3-1b để hỗ trợ người dùng tìm kiếm sản phẩm thông minh:

1. **Xử lý yêu cầu người dùng**:
   - Chuyển đổi văn bản thành vector embedding (384 chiều)
   - Tìm kiếm sản phẩm tương tự bằng FAISS
   - Ánh xạ kết quả tìm kiếm với sản phẩm trong hệ thống

2. **Tạo phản hồi thông minh**:
   - Kết hợp ngữ cảnh sản phẩm tìm thấy
   - Xử lý qua mô hình Gemma để tạo phản hồi tự nhiên
   - Streaming response token-by-token

## Công nghệ sử dụng

### Backend
- **Java Spring Boot**: Framework chính cho backend
- **Spring Security**: Xác thực và phân quyền
- **Spring Data JPA**: ORM cho tương tác cơ sở dữ liệu
- **MySQL**: Hệ quản trị cơ sở dữ liệu
- **Amazon S3**: Lưu trữ và quản lý hình ảnh

### Frontend
- **React.js**: Thư viện JavaScript cho UI
- **Ant Design**: Thư viện UI components
- **Redux**: Quản lý state
- **Axios**: HTTP client

### AI & APIs
- **FastAPI**: Framework Python cho các dịch vụ API
- **Gemma 3-1b**: Mô hình ngôn ngữ cho chatbot
- **FAISS**: Hệ thống tìm kiếm vector hiệu quả
- **Vector Embedding**: Chuyển đổi văn bản thành vector

## Tính năng chính

### Khách hàng (Client)
- Đăng ký/đăng nhập (kể cả đăng nhập bằng Google)
- Duyệt và tìm kiếm sản phẩm
- Chatbot AI hỗ trợ tìm kiếm thông minh
- Giỏ hàng và thanh toán (COD, Ví điện tử)
- Đánh giá và nhận xét sản phẩm
- Quản lý hồ sơ cá nhân và địa chỉ
- Theo dõi đơn hàng
- Yêu cầu hoàn tiền

### Người bán (Seller)
- Quản lý sản phẩm (thêm, sửa, xóa)
- Quản lý đơn hàng
- Thống kê doanh thu
- Xuất báo cáo PDF
- Quản lý ví điện tử

### Admin
- Quản lý người dùng
- Xét duyệt đăng ký bán hàng
- Quản lý danh mục sản phẩm
- Thống kê toàn hệ thống

## Cài đặt và thiết lập

### Yêu cầu hệ thống
- JDK 17+
- Node.js 14+
- MySQL 8+
- Python 3.8+ (cho các dịch vụ AI)

### Cài đặt Backend

```bash
cd BE
mvn clean install
cd WebParent/BE_Admin
mvn spring-boot:run
```

```bash
cd BE
mvn clean install
cd WebParent/BE_Client
mvn spring-boot:run
```

### Cài đặt Frontend

```bash
cd FE/FE_Admin
npm install
npm run dev
```

```bash
cd FE/FE_Client
npm install
npm run dev
```

### Cài đặt API Services

```bash
cd Api
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

## Cấu trúc thư mục

```
PBL5/
├── BE/                  # Backend code
│   ├── Common/          # Shared entities
│   ├── WebParent/       # Parent module
│   │   ├── BE_Admin/    # Admin service
│   │   └── BE_Client/   # Client service
├── FE/                  # Frontend code
│   ├── FE_Admin/        # Admin dashboard
│   └── FE_Client/       # Client website
└── Api/                 # API services
    ├── ChatbotAPI/      # AI Chatbot service
    ├── GeographicAPI/   # Vietnam geographic data
    └── ShippingAPI/     # Shipping cost calculation
```

## Đóng góp

Dự án này được phát triển như một phần của Project-Based Learning. Nếu bạn muốn đóng góp, vui lòng liên hệ với chúng tôi.

## Giấy phép

Dự án này được phân phối theo giấy phép MIT License. Xem file LICENSE để biết thêm chi tiết.

## Tác giả

Dự án được phát triển bởi nhóm PBL5 (Lưu Việt Hoàng, Trần Phước Thành, Huỳnh Vũ Huy).

## Liên hệ

Nếu có bất kỳ câu hỏi nào về dự án, vui lòng liên hệ qua email: [luu186835@gmail.com](mailto:contact@luu186835@gmail.com)
