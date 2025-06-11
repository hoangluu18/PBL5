import os
import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

# Đường dẫn đến dữ liệu embedding
EMBEDDINGS_DIR = "data/embeddings"


# Tải mô hình, FAISS index và metadata
def load_retrieval_system():
    print("Loading embedding model...")
    model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

    print("Loading FAISS index...")
    index = faiss.read_index(os.path.join(EMBEDDINGS_DIR, "faiss_index.bin"))

    print("Loading product contexts...")
    with open(os.path.join(EMBEDDINGS_DIR, "product_contexts.json"), "r", encoding="utf-8") as f:
        product_contexts = json.load(f)

    print("Loading ID to index mapping...")
    with open(os.path.join(EMBEDDINGS_DIR, "id_to_index.json"), "r", encoding="utf-8") as f:
        id_to_index = json.load(f)

    # Tạo index to id mapping
    index_to_id = {v: k for k, v in id_to_index.items()}

    return model, index, product_contexts, index_to_id


def query_products(query_text, model, index, product_contexts, index_to_id, top_k=3):
    # Tạo embedding cho câu truy vấn
    print(f"Đang xử lý truy vấn: {query}")
    query_embedding = model.encode([query_text])
    print(f"Đã tạo embedding cho truy vấn")

    # print(f"Kích thước index: {index.shape}")
    # print(f"Số lượng sản phẩm trong dữ liệu: {len(product_contexts)}")
    # Chuẩn hóa vector truy vấn
    faiss.normalize_L2(query_embedding)

    # Tìm kiếm các sản phẩm tương tự
    scores, indices = index.search(query_embedding, top_k)

    print(f"Kết quả tìm kiếm: {indices}, {scores}")
    # Lấy thông tin sản phẩm
    results = []
    for i, idx in enumerate(indices[0]):
        if idx >= 0:  # Đảm bảo index hợp lệ
            product_id = index_to_id.get(str(idx))

            # Tìm sản phẩm tương ứng
            product = None
            for p in product_contexts:
                if str(p["id"]) == str(product_id):
                    product = p
                    break

            if product:
                results.append({
                    "score": scores[0][i],
                    "product_name": product["name"],
                    "product_id": product["id"],
                    "product_context": product["context"][:300] + "..."  # Hiển thị một phần ngữ cảnh
                })

    return results


if __name__ == "__main__":
    model, index, product_contexts, index_to_id = load_retrieval_system()

    while True:
        query = input("\nNhập câu hỏi về sản phẩm (hoặc 'q' để thoát): ")
        if query.lower() == 'q':
            break

        results = query_products(query, model, index, product_contexts, index_to_id, top_k=3)

        print("\n=== Kết quả truy vấn ===")
        for i, result in enumerate(results, 1):
            print(f"\n{i}. {result['product_name']} (ID: {result['product_id']}, Score: {result['score']:.4f})")
            print(f"   Context: {result['product_context']}")