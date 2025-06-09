import React, { useState, useRef, useEffect } from 'react';
import { 
    Modal, 
    Input, 
    Button, 
    List, 
    Avatar, 
    Typography, 
    message,
    Spin,
    FloatButton
} from 'antd';
import { 
    MessageOutlined, 
    SendOutlined, 
    RobotOutlined, 
    UserOutlined,
    CloseOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import ChatbotService, { ChatMessage } from '../services/chatbot.service';
import '../css/chatbot.css';

const { TextArea } = Input;
const { Text } = Typography;

const ChatBot: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    
    const chatbotService = new ChatbotService();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentBotMessageRef = useRef<string>('');

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const generateMessageId = () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    };

    const addMessage = (type: 'user' | 'bot', content: string, isStreaming = false): string => {
        const newMessage: ChatMessage = {
            id: generateMessageId(),
            type,
            content,
            timestamp: new Date(),
            isStreaming
        };
        
        setMessages(prev => [...prev, newMessage]);
        return newMessage.id;
    };

    const updateBotMessage = (messageId: string, content: string, isStreaming = true) => {
        setMessages(prev => prev.map(msg => 
            msg.id === messageId 
                ? { ...msg, content, isStreaming }
                : msg
        ));
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading || isStreaming) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        
        // Add user message
        addMessage('user', userMessage);
        
        // Add bot message placeholder
        const botMessageId = addMessage('bot', '', true);
        currentBotMessageRef.current = '';
        
        setIsLoading(true);
        setIsStreaming(true);

        try {
            await chatbotService.sendMessageStream(
                { query: userMessage, max_tokens: 512 },
                // onToken
                (token: string) => {
                    currentBotMessageRef.current += token;
                    updateBotMessage(botMessageId, currentBotMessageRef.current, true);
                },
                // onStart
                () => {
                    console.log('Streaming started');
                },
                // onEnd
                () => {
                    updateBotMessage(botMessageId, currentBotMessageRef.current, false);
                    setIsStreaming(false);
                    setIsLoading(false);
                },
                // onError
                (error: string) => {
                    console.error('Streaming error:', error);
                    updateBotMessage(botMessageId, `Lỗi: ${error}`, false);
                    setIsStreaming(false);
                    setIsLoading(false);
                    message.error('Có lỗi xảy ra khi gửi tin nhắn');
                }
            );
        } catch (error) {
            console.error('Error sending message:', error);
            updateBotMessage(botMessageId, 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.', false);
            setIsStreaming(false);
            setIsLoading(false);
            message.error('Không thể kết nối đến chatbot');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        currentBotMessageRef.current = '';
    };

      const renderMessage = (msg: ChatMessage) => {
        const isBot = msg.type === 'bot';
        return (
            <List.Item
                key={msg.id}
                className={`chat-message ${isBot ? 'bot-message' : 'user-message'}`}
            >
                <List.Item.Meta
                    avatar={
                        <Avatar 
                            icon={isBot ? <RobotOutlined /> : <UserOutlined />}
                            style={{ 
                                backgroundColor: isBot ? '#1890ff' : '#52c41a' 
                            }}
                        />
                    }
                    description={
                        <div className="message-content">
                            {isBot ? (
                                <div className="markdown-content">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            ) : (
                                <Text>{msg.content}</Text>
                            )}
                            {msg.isStreaming && (
                                <Spin size="small" style={{ marginLeft: 8 }} />
                            )}
                        </div>
                    }
                />
                <div className="message-time">
                    {msg.timestamp.toLocaleTimeString()}
                </div>
            </List.Item>
        );
    };

    return (
        <>
            {/* Float Button để mở chatbot */}
            <FloatButton
                icon={<MessageOutlined />}
                type="primary"
                style={{
                    right: 24,
                    bottom: 24,
                    width: 60,
                    height: 60,
                }}
                onClick={() => setIsVisible(true)}
                tooltip="Trò chuyện với AI"
            />

            {/* Modal Chatbot */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <RobotOutlined style={{ color: '#1890ff' }} />
                        <span>AI Assistant</span>
                    </div>
                }
                open={isVisible}
                onCancel={() => setIsVisible(false)}
                footer={null}
                width={500}
                style={{ top: 20 }}
                className="chatbot-modal"
                closeIcon={<CloseOutlined />}
            >
                <div className="chatbot-container">
                    {/* Chat Messages */}
                    <div className="chat-messages">
                        {messages.length === 0 ? (
                            <div className="welcome-message">
                                <RobotOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                                <Text type="secondary">
                                    Xin chào! Tôi có thể giúp bạn tìm hiểu về sản phẩm. 
                                    Hãy đặt câu hỏi nhé!
                                </Text>
                            </div>
                        ) : (
                            <List
                                dataSource={messages}
                                renderItem={renderMessage}
                                split={false}
                            />
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="chat-input-area">
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <Button 
                                size="small" 
                                onClick={clearChat}
                                disabled={isLoading || isStreaming}
                            >
                                Xóa đoạn chat
                            </Button>
                        </div>
                        
                        <div style={{ display: 'flex', gap: 8 }}>
                            <TextArea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập câu hỏi của bạn..."
                                autoSize={{ minRows: 1, maxRows: 4 }}
                                disabled={isLoading || isStreaming}
                            />
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading || isStreaming}
                                loading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ChatBot;