# Dockerfile - Fixed permissions và cache
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Create user and directories with proper permissions
RUN useradd -m -u 1000 appuser && \
    mkdir -p /tmp/hf_cache && \
    mkdir -p /app/cache && \
    mkdir -p /app/scripts/data/embeddings && \
    mkdir -p /app/data/raw && \
    mkdir -p /app/data/processed && \
    chown -R appuser:appuser /app && \
    chown -R appuser:appuser /tmp/hf_cache

# Copy requirements and install as root
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Change ownership to appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set environment variables cho cache
ENV PYTHONPATH=/app
ENV HF_HOME=/tmp/hf_cache
ENV TRANSFORMERS_CACHE=/tmp/hf_cache
ENV HUGGINGFACE_HUB_CACHE=/tmp/hf_cache

EXPOSE 8000

CMD ["python", "main.py"]