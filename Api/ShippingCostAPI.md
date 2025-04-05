
# Shipping cost


## API Endpoints

### Calculate Shipping Cost

- **URL:** `/calculate_shipping`
- **Method:** `POST`
- **Request Body:**
    ```json
    {
        "weight": 1.5,
        "height": 10,
        "width": 20,
        "length": 30,
        "diem_giao_hang": "Thành phố Hà Nội",
        "diem_nhan_hang": "Thành phố Đà Nẵng"
    }
    ```
    If have voucher
    ```json
    {
        "weight": 1.5,
        "height": 10,
        "width": 20,
        "length": 30,
        "diem_giao_hang": "Thành phố Hà Nội",
        "diem_nhan_hang": "Thành phố Đà Nẵng",
        "voucher_code": "DISCOUNT10" 
    }
    ```
- **Response:**
    ```json
    {
        "shipping_company": "Viettel Post",
        "shipping_cost": 50000,
        "delivery_time": "24"
    }
    ```
