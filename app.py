import requests
import json
import time
import sys
from typing import Optional


class RAGChatbotClient:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url

    def check_health(self) -> bool:
        """Kiểm tra xem server có hoạt động không"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            if response.status_code == 200:
                print("✅ Server đang hoạt động bình thường")
                return True
            else:
                print(f"❌ Server có vấn đề: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Không thể kết nối tới server: {e}")
            return False

    def chat_non_streaming(self, query: str, max_tokens: int = 512) -> Optional[str]:
        """Gọi API không streaming"""
        try:
            response = requests.post(
                f"{self.base_url}/api/chat",
                json={"query": query, "max_tokens": max_tokens},
                timeout=60
            )

            if response.status_code == 200:
                result = response.json()
                return result.get("response", "")
            else:
                print(f"❌ Lỗi API: {response.status_code} - {response.text}")
                return None

        except requests.exceptions.RequestException as e:
            print(f"❌ Lỗi kết nối: {e}")
            return None

    def chat_streaming(self, query: str, max_tokens: int = 512) -> None:
        """Gọi API streaming và hiển thị kết quả từng phần"""
        try:
            print(f"🤖 Đang xử lý câu hỏi: '{query}'")
            print("-" * 60)

            response = requests.post(
                f"{self.base_url}/api/chat/stream",
                json={"query": query, "max_tokens": max_tokens},
                stream=True,
                timeout=120
            )

            if response.status_code != 200:
                print(f"❌ Lỗi API: {response.status_code} - {response.text}")
                return

            full_response = ""

            # Xử lý streaming response
            for line in response.iter_lines():
                if line:
                    line_str = line.decode('utf-8')

                    # Xử lý Server-Sent Events format
                    if line_str.startswith('data: '):
                        try:
                            data = json.loads(line_str[6:])  # Bỏ prefix "data: "

                            if data['type'] == 'start':
                                print(f"🚀 {data['message']}")
                                print("📝 Phản hồi: ", end='', flush=True)

                            elif data['type'] == 'token':
                                # In từng token ngay khi nhận được
                                token = data['content']
                                print(token, end='', flush=True)
                                full_response += token

                            elif data['type'] == 'end':
                                print(f"\n\n✅ {data['message']}")
                                print("-" * 60)

                            elif data['type'] == 'error':
                                print(f"\n❌ Lỗi: {data['message']}")
                                return

                        except json.JSONDecodeError:
                            # Bỏ qua các dòng không phải JSON
                            continue

            return full_response

        except requests.exceptions.RequestException as e:
            print(f"❌ Lỗi kết nối: {e}")
        except KeyboardInterrupt:
            print("\n\n⏹️ Người dùng dừng cuộc trò chuyện")


def main():
    """Hàm chính để chạy chatbot client"""
    print("🤖 RAG Chatbot Client - Streaming Demo")
    print("=" * 60)

    # Khởi tạo client
    client = RAGChatbotClient()

    # Kiểm tra kết nối
    if not client.check_health():
        print("Vui lòng khởi động server trước khi chạy client!")
        return

    print("\n📝 Nhập 'q' để thoát")
    print("📝 Nhập 'test' để chạy các test case mẫu")
    print("📝 Nhập 'mode' để chuyển đổi giữa streaming/non-streaming")
    print("-" * 60)

    streaming_mode = True

    while True:
        try:
            # Nhập câu hỏi
            query = input(f"\n{'[STREAMING]' if streaming_mode else '[NON-STREAMING]'} Câu hỏi: ").strip()

            if query.lower() == 'q':
                print("👋 Tạm biệt!")
                break

            if query.lower() == 'mode':
                streaming_mode = not streaming_mode
                mode_text = "STREAMING" if streaming_mode else "NON-STREAMING"
                print(f"🔄 Đã chuyển sang chế độ {mode_text}")
                continue

            if query.lower() == 'test':
                run_test_cases(client, streaming_mode)
                continue

            if not query:
                print("⚠️ Vui lòng nhập câu hỏi!")
                continue

            # Xử lý câu hỏi
            start_time = time.time()

            if streaming_mode:
                client.chat_streaming(query)
            else:
                response = client.chat_non_streaming(query)
                if response:
                    print(f"🤖 Phản hồi:\n{response}")

            end_time = time.time()
            print(f"⏱️ Thời gian xử lý: {end_time - start_time:.2f} giây")

        except KeyboardInterrupt:
            print("\n👋 Tạm biệt!")
            break
        except Exception as e:
            print(f"❌ Lỗi không mong đợi: {e}")


def run_test_cases(client: RAGChatbotClient, streaming_mode: bool):
    """Chạy các test case mẫu"""
    test_cases = [
        "Tôi muốn mua giày Nike",
        "Có áo thun Adidas nào không?",
        "Tìm túi đeo chéo",
        "Giày Under Armour giá bao nhiêu?",
        "Có sản phẩm Puma nào?",
        "Tôi cần mua balo",
    ]

    print(f"\n🧪 Chạy test cases ở chế độ {'STREAMING' if streaming_mode else 'NON-STREAMING'}")

    for i, query in enumerate(test_cases, 1):
        print(f"\n--- Test Case {i}/{len(test_cases)} ---")

        if streaming_mode:
            client.chat_streaming(query)
        else:
            response = client.chat_non_streaming(query)
            if response:
                print(f"🤖 Phản hồi:\n{response}")

        # Nghỉ 2 giây giữa các test
        time.sleep(2)


if __name__ == "__main__":
    main()