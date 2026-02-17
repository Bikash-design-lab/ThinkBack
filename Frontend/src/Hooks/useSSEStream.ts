/**
 * useSSEStream Hook
 * 
 * Custom React hook for managing SSE streaming with session storage persistence.
 * Handles chat messages, streaming state, and persists conversations across page refreshes.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { ChatMessage } from '../Types/chat.types';
import { StreamStatus } from '../Types/chat.types';
import chatService from '../Services/chat.service';
import { STORAGE_KEYS } from '../config/constants';
import logger from '../utils/logger';

interface UseSSEStreamReturn {
    messages: ChatMessage[];
    status: StreamStatus;
    error: string | null;
    startStream: (message: string, ticketId?: string) => void;
    stopStream: () => void;
    clearMessages: () => void;
}

export const useSSEStream = (chatType: 'global' | 'ticket', ticketId?: string): UseSSEStreamReturn => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<StreamStatus>(StreamStatus.IDLE);
    const [error, setError] = useState<string | null>(null);
    const [currentAssistantMessage, setCurrentAssistantMessage] = useState<string>('');

    const stopStreamRef = useRef<(() => void) | null>(null);

    // Determine storage key based on chat type
    const storageKey = chatType === 'global'
        ? STORAGE_KEYS.GLOBAL_CHAT
        : STORAGE_KEYS.TICKET_CHAT(ticketId || '');

    // Load messages from session storage on mount
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem(storageKey);
            if (stored) {
                const parsedMessages = JSON.parse(stored);
                setMessages(parsedMessages);
                logger.info('Loaded chat history from session storage:', parsedMessages.length);
            }
        } catch (err) {
            logger.error('Failed to load chat history:', err);
        }
    }, [storageKey]);

    // Save messages to session storage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            try {
                sessionStorage.setItem(storageKey, JSON.stringify(messages));
                logger.debug('Saved chat history to session storage');
            } catch (err) {
                logger.error('Failed to save chat history:', err);
            }
        }
    }, [messages, storageKey]);

    const startStream = useCallback((message: string, ticketIdParam?: string) => {
        if (!message.trim()) {
            setError('Message cannot be empty');
            return;
        }

        // Add user message
        const userMessage: ChatMessage = {
            role: 'user',
            content: message,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setStatus(StreamStatus.CONNECTING);
        setError(null);
        setCurrentAssistantMessage('');

        const effectiveTicketId = ticketIdParam || ticketId;

        // Start SSE stream
        const cleanup = chatType === 'global'
            ? chatService.streamGlobalChat(message, {
                onMessage: (chunk) => {
                    if (chunk.text) {
                        setStatus(StreamStatus.STREAMING);
                        setCurrentAssistantMessage((prev) => prev + chunk.text);
                    }
                },
                onComplete: () => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: 'assistant',
                            content: currentAssistantMessage,
                            timestamp: Date.now(),
                        },
                    ]);
                    setCurrentAssistantMessage('');
                    setStatus(StreamStatus.COMPLETE);
                    stopStreamRef.current = null;
                },
                onError: (errorMsg) => {
                    setError(errorMsg);
                    setStatus(StreamStatus.ERROR);
                    stopStreamRef.current = null;
                },
            })
            : chatService.streamTicketChat(effectiveTicketId!, message, {
                onMessage: (chunk) => {
                    if (chunk.text) {
                        setStatus(StreamStatus.STREAMING);
                        setCurrentAssistantMessage((prev) => prev + chunk.text);
                    }
                },
                onComplete: () => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: 'assistant',
                            content: currentAssistantMessage,
                            timestamp: Date.now(),
                        },
                    ]);
                    setCurrentAssistantMessage('');
                    setStatus(StreamStatus.COMPLETE);
                    stopStreamRef.current = null;
                },
                onError: (errorMsg) => {
                    setError(errorMsg);
                    setStatus(StreamStatus.ERROR);
                    stopStreamRef.current = null;
                },
            });

        stopStreamRef.current = cleanup;
    }, [chatType, ticketId, currentAssistantMessage]);

    // Update messages when currentAssistantMessage changes
    useEffect(() => {
        if (currentAssistantMessage && status === StreamStatus.STREAMING) {
            // This effect ensures we can display the streaming message in real-time
            // The actual message is added to the array in onComplete
        }
    }, [currentAssistantMessage, status]);

    const stopStream = useCallback(() => {
        if (stopStreamRef.current) {
            stopStreamRef.current();
            stopStreamRef.current = null;
            setStatus(StreamStatus.IDLE);
            logger.info('Stream stopped by user');
        }
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setCurrentAssistantMessage('');
        setStatus(StreamStatus.IDLE);
        setError(null);
        sessionStorage.removeItem(storageKey);
        logger.info('Chat messages cleared');
    }, [storageKey]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (stopStreamRef.current) {
                stopStreamRef.current();
            }
        };
    }, []);

    return {
        messages,
        status,
        error,
        startStream,
        stopStream,
        clearMessages,
        // Expose current streaming message for real-time display
        ...(currentAssistantMessage && { currentAssistantMessage }),
    } as UseSSEStreamReturn & { currentAssistantMessage?: string };
};

export default useSSEStream;
