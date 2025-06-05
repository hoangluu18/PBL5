import requests
import json
import csv
import re
import os
import mysql.connector
import datetime
from slugify import slugify  # pip install python-slugify

os.makedirs("./data", exist_ok=True)

category_id = 26870  # Laptop category ID

laptop_page_url = "https://tiki.vn/api/v2/products?limit=48&include=advertisement&aggregations=1&category=" + str(category_id) + "&page={}"
product_url = "https://tiki.vn/api/v2/products/{}"


product_id_file = "./data/product-id.txt"
product_data_file = "./data/product.txt"
product_file = "./data/product.csv"

headers = {"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36"}

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234',  # Change to your password
    'database': 'pbl5_ecommercee'  # Change to your database name
}

def crawl_product_id(max_products=50):
    product_list = []
    i = 1
    while True:
        print("Crawl page: ", i)
        print(laptop_page_url.format(i))
        response = requests.get(laptop_page_url.format(i), headers=headers)
        
        if response.status_code != 200:
            break

        products = json.loads(response.text)["data"]

        if len(products) == 0:
            break

        for product in products:
            product_id = str(product["id"])
            print("Product ID: ", product_id)
            product_list.append(product_id)
            
            # Break if we've reached the desired number of products
            if len(product_list) >= max_products:
                return product_list, i

        i += 1

    return product_list, i

def save_product_id(product_list=[]):
    file = open(product_id_file, "w+", encoding="utf-8")
    str_data = "\n".join(product_list)
    file.write(str_data)
    file.close()
    print("Save file: ", product_id_file)

def adjust_product(product):
    try:
        e = json.loads(product)
        if not e.get("id", False):
            return None
        
        result = {}
        
        # Basic fields extraction
        result["id"] = e.get("id")
        result["name"] = e.get("name")
        result["price"] = e.get("price")
        result["list_price"] = e.get("list_price")
        result["original_price"] = e.get("original_price")
        result["discount"] = e.get("discount")
        result["rating_average"] = e.get("rating_average")
        result["review_count"] = e.get("review_count")
        result["thumbnail_url"] = e.get("thumbnail_url")
        
        # Description (full text)
        result["description"] = e.get("description", "")
        
        # Extract image thumbnail_urls from images array
        image_thumbnails = []
        if "images" in e and e["images"]:
            for img in e["images"]:
                if isinstance(img, dict) and "thumbnail_url" in img:
                    image_thumbnails.append(img["thumbnail_url"])
        result["image_thumbnails"] = image_thumbnails
        
        # Brand information
        brand_info = ""
        if "brand" in e and e["brand"]:
            brand_info = e["brand"].get("name", "")
        result["brand"] = brand_info
        
        # Specifications - extract all attributes as list for separate table
        specifications = []
        if "specifications" in e and e["specifications"]:
            for spec_group in e["specifications"]:
                if "attributes" in spec_group:
                    for attr in spec_group["attributes"]:
                        if isinstance(attr, dict) and "name" in attr and "value" in attr:
                            specifications.append({
                                "name": attr["name"],
                                "value": str(attr["value"]),
                                "quantity": 1  # Default quantity
                            })
        result["specifications"] = specifications
        
        return result
        
    except json.JSONDecodeError:
        print("Error parsing product JSON")
        return None

def calculate_discount_percent(price, original_price):
    """Calculate discount percentage"""
    if not price or not original_price or price >= original_price:
        return 0.0
    return ((original_price - price) / original_price) * 100

