import os
import sys

# Thêm thư mục gốc vào sys.path để import các module
sys.path.append(os.path.abspath('.'))

from models.gemma_model import GemmaModel
# Hoặc: from app.models.gemma_keras_model import GemmaKerasModel
from models.rag_pipeline import RAGPipeline


def main():
    # Khởi tạo mô hình Gemma
    print("Khởi tạo mô hình Gemma 3...")
    gemma_model = GemmaModel()
    # Hoặc: gemma_model = GemmaKerasModel()

    # Khởi tạo RAG pipeline
    print("Khởi tạo RAG pipeline...")
    rag = RAGPipeline(gemma_model)

    # Vòng lặp tương tác
    print("\n====== Chatbot Sản Phẩm RAG với Gemma 3 ======")
    print("Nhập 'q' để thoát")

    while True:
        query = input("\nNhập câu hỏi về sản phẩm: ")
        if query.lower() == 'q':
            break

        print("\nĐang xử lý câu hỏi...")
        response = rag.answer_question(query)
        print(f"\nCâu trả lời: {response}")


if __name__ == "__main__":
    main()