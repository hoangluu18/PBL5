import os
import json
import pandas as pd
import re
import html
from bs4 import BeautifulSoup


# Đọc dữ liệu thô
def load_raw_data():
    with open('D:/chat_bot/PBL5/data/raw/products_raw.json', 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    return raw_data


# Làm sạch HTML và chuẩn hóa văn bản
def clean_html_text(text):
    if not text or not isinstance(text, str):
        return ""

    # Loại bỏ HTML tags
    soup = BeautifulSoup(text, "html.parser")
    clean_text = soup.get_text(separator=' ', strip=True)

    # Giải mã HTML entities
    clean_text = html.unescape(clean_text)

    # Loại bỏ ký tự đặc biệt và dấu cách thừa
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()

    return clean_text


# Chuẩn hóa giá
def format_price(price):
    if pd.isna(price):
        return "Không có thông tin"
    return f"{int(price):,} VNĐ"


# Tạo văn bản mô tả thông số kỹ thuật
def format_specifications(specs):
    if not specs:
        return "Không có thông số kỹ thuật"

    spec_texts = []
    for spec in specs:
        name = spec.get('name', '')
        value = spec.get('value', '')
        if name and value:
            spec_texts.append(f"{name}: {value}")

    return ", ".join(spec_texts)


# Xử lý dữ liệu sản phẩm
def process_product_data(raw_data):
    processed_data = []

    for product in raw_data:
        # Làm sạch và định dạng dữ liệu
        description = clean_html_text(product.get('full_description', ''))
        formatted_specs = format_specifications(product.get('specifications', []))

        # Tính giá sau giảm giá
        price = float(product.get('price', 0))
        discount = float(product.get('discount_percent', 0))
        final_price = price * (1 - discount / 100) if discount > 0 else price

        # Xác định trạng thái tồn kho
        in_stock = product.get('in_stock', False)
        stock_status = "Còn hàng" if in_stock else "Hết hàng"

        # Tạo mô tả đầy đủ cho RAG
        full_context = f"""
        ID Sản phẩm: {product.get('id', '')}
        Tên sản phẩm: {product.get('name', '')}
        link: {f"http://localhost:5173/p/{product.get('alias', '')}" if product.get('alias') else 'Không có thông tin'} 
        Thương hiệu: {product.get('brand_name', 'Không có thông tin')}
        Danh mục: {product.get('category_name', 'Không có thông tin')}
        Cửa hàng: {product.get('shop_name', 'Không có thông tin')}
        Giá gốc: {format_price(price)}
        {f"Giảm giá: {discount}%" if discount > 0 else ""}
        {f"Giá khuyến mãi: {format_price(final_price)}" if discount > 0 else ""}
        Trạng thái: {stock_status}
        Đánh giá: {product.get('average_rating', 0)}/5 ({product.get('review_count', 0)} lượt đánh giá)
        Thông số kỹ thuật:
        {formatted_specs}

        Kích thước: Dài {product.get('length', 0)}cm x Rộng {product.get('width', 0)}cm x Cao {product.get('height', 0)}cm
        Trọng lượng: {product.get('weight', 0)}kg
        """

        # Tạo bản ghi đã được xử lý
        processed_product = {
            'id': product.get('id', ''),
            'name': product.get('name', ''),
            'brand': product.get('brand_name', ''),
            'category': product.get('category_name', ''),
            'alias': product.get('alias', ''),
            'shop': product.get('shop_name', ''),
            'price': price,
            'discount_percent': discount,
            'final_price': final_price,
            'in_stock': in_stock,
            'average_rating': product.get('average_rating', 0),
            'review_count': product.get('review_count', 0),
            'description': description,
            'specifications': product.get('specifications', []),
            'dimensions': {
                'length': product.get('length', 0),
                'width': product.get('width', 0),
                'height': product.get('height', 0),
                'weight': product.get('weight', 0)
            },
            'full_context': full_context.strip()
        }

        processed_data.append(processed_product)

    return processed_data


if __name__ == "__main__":
    raw_data = load_raw_data()
    processed_data = process_product_data(raw_data)

    # Đảm bảo thư mục processed tồn tại
    os.makedirs("data/processed", exist_ok=True)

    # Lưu dữ liệu đã xử lý
    with open("data/processed/products_processed.json", "w", encoding="utf-8") as f:
        json.dump(processed_data, f, ensure_ascii=False, indent=2)

    print(f"Processed {len(processed_data)} products saved to data/processed/products_processed.json")