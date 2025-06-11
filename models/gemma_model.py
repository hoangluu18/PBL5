# #
# #
# # import torch
# # from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
# #
# #
# # class GemmaModel:
# #     def __init__(self):
# #
# #         # Cấu hình lượng tử hóa để tiết kiệm bộ nhớ
# #         quantization_config = BitsAndBytesConfig(
# #             load_in_8bit=True  # Sử dụng lượng tử hóa 8bit để giảm dung lượng bộ nhớ
# #         )
# #
# #         # Khởi tạo tokenizer
# #         self.model_id = "google/gemma-3-1b-it"
# #         self.tokenizer = AutoTokenizer.from_pretrained(self.model_id)
# #
# #         # Tải mô hình
# #         print("Đang tải mô hình Gemma 3...")
# #         self.model = AutoModelForCausalLM.from_pretrained(
# #             self.model_id,
# #             quantization_config=quantization_config,
# #             device_map="auto"  # Tự động phân bổ mô hình vào GPU hoặc CPU
# #         ).eval()
# #         print("Đã tải xong mô hình Gemma 3!")
# #
# #     def generate_response(self, query, context=None, max_new_tokens=512):
# #         """
# #         Tạo câu trả lời cho câu hỏi dựa trên ngữ cảnh (nếu có)
# #
# #         Args:
# #             query (str): Câu hỏi của người dùng
# #             context (str, optional): Thông tin ngữ cảnh từ RAG
# #             max_new_tokens (int): Số lượng token tối đa cho câu trả lời
# #
# #         Returns:
# #             str: Câu trả lời của mô hình
# #         """
# #         # Xây dựng prompt dựa trên ngữ cảnh RAG
# #         if context:
# #             system_prompt = "Bạn là trợ lý AI trả lời câu hỏi về sản phẩm dựa trên thông tin được cung cấp. Chỉ sử dụng thông tin có trong dữ liệu đã cho. Nếu không có thông tin, hãy nói rằng bạn không có đủ thông tin."
# #             prompt = f"Thông tin sản phẩm:\n{context}\n\nCâu hỏi: {query}"
# #         else:
# #             system_prompt = "Bạn là trợ lý AI trả lời câu hỏi về sản phẩm. Nếu không có đủ thông tin, hãy trả lời rằng bạn không có thông tin về sản phẩm đó."
# #             prompt = query
# #
# #         # Tạo cấu trúc tin nhắn theo định dạng chat
# #         messages = [
# #             [
# #                 {
# #                     "role": "system",
# #                     "content": [{"type": "text", "text": system_prompt}]
# #                 },
# #                 {
# #                     "role": "user",
# #                     "content": [{"type": "text", "text": prompt}]
# #                 }
# #             ]
# #         ]
# #
# #         # Áp dụng chat template và tokenize
# #         inputs = self.tokenizer.apply_chat_template(
# #             messages,
# #             add_generation_prompt=True,
# #             tokenize=True,
# #             return_dict=True,
# #             return_tensors="pt"
# #         ).to(self.model.device)
# #
# #         # Sinh câu trả lời
# #         with torch.inference_mode():
# #             outputs = self.model.generate(
# #                 **inputs,
# #                 max_new_tokens=max_new_tokens,
# #                 temperature=0.7,
# #                 top_p=0.9,
# #                 do_sample=True
# #             )
# #
# #         # Giải mã và trả về kết quả
# #         decoded_output = self.tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
# #
# #         # Xử lý kết quả để chỉ lấy phần phản hồi của mô hình
# #         assistant_prefix = "assistant"
# #         if assistant_prefix in decoded_output.lower():
# #             response = decoded_output.lower().split(assistant_prefix, 1)[1].strip()
# #             if response.startswith(": "):
# #                 response = response[2:]
# #             return response
# #
# #         return decoded_output
#
#
# import torch
# from transformers import AutoTokenizer, AutoModelForCausalLM
#
#
# class GemmaModel:
#     def __init__(self):
#         # Khởi tạo tokenizer
#         self.model_id = "google/gemma-3-1b-it"
#         #self.model_id = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
#         #self.model_id = "microsoft/phi-3-mini-4k-instruct-q4"
#         self.tokenizer = AutoTokenizer.from_pretrained(self.model_id)
#
#         # Tải mô hình không sử dụng lượng tử hóa
#         print("Đang tải mô hình Gemma 3 vào CPU...")
#         self.model = AutoModelForCausalLM.from_pretrained(
#             self.model_id,
#             device_map="cpu",  # Chỉ định rõ sử dụng CPU
#             torch_dtype=torch.float32  # Sử dụng độ chính xác đầy đủ
#         ).eval()
#         print("Đã tải xong mô hình Gemma 3!")
#
#
#     def generate_response(self, query, context=None, max_new_tokens=512):
#         """
#         Tạo câu trả lời cho câu hỏi dựa trên ngữ cảnh (nếu có)
#         """
#         # Xây dựng prompt dựa trên ngữ cảnh RAG
#         if context:
#             system_prompt = """
# Trả lời về sản phẩm theo quy tắc:
# 1. Liệt kê TẤT CẢ sản phẩm được cung cấp
# 2. Đầu tiên viết: "Tôi tìm thấy X sản phẩm liên quan:"
# 3. Tiếp theo là đường link dẫn tới sản phẩm đó: Chú ý THAY "alias" bằng giá trị THẬT từ sản phẩm
#    VÍ DỤ CỤ THỂ: [Giày Adidas Ultraboost 21](http://localhost:5173/p/giay-adidas-ultraboost-21)
# 4. Mỗi sản phẩm cần: link, giá, thương hiệu, trạng thái
# 5. Dùng gạch đầu dòng nếu có nhiều sản phẩm
# Trả lời bằng tiếng Việt, ngắn gọn.
#             """
#             prompt = f"Thông tin sản phẩm:\n{context}\n\nCâu hỏi: {query}"
#         else:
#             system_prompt = "Bạn là trợ lý AI trả lời câu hỏi về sản phẩm. Hiện tại không có thông tin chi tiết về sản phẩm này, vui lòng thử tìm kiếm sản phẩm khác."
#             prompt = query
#
#         # Tạo cấu trúc tin nhắn theo định dạng chat
#         messages = [
#             {
#                 "role": "system",
#                 "content": system_prompt
#             },
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ]
#
#         # Áp dụng chat template và tokenize
#         inputs = self.tokenizer.apply_chat_template(
#             messages if isinstance(messages[0], dict) else messages[0],
#             add_generation_prompt=True,
#             tokenize=True,
#             return_dict=True,
#             return_tensors="pt"
#         ).to(self.model.device)
#
#         # Sinh câu trả lời
#         with torch.no_grad(), torch.inference_mode():
#             outputs = self.model.generate(
#                 **inputs,
#                 max_new_tokens=max_new_tokens,
#                 temperature=0.7,
#                 top_p=0.9,
#                 do_sample=True
#             )
#
#         # Giải mã và trả về kết quả
#         decoded_output = self.tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
#
#         # Xử lý kết quả để chỉ lấy phần phản hồi của mô hình
#         assistant_prefix = "assistant"
#         if assistant_prefix in decoded_output.lower():
#             response = decoded_output.lower().split(assistant_prefix, 1)[1].strip()
#             if response.startswith(": "):
#                 response = response[2:]
#             return response
#
#         return decoded_output


