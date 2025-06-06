import tensorflow as tf
import keras
import keras_hub as hub

# Kiểm tra phiên bản
print(f"TensorFlow version: {tf.__version__}")
print(f"Keras version: {keras.__version__}")

# Kiểm tra GPU
print(f"GPU available: {tf.config.list_physical_devices('GPU')}")

# Kiểm tra khả năng tải mô hình
try:
    from keras_hub.src.models.gemma.gemma_tokenizer import GemmaTokenizer
    from keras_hub.src.models.gemma.gemma_causal_lm import GemmaCausalLM

    print("Gemma components imported successfully!")
except ImportError as e:
    print(f"Error importing Gemma components: {e}")