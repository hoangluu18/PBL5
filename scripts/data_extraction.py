import os
import json
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import urllib.parse
# Load biến môi trường từ file .env
load_dotenv()

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
output_path = os.path.join(base_dir, "data", "raw", "products_raw.json")

# Create directory if it doesn't exist
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Kết nối tới DB
# def create_db_connection():
#     # db_host = os.getenv("DB_HOST")
#     # db_port = os.getenv("DB_PORT")
#     # db_user = os.getenv("DB_USER")
#     # db_password = os.getenv("DB_PASSWORD")
#     # db_name = os.getenv("DB_NAME")
#
#     db_host = "localhost"
#     db_port = "3306"
#     db_user = "root"
#     db_password = "Pmshoanghot1@"
#     db_name = "pbl5_ecommerce"
#
#     connection_string = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
#     print(f"Connecting to database at {db_host}:{db_port} as user {db_user}")
#     engine = create_engine(connection_string)
#     return engine

def create_db_connection():
    db_host = "localhost"
    db_port = "3306"
    db_user = "root"
    db_password = "Pmshoanghot1@"
    # URL encode the password to handle special characters
    encoded_password = urllib.parse.quote_plus(db_password)
    db_name = "pbl5_ecommerce"

    connection_string = f"mysql+pymysql://{db_user}:{encoded_password}@{db_host}:{db_port}/{db_name}"
    print(f"Connecting to database at {db_host}:{db_port} as user {db_user}")
    engine = create_engine(connection_string)
    return engine



# Trích xuất dữ liệu sản phẩm cơ bản (Chỉ từ bảng products)
def extract_products_data():
    engine = create_db_connection()

    query = text("""
    SELECT p.id, p.name, p.alias, p.full_description, p.main_image,
           p.cost, p.price, p.discount_percent, 
           p.length, p.width, p.height, p.weight,
           p.review_count, p.average_rating, p.enabled, p.in_stock,
           c.name as category_name, b.name as brand_name, s.name as shop_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN shops s ON p.shop_id = s.id
    WHERE p.enabled = 1
    """)

    with engine.connect() as connection:
        products_df = pd.read_sql_query(query, connection)

    return products_df


# Trích xuất thông số kỹ thuật của sản phẩm
def extract_product_specifications():
    engine = create_db_connection()

    query = text("""
    SELECT pd.product_id, pd.name, pd.value
    FROM product_details pd
    JOIN products p ON pd.product_id = p.id
    WHERE p.enabled = 1
    """)

    with engine.connect() as connection:
        specs_df = pd.read_sql_query(query, connection)

    return specs_df


# Kết hợp dữ liệu thành một tập dữ liệu hoàn chỉnh
def combine_product_data():
    products_df = extract_products_data()
    specs_df = extract_product_specifications()

    # Nhóm thông số kỹ thuật theo product_id
    specs_grouped = specs_df.groupby('product_id').apply(
        lambda x: x[['name', 'value']].to_dict('records')
    ).to_dict()

    # Thêm thông số vào dữ liệu sản phẩm
    products_df['specifications'] = products_df['id'].map(
        lambda x: specs_grouped.get(x, [])
    )

    return products_df


if __name__ == "__main__":
    combined_data = combine_product_data()

    # Tạo thư mục data nếu chưa tồn tại
    os.makedirs("data/raw", exist_ok=True)

    # Save with proper encoding and formatting
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(combined_data.to_json(orient="records", force_ascii=False, indent=4))

    print(f"Extracted {len(combined_data)} products to {output_path}")