import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, TextIteratorStreamer
from threading import Thread
import os
from huggingface_hub import login

class GemmaModel:
    def __init__(self):
        # Khởi tạo tokenizer
        hf_token = os.environ.get("HF_TOKEN")
        if hf_token:
            login(token=hf_token)
            print("🔐 Đã xác thực với Hugging Face")
            
        self.model_id = "google/gemma-3-1b-it"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_id)

        # Tải mô hình không sử dụng lượng tử hóa
        print("Đang tải mô hình Gemma 3 vào CPU...")
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_id,
            device_map="cuda",
            torch_dtype=torch.float32
        ).eval()
        print("Đã tải xong mô hình Gemma 3!")

    def generate_response_stream(self, query, context=None, max_new_tokens=512):
        """
        Sinh phản hồi dưới dạng streaming - trả về từng token khi được tạo ra
        """
        # Xây dựng prompt dựa trên ngữ cảnh RAG

        query_lower = query.lower().strip()

        # Chào hỏi
        greetings = ['xin chào', 'chào', 'hello', 'hi', 'chào bạn', 'chào anh', 'chào chị']
        if any(greeting in query_lower for greeting in greetings):
            yield "Tôi có thể giúp gì bạn?"
            return
            
        if context:
            system_prompt = """
             """
            prompt = f"Dựa vào thông tin sản phẩm sau để trả lời câu hỏi. Thông tin sản phẩm:\n{context}\n\nCâu hỏi: {query}."
        else:
            system_prompt = "Bạn là trợ lý AI trả lời câu hỏi về sản phẩm. Hiện tại không có thông tin chi tiết về sản phẩm này, vui lòng thử tìm kiếm sản phẩm khác."
            prompt = query

        # Tạo cấu trúc tin nhắn theo định dạng chat
        messages = [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": prompt
            }
        ]

        # Áp dụng chat template và tokenize
        inputs = self.tokenizer.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt"
        ).to(self.model.device)

        # Khởi tạo streamer để nhận token theo thời gian thực
        streamer = TextIteratorStreamer(
            self.tokenizer,
            skip_special_tokens=True,
            skip_prompt=True  # Bỏ qua phần prompt đầu vào
        )

        # Thiết lập tham số generation
        generation_kwargs = {
            **inputs,
            "streamer": streamer,
            "max_new_tokens": max_new_tokens,
            "temperature": 0.7,
            "top_p": 0.9,
            "do_sample": True,
            "pad_token_id": self.tokenizer.eos_token_id
        }

        # Chạy generation trong thread riêng biệt
        thread = Thread(target=self._generate_with_streamer, args=(generation_kwargs,))
        thread.start()

        # Yield từng token khi nó được tạo ra
        try:
            for new_text in streamer:
                if new_text:  # Chỉ yield nếu có text
                    yield new_text
        finally:
            thread.join()  # Đảm bảo thread kết thúc sạch sẽ

    def _generate_with_streamer(self, generation_kwargs):
        """Helper method để chạy generation trong thread riêng"""
        with torch.no_grad(), torch.inference_mode():
            self.model.generate(**generation_kwargs)

    # Giữ lại method cũ cho backward compatibility
    def generate_response(self, query, context=None, max_new_tokens=512):
        """
        Tạo câu trả lời đầy đủ (non-streaming)
        """
        full_response = ""
        for token in self.generate_response_stream(query, context, max_new_tokens):
            full_response += token
        return full_response