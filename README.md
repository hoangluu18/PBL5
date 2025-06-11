---
title: RAG Product Chatbot
emoji: 🛒
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
license: mit
app_port: 8000
---

# RAG Product Chatbot 🛒

Một chatbot thông minh sử dụng RAG (Retrieval-Augmented Generation) để tư vấn sản phẩm với khả năng streaming response thời gian thực.

## Tính năng

- 🔍 **Tìm kiếm sản phẩm thông minh** với semantic search
- 💬 **Streaming chat** như ChatGPT 
- 🚀 **API RESTful** với FastAPI
- 🎯 **RAG Pipeline** kết hợp FAISS + Gemma 3 model
- 📱 **CORS support** cho frontend integration

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /api/chat` - Non-streaming chat
- `POST /api/chat/stream` - Streaming chat (SSE)

## Usage

### Non-streaming API
```bash
curl -X POST "https://your-space-name.hf.space/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"query": "Tôi muốn mua giày Nike", "max_tokens": 512}'
```

### Streaming API
```bash
curl -X POST "https://your-space-name.hf.space/api/chat/stream" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"query": "Tìm áo thun Adidas", "max_tokens": 512}'
```

## Supported Products

- 👕 Quần áo (Nike, Adidas, Under Armour, Puma, Reebok)
- 👟 Giày thể thao
- 🎒 Ba lô và túi đeo
- 🧢 Phụ kiện thời trang

## Technology Stack

- **Backend**: FastAPI + Python
- **AI Model**: Google Gemma 3-1B
- **Vector Search**: FAISS + SentenceTransformers  
- **Deployment**: Docker + Hugging Face Spaces