# main.py - Fixed với lifespan và error handling
import os
import sys
import json
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Thêm thư mục gốc vào sys.path
sys.path.append(os.path.abspath('.'))

from models.gemma_model import GemmaModel
from models.rag_pipeline import RAGPipeline

# Global variables
gemma_model = None
rag_pipeline = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Khởi tạo và dọn dẹp resources với proper error handling"""
    global gemma_model, rag_pipeline
    
    print("===== Application Startup =====")
    logger.info("🚀 Khởi tạo Gemma model và RAG pipeline...")
    
    try:
        # Tạo thư mục cache nếu cần
        cache_dir = "/tmp/hf_cache"
        os.makedirs(cache_dir, exist_ok=True)
        
        gemma_model = GemmaModel()
        rag_pipeline = RAGPipeline(gemma_model)
        logger.info("✅ Khởi tạo thành công!")
        
    except Exception as e:
        logger.error(f"❌ Lỗi khởi tạo: {e}")
        # Không raise exception để app vẫn có thể start
        logger.warning("⚠️ App sẽ chạy mà không có model")
    
    yield
    
    # Cleanup (if needed)
    logger.info("🔄 Đang dọn dẹp resources...")

# Khởi tạo FastAPI app với lifespan
app = FastAPI(
    title="RAG Product Chatbot API",
    description="API streaming cho chatbot RAG sản phẩm",
    version="1.0.0",
    lifespan=lifespan  # Sử dụng lifespan thay vì on_event
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên giới hạn
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    query: str
    max_tokens: int = 512

class ChatResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "RAG Product Chatbot API", 
        "status": "ready" if rag_pipeline else "model_loading",
        "version": "1.0.0",
        "model_loaded": gemma_model is not None,
        "endpoints": {
            "health": "/health",
            "chat": "/api/chat", 
            "stream": "/api/chat/stream"
        }
    }

@app.get("/health")
async def health_check():
    """Chi tiết health check"""
    return {
        "status": "healthy" if rag_pipeline else "initializing",
        "model_loaded": gemma_model is not None,
        "rag_ready": rag_pipeline is not None,
        "cache_dir": os.environ.get("HF_HOME", "/tmp/hf_cache"),
        "timestamp": asyncio.get_event_loop().time()
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_non_streaming(request: ChatRequest):
    """API không streaming"""
    if not rag_pipeline:
        return ChatResponse(response="⚠️ Model đang được khởi tạo, vui lòng thử lại sau.")
    
    try:
        response = rag_pipeline.answer_question(request.query, request.max_tokens)
        return ChatResponse(response=response)
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        return ChatResponse(response=f"❌ Lỗi xử lý: {str(e)}")

@app.post("/api/chat/stream")
async def chat_streaming(request: ChatRequest):
    """API streaming"""
    if not rag_pipeline:
        async def error_stream():
            yield f"data: {json.dumps({'type': 'error', 'content': '⚠️ Model đang được khởi tạo, vui lòng thử lại sau.'})}\n\n"
        
        return StreamingResponse(
            error_stream(),
            media_type="text/event-stream"
        )

    async def generate_stream():
        try:
            yield f"data: {json.dumps({'type': 'start', 'content': '🚀 Đang xử lý câu hỏi...'})}\n\n"
            
            for token in rag_pipeline.answer_question_stream(request.query, request.max_tokens):
                yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
                await asyncio.sleep(0.01)
            
            yield f"data: {json.dumps({'type': 'end', 'content': '✅ Hoàn tất!'})}\n\n"
            
        except Exception as e:
            logger.error(f"Error in streaming: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': f'❌ Lỗi: {str(e)}'})}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    )