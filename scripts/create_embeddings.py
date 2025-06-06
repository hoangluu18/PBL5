import os
import json
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
from dotenv import load_dotenv
import pickle
from tqdm import tqdm

# Load biến môi trường
load_dotenv()

# Đường dẫn đến dữ liệu đã xử lý
PROCESSED_DATA_PATH = "data/processed/products_processed.json"
OUTPUT_DIR = "data/embeddings"

os.makedirs(OUTPUT_DIR, exist_ok=True)


# Tải mô hình embedding
def load_embedding_model():
    # Sử dụng mô hình đa ngôn ngữ hỗ trợ tiếng Việt
    model_name = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    model = SentenceTransformer(model_name)
    return model


# Tải dữ liệu đã xử lý
def load_processed_data():
    with open(PROCESSED_DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


# Tạo và lưu embeddings
def create_embeddings(data, model):
    # Chuẩn bị văn bản để nhúng
    texts = []
    product_ids = []
    product_contexts = []

    print("Preparing texts for embedding...")
    for product in tqdm(data):
        # Sử dụng full_context làm văn bản để nhúng
        texts.append(product['full_context'])
        product_ids.append(product['id'])

        # Lưu thông tin để có thể truy xuất sau này
        product_contexts.append({
            'id': product['id'],
            'name': product['name'],
            'alias': product['alias'],
            'context': product['full_context'],
            'price': product['price'],
            'final_price': product['final_price'],
            'category': product['category'],
            'brand': product['brand'],
            'in_stock': product['in_stock']
        })

    # Tạo embeddings
    print("Creating embeddings...")
    embeddings = []
    batch_size = 32  # Kích thước batch để tránh quá tải bộ nhớ

    for i in tqdm(range(0, len(texts), batch_size)):
        batch_texts = texts[i:i + batch_size]
        batch_embeddings = model.encode(batch_texts, show_progress_bar=False)
        embeddings.extend(batch_embeddings)

    embeddings = np.array(embeddings).astype('float32')

    # Lưu embeddings và thông tin sản phẩm
    print(f"Saving embeddings and product data...")

    # Lưu embeddings dưới dạng numpy array
    np.save(os.path.join(OUTPUT_DIR, "product_embeddings.npy"), embeddings)

    # Lưu thông tin ngữ cảnh sản phẩm
    with open(os.path.join(OUTPUT_DIR, "product_contexts.json"), "w", encoding="utf-8") as f:
        json.dump(product_contexts, f, ensure_ascii=False, indent=2)

    # Lưu mapping giữa ID và index
    id_to_index = {str(pid): i for i, pid in enumerate(product_ids)}
    with open(os.path.join(OUTPUT_DIR, "id_to_index.json"), "w", encoding="utf-8") as f:
        json.dump(id_to_index, f, ensure_ascii=False)

    return embeddings, product_contexts, id_to_index


# Tạo FAISS index
def create_faiss_index(embeddings):
    # Kích thước của embeddings
    dimension = embeddings.shape[1]

    # Tạo index cho tìm kiếm tương tự nhanh
    index = faiss.IndexFlatIP(dimension)  # Inner product cho cosine similarity

    # Chuẩn hóa các vectors (cần thiết cho inner product)
    faiss.normalize_L2(embeddings)

    # Thêm vectors vào index
    index.add(embeddings)

    # Lưu index
    faiss.write_index(index, os.path.join(OUTPUT_DIR, "faiss_index.bin"))
    print(f"FAISS index created and saved to {os.path.join(OUTPUT_DIR, 'faiss_index.bin')}")

    return index


if __name__ == "__main__":
    print("Loading embedding model...")
    model = load_embedding_model()

    print("Loading processed product data...")
    data = load_processed_data()

    print(f"Creating embeddings for {len(data)} products...")
    embeddings, product_contexts, id_to_index = create_embeddings(data, model)

    print("Creating FAISS index...")
    index = create_faiss_index(embeddings)

    print("Embedding creation completed!")