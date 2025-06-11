# Tạo file rag_pipeline.py trong thư mục app/models/

import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


class RAGPipeline:
    def __init__(self, llm_model, embeddings_dir="scripts/data/embeddings"):
        self.llm_model = llm_model
        self.embeddings_dir = embeddings_dir

        # Tải mô hình embedding
        print("Đang tải mô hình embedding...")
        self.embedding_model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

        # Tải FAISS index và dữ liệu sản phẩm
        self._load_retrieval_system()
        print("Đã tải xong hệ thống truy xuất!")

    def _load_retrieval_system(self):
        """Tải FAISS index và dữ liệu sản phẩm"""
        import json

        # Tải FAISS index
        self.index = faiss.read_index(os.path.join(self.embeddings_dir, "faiss_index.bin"))

        # Tải thông tin sản phẩm
        # Trong RAGPipeline._load_retrieval_system, thêm kiểm tra này
        with open(os.path.join(self.embeddings_dir, "product_contexts.json"), "r", encoding="utf-8") as f:
            self.product_contexts = json.load(f)
            # Kiểm tra cấu trúc dữ liệu
            if self.product_contexts and len(self.product_contexts) > 0:
                sample = self.product_contexts[0]
                print(f"Các trường trong dữ liệu sản phẩm: {list(sample.keys())}")

        # Tải mapping ID -> index
        with open(os.path.join(self.embeddings_dir, "id_to_index.json"), "r", encoding="utf-8") as f:
            self.id_to_index = json.load(f)

        # Tạo mapping index -> ID
        self.index_to_id = {v: k for k, v in self.id_to_index.items()}

    # def retrieve_relevant_contexts(self, query, top_k=3):
    #     """Truy xuất thông tin sản phẩm liên quan đến truy vấn"""
    #     # Tạo embedding cho câu truy vấn
    #     query_embedding = self.embedding_model.encode([query])
    #
    #     # Chuẩn hóa vector truy vấn
    #     faiss.normalize_L2(query_embedding)
    #
    #     # Tìm kiếm các sản phẩm tương tự
    #     scores, indices = self.index.search(query_embedding, top_k)
    #
    #     # Lấy thông tin sản phẩm
    #     contexts = []
    #     for i, idx in enumerate(indices[0]):
    #         if idx >= 0:  # Đảm bảo index hợp lệ
    #             product_id = self.index_to_id.get(str(idx))
    #
    #             # Tìm sản phẩm tương ứng
    #             for product in self.product_contexts:
    #                 if str(product["id"]) == str(product_id):
    #                     contexts.append({
    #                         "score": scores[0][i],
    #                         "product_name": product["name"],
    #                         "product_id": product["id"],
    #                         "context": product["context"]
    #                     })
    #                     break
    #
    #     return contexts

    # def retrieve_relevant_contexts(self, query, top_k=5):
    #     """Truy xuất thông tin sản phẩm liên quan đến truy vấn"""
    #     print(f"\n=== Thông tin truy xuất ===")
    #     print(f"Truy vấn: '{query}'")
    #
    #     # Tạo embedding cho câu truy vấn
    #     query_embedding = self.embedding_model.encode([query])
    #     faiss.normalize_L2(query_embedding)
    #
    #     # Tìm kiếm các sản phẩm tương tự
    #     scores, indices = self.index.search(query_embedding, top_k)
    #     print(f"Kết quả tìm kiếm raw: indices={indices[0]}, scores={scores[0]}")
    #
    #     # Lấy thông tin sản phẩm (không lọc điểm)
    #     contexts = []
    #     for i, idx in enumerate(indices[0]):
    #         if idx >= 0:  # Chỉ đảm bảo index hợp lệ
    #             product_id = self.index_to_id.get(str(idx))
    #             product_id = 18  # Chỉ để kiểm tra, sẽ bỏ sau
    #             print('hehe product_id:', product_id)
    #             found = False
    #
    #             # Tìm sản phẩm tương ứng
    #             for product in self.product_contexts:
    #                 if str(product["id"]) == str(product_id):
    #                     contexts.append({
    #                         "score": scores[0][i],
    #                         "product_name": product["name"],
    #                         "product_id": product["id"],
    #                         "context": product["context"]
    #                     })
    #                     found = True
    #                     break
    #
    #             if not found:
    #                 print(f"  Không tìm thấy sản phẩm với ID: {product_id}")
    #
    #     print(f"Đã tìm thấy {len(contexts)} sản phẩm liên quan")
    #     return contexts

    def retrieve_relevant_contexts(self, query, top_k=3):
        """Truy xuất thông tin sản phẩm liên quan đến truy vấn"""
        print(f"\n=== Thông tin truy xuất ===")
        print(f"Truy vấn: '{query}'")

        # Debug index_to_id
        print(f"Kích thước index_to_id: {len(self.index_to_id)}")
        print(f"Một số mẫu key trong index_to_id: {list(self.index_to_id.keys())[:5]}")

        # Tạo embedding cho câu truy vấn
        query_embedding = self.embedding_model.encode([query])
        faiss.normalize_L2(query_embedding)

        # Tìm kiếm sản phẩm tương tự
        scores, indices = self.index.search(query_embedding, top_k)
        print(f"Kết quả tìm kiếm raw: indices={indices[0]}, scores={scores[0]}")

        # Lấy thông tin sản phẩm
        contexts = []
        for i, idx in enumerate(indices[0]):
            if idx >= 0:
                # Thử nhiều cách khác nhau để lấy product_id
                product_id = None

                # Cách 1: Thử sử dụng số nguyên
                if idx in self.index_to_id:
                    product_id = self.index_to_id[idx]
                    print(f"Tìm thấy product_id={product_id} qua int key")

                # Cách 2: Thử sử dụng chuỗi
                elif str(idx) in self.index_to_id:
                    product_id = self.index_to_id[str(idx)]
                    print(f"Tìm thấy product_id={product_id} qua string key")

                # Cách 3: Nếu không tìm thấy trong mapping, thử dùng index trực tiếp
                elif 0 <= idx < len(self.product_contexts):
                    product = self.product_contexts[idx]
                    product_id = product.get('id')
                    print(f"Dùng index trực tiếp, tìm thấy product_id={product_id}")

                # Nếu tìm thấy product_id, tìm sản phẩm tương ứng
                if product_id is not None:
                    for product in self.product_contexts:
                        if str(product["id"]) == str(product_id):
                            contexts.append({
                                "score": scores[0][i],
                                "product_name": product["name"],
                                "product_id": product["id"],
                                "context": product["context"]
                            })
                            break
                else:
                    print(f"Không thể ánh xạ index {idx} thành product_id")

        print(f"Đã tìm thấy {len(contexts)} sản phẩm liên quan")
        return contexts

    # def answer_question(self, query, max_new_tokens=512):
    #     """Trả lời câu hỏi bằng RAG"""
    #     # Truy xuất ngữ cảnh liên quan
    #     contexts = self.retrieve_relevant_contexts(query)
    #
    #     print(f"\nTìm thấy {len(contexts)} sản phẩm liên quan:")
    #     for i, ctx in enumerate(contexts):
    #         print(f"- Sản phẩm {i + 1}: {ctx['product_name']} (Score: {ctx['score']:.4f})")
    #
    #     if not contexts:
    #         # Nếu không tìm thấy ngữ cảnh liên quan
    #         print("Không tìm thấy sản phẩm liên quan!")
    #         return self.llm_model.generate_response(query, context=None, max_new_tokens=max_new_tokens)
    #
    #     # Kết hợp các ngữ cảnh thành một đầu vào
    #     combined_context = "\n\n".join([
    #         f"Sản phẩm: {ctx['product_name']} (ID: {ctx['product_id']})\n{ctx['context']}"
    #         for ctx in contexts
    #     ])
    #
    #     # In ra prompt để kiểm tra
    #     print("\nPrompt gửi tới mô hình:")
    #     print("-" * 40)
    #     print(f"Thông tin sản phẩm:\n{combined_context[:300]}...\n\nCâu hỏi: {query}")
    #     print("-" * 40)
    #
    #     # Sinh câu trả lời
    #     response = self.llm_model.generate_response(
    #         query=query,
    #         context=combined_context,
    #         max_new_tokens=max_new_tokens
    #     )
    #
    #     return response


    def answer_question(self, query, max_new_tokens=512):
        """Trả lời câu hỏi bằng RAG"""
        # Truy xuất ngữ cảnh liên quan
        contexts = self.retrieve_relevant_contexts(query)

        print(f"\nTìm thấy {len(contexts)} sản phẩm liên quan:")
        for i, ctx in enumerate(contexts):
            print(f"- Sản phẩm {i + 1}: {ctx['product_name']} (Score: {ctx['score']:.4f})")

        if not contexts:
            # Nếu không tìm thấy ngữ cảnh liên quan
            print("Không tìm thấy sản phẩm liên quan!")
            return self.llm_model.generate_response(query, context=None, max_new_tokens=max_new_tokens)

        # Kết hợp các ngữ cảnh thành một đầu vào
        combined_context = "\n\n".join([
            f"Sản phẩm: {ctx['product_name']} (ID: {ctx['product_id']})\n{ctx['context']}"
            for ctx in contexts
        ])

        # In ra prompt để kiểm tra
        print("\nPrompt gửi tới mô hình:")
        print("-" * 40)
        print(f"Thông tin sản phẩm:\n{combined_context[:300]}...\n\nCâu hỏi: {query}")
        print("-" * 40)

        # Sinh câu trả lời
        response = self.llm_model.generate_response(
            query=query,
            context=combined_context,
            max_new_tokens=max_new_tokens
        )

        return response

    # Thêm method này vào class RAGPipeline

    def answer_question_stream(self, query, max_new_tokens=512):
        """Trả lời câu hỏi bằng RAG với streaming"""
        # Truy xuất ngữ cảnh liên quan
        contexts = self.retrieve_relevant_contexts(query)

        print(f"\nTìm thấy {len(contexts)} sản phẩm liên quan:")
        for i, ctx in enumerate(contexts):
            print(f"- Sản phẩm {i + 1}: {ctx['product_name']} (Score: {ctx['score']:.4f})")

        if not contexts:
            # Nếu không tìm thấy ngữ cảnh liên quan
            print("Không tìm thấy sản phẩm liên quan!")
            for token in self.llm_model.generate_response_stream(query, context=None, max_new_tokens=max_new_tokens):
                yield token
            return

        # Kết hợp các ngữ cảnh thành một đầu vào
        combined_context = "\n\n".join([
            f"Sản phẩm: {ctx['product_name']} (ID: {ctx['product_id']})\n{ctx['context']}"
            for ctx in contexts
        ])

        # In ra prompt để kiểm tra
        print("\nPrompt gửi tới mô hình:")
        print("-" * 40)
        print(f"Thông tin sản phẩm:\n{combined_context[:300]}...\n\nCâu hỏi: {query}")
        print("-" * 40)

        # Sinh câu trả lời với streaming
        for token in self.llm_model.generate_response_stream(
                query=query,
                context=combined_context,
                max_new_tokens=max_new_tokens
        ):
            yield token