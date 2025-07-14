import axios from 'axios';

export interface ChatMessage {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
}

export interface ChatRequest {
    query: string;
    max_tokens?: number;
}

class ChatbotService {
    //private baseURL = 'https://pmshoanghot-chat-bot-pbl5.hf.space'; // URL của API chatbot
    private baseURL = 'http://192.168.101.90:8000';
    // API không streaming (backup)
    async sendMessage(request: ChatRequest): Promise<string> {
        try {
            const response = await axios.post(`${this.baseURL}/api/chat`, request);
            return response.data.response;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // API streaming
    async sendMessageStream(
        request: ChatRequest,
        onToken: (token: string) => void,
        onStart?: () => void,
        onEnd?: () => void,
        onError?: (error: string) => void
    ): Promise<void> {
        try {
            const response = await fetch(`${this.baseURL}/api/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No reader available');
            }

            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            
                            switch (data.type) {
                                case 'start':
                                    onStart?.();
                                    break;
                                case 'token':
                                    onToken(data.content);
                                    break;
                                case 'end':
                                    onEnd?.();
                                    break;
                                case 'error':
                                    onError?.(data.message);
                                    break;
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in streaming:', error);
            onError?.(error instanceof Error ? error.message : 'Unknown error');
        }
    }

    // Kiểm tra health của API
    async checkHealth(): Promise<boolean> {
        try {
            const response = await axios.get(`${this.baseURL}/health`);
            return response.data.status === 'healthy';
        } catch (error) {
            return false;
        }
    }
}

export default ChatbotService;