def insert_product_to_db(cursor, product_data):
    """Insert a product and its images into database"""
    try:
        now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
        
        # Prepare product data
        product_id = product_data.get('id', 0)
        product_name = product_data.get('name', '')[:256]  # Truncate to fit varchar(256)
        alias = slugify(product_name)[:256] if product_name else ''
        
        # Price calculations
        price = float(product_data.get('price', 0)) if product_data.get('price') else 0.0
        original_price = float(product_data.get('original_price', price)) if product_data.get('original_price') else price
        discount_percent = calculate_discount_percent(price, original_price)
        
        # Descriptions
        short_description = product_data.get('name', '')[:512]  # Use name as short description
        full_description = product_data.get('description', '')
        
        # Images
        main_image = product_data.get('thumbnail_url', '')[:255]
        
        # Ratings
        average_rating = float(product_data.get('rating_average', 0)) if product_data.get('rating_average') else 0.0
        review_count = int(product_data.get('review_count', 0)) if product_data.get('review_count') else 0
        
        # Insert product
        sql = """
        INSERT INTO products (
            id, name, alias, cost, price, discount_percent,
            short_description, full_description, enabled,
            created_at, in_stock, main_image, updated_at,
            weight, height, width, length,
            category_id, shop_id,
            average_rating, review_count
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        values = (
            product_id, product_name, alias, original_price, price, discount_percent,
            short_description, full_description, 1,  # enabled = 1
            now, 1, main_image, now,  # in_stock = 1
            0.0, 0.0, 0.0, 0.0,  # weight, height, width, length (default to 0)
            category_id, 1,  # brand_id=1, category_id=16 (laptop), shop_id=1
            average_rating, review_count
        )
        
        cursor.execute(sql, values)
        print(f"  ✓ Inserted product: {product_name}")
        
        # Insert additional images
        image_thumbnails = product_data.get('image_thumbnails', [])
        if image_thumbnails:
            for img_url in image_thumbnails:
                if img_url and img_url != main_image:  # Don't duplicate main image
                    insert_product_image(cursor, product_id, img_url)
        
        # Insert product specifications/details
        specifications = product_data.get('specifications', [])
        if specifications:
            for spec in specifications:
                insert_product_detail(cursor, product_id, spec)
        
        return True
        
    except Exception as e:
        print(f"  ✗ Error inserting product {product_data.get('id', 'unknown')}: {e}")
        return False

def insert_product_image(cursor, product_id, photo_url):
    """Insert a product image"""
    try:
        sql = "INSERT INTO product_images (photo, product_id) VALUES (%s, %s)"
        cursor.execute(sql, (photo_url[:255], product_id))  # Truncate to fit varchar(255)
        print(f"    - Added image for product {product_id}")
    except Exception as e:
        print(f"    - Error adding image for product {product_id}: {e}")

def insert_product_detail(cursor, product_id, spec_data):
    """Insert a product specification/detail"""
    try:
        sql = "INSERT INTO product_details (name, value, quantity, product_id) VALUES (%s, %s, %s, %s)"
        values = (
            spec_data['name'][:255],  # Truncate to fit varchar(255)
            spec_data['value'][:255],  # Truncate to fit varchar(255)
            spec_data['quantity'],
            product_id
        )
        cursor.execute(sql, values)
        print(f"    + Added detail for product {product_id}: {spec_data['name']}")
    except Exception as e:
        print(f"    - Error adding detail for product {product_id}: {e}")

def crawl_and_save_to_db(max_products=50):
    """Crawl products and save directly to database"""
    # Connect to database
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        print("Connected to database successfully!")
    except Exception as e:
        print(f"Database connection failed: {e}")
        return
    
    # Crawl product IDs
    product_list, page = crawl_product_id(max_products)
    print(f"No. Page: {page}")
    print(f"No. Product ID: {len(product_list)}")
    
    # Save product IDs for backup
    save_product_id(product_list)
    
    # Process each product
    success_count = 0
    error_count = 0
    
    for i, product_id in enumerate(product_list, 1):
        try:
            print(f"Processing product {i}/{len(product_list)}: {product_id}")
            
            # Crawl product detail
            response = requests.get(product_url.format(product_id), headers=headers)
            
            if response.status_code == 200:
                # Parse product data
                product_data = adjust_product(response.text)
                
                if product_data:
                    # Insert to database
                    if insert_product_to_db(cursor, product_data):
                        connection.commit()
                        success_count += 1
                    else:
                        connection.rollback()
                        error_count += 1
                else:
                    print(f"  ✗ Failed to parse product {product_id}")
                    error_count += 1
            else:
                print(f"  ✗ Failed to fetch product {product_id}: {response.status_code}")
                error_count += 1
                
        except Exception as e:
            print(f"  ✗ Error processing product {product_id}: {e}")
            connection.rollback()
            error_count += 1
    
    # Close database connection
    cursor.close()
    connection.close()
    
    print(f"\n=== CRAWLING COMPLETED ===")
    print(f"✓ Successfully saved: {success_count} products")
    print(f"✗ Errors: {error_count} products")
    print(f"Total processed: {success_count + error_count}/{len(product_list)}")

def randomBrandIdInArray(arrays):
    """Generate a random brand ID from array"""
    import random
    return random.choice(arrays)  # Use choice() to pick from array

def randomBrandId(min_val, max_val):
    """Generate a random brand ID in range"""
    import random
    return random.randint(min_val, max_val)
# Run the crawler
if __name__ == "__main__":
    crawl_and_save_to_db(50)    
    #print(randomBrandIdInArray([3,5]))
    print(category_id)