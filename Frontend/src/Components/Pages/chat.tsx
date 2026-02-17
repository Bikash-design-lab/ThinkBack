/**
 * Chat Component
 * 
 * unified chat interface for global and ticket-specific conversations.
 * Uses SSE streaming for real-time AI responses.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useSSEStream from '../../Hooks/useSSEStream';
import { StreamStatus } from '../../Types/chat.types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../../Styles/chat.css';

const Chat: React.FC = () => {
    const { ticketId } = useParams<{ ticketId?: string }>();
    const location = useLocation();
    const chatType = location.pathname.includes('/chat') ? 'global' : 'ticket';

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const {
        messages,
        status,
        error,
        startStream,
        clearMessages,
        currentAssistantMessage,
        elapsedTime
    } = useSSEStream(chatType, ticketId);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        // Use 'auto' instead of 'smooth' during streaming for better performance
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages, currentAssistantMessage]);

    // Focus input on mount
    useEffect(() => {
        textAreaRef.current?.focus();
    }, []);

    // Handle input change & auto-resize
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

    // Handle send message
    const handleSend = () => {
        if (inputValue.trim() && status !== StreamStatus.STREAMING) {
            startStream(inputValue);
            setInputValue('');
            if (textAreaRef.current) textAreaRef.current.style.height = 'auto';
        }
    };

    // Handle Enter key (Shift+Enter for newline)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isStreaming = status === StreamStatus.STREAMING || status === StreamStatus.CONNECTING;

    return (
        <div className="chat-container">
            {/* Header */}
            <header className="chat-header">
                <div className="chat-title-group">
                    <h1 className="chat-title">
                        {chatType === 'global' ? 'Global AI Assistant' : `Ticket Support #${ticketId?.slice(-6)}`}
                    </h1>
                    <span className="chat-subtitle">
                        {chatType === 'global' ? 'Ask anything to the AI Knowledge Base' : 'Specific help for this ticket'}
                    </span>
                </div>
                <button
                    className="clear-chat-btn"
                    onClick={clearMessages}
                >
                    Clear History
                </button>
            </header>

            {/* Messages Area */}
            <div className="messages-area">
                {messages.length === 0 && !currentAssistantMessage && (
                    <div className="chat-empty-state">
                        <div className="empty-icon">💬</div>
                        <h3>How can I help you?</h3>
                        <p>Start a conversation with the ThinkBack AI.</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={`${msg.timestamp}-${index}`}
                        className={`message-bubble ${msg.role}`}
                    >
                        {msg.role === 'assistant' ? (
                            <div className="markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            msg.content
                        )}
                        <span className="message-timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}

                {/* Thinking/Streaming Status Section */}
                {(currentAssistantMessage || status === StreamStatus.CONNECTING || (status === StreamStatus.STREAMING && !currentAssistantMessage)) && (
                    <div className="ai-status-container">
                        {!currentAssistantMessage && (
                            <div className="chat-thinking-status">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="thinking-text">AI is thinking... {elapsedTime}s</span>
                            </div>
                        )}

                        {currentAssistantMessage && (
                            <div className="message-bubble assistant streaming fade-in">
                                <div className="markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {currentAssistantMessage}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {status === StreamStatus.ERROR && error && (
                    <div className="message-bubble assistant error" style={{ border: '1px solid #ef4444', backgroundColor: '#fef2f2' }}>
                        <p style={{ color: '#ef4444', margin: 0 }}>❌ {error}</p>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
                <div className="input-container">
                    <textarea
                        ref={textAreaRef}
                        className="chat-input"
                        placeholder="Type your message..."
                        rows={1}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isStreaming}
                    />
                    <button
                        className="send-btn"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isStreaming}
                    >
                        <span className="send-icon">➤</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
