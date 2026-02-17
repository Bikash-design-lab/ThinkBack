/**
 * Chat SSE Streaming Service
 * 
 * Handles Server-Sent Events (SSE) streaming for AI chat.
 * Provides streaming for both global and ticket-specific chats.
 */

import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';
import type { SSEChunk } from '../Types/chat.types';
import logger from '../utils/logger';

export type SSEMessageCallback = (chunk: SSEChunk) => void;
export type SSECompleteCallback = () => void;
export type SSEErrorCallback = (error: string) => void;

class ChatService {
    /**
     * Stream global chat responses
     */
    streamGlobalChat(
        message: string,
        callbacks: {
            onMessage: SSEMessageCallback;
            onComplete?: SSECompleteCallback;
            onError?: SSEErrorCallback;
        }
    ): () => void {
        const url = `${API_BASE_URL}${API_ENDPOINTS.CHAT_GLOBAL}`;
        return this.startSSEStream(url, { message }, callbacks);
    }

    /**
     * Stream ticket-specific chat responses
     */
    streamTicketChat(
        ticketId: string,
        message: string,
        callbacks: {
            onMessage: SSEMessageCallback;
            onComplete?: SSECompleteCallback;
            onError?: SSEErrorCallback;
        }
    ): () => void {
        const url = `${API_BASE_URL}${API_ENDPOINTS.CHAT_TICKET(ticketId)}`;
        return this.startSSEStream(url, { message }, callbacks);
    }

    /**
     * Internal method to handle SSE streaming
     */
    private startSSEStream(
        url: string,
        body: { message: string },
        callbacks: {
            onMessage: SSEMessageCallback;
            onComplete?: SSECompleteCallback;
            onError?: SSEErrorCallback;
        }
    ): () => void {
        logger.info('Starting SSE stream:', url);

        let isClosed = false;

        // Use fetch with streaming response
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                if (!response.body) {
                    throw new Error('Response body is null');
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (!isClosed) {
                    const { done, value } = await reader.read();

                    if (done) {
                        logger.info('SSE stream completed');
                        callbacks.onComplete?.();
                        break;
                    }

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6); // Remove 'data: ' prefix

                            if (data === '[DONE]') {
                                logger.info('SSE [DONE] signal received');
                                callbacks.onComplete?.();
                                isClosed = true;
                                break;
                            }

                            try {
                                const parsed: SSEChunk = JSON.parse(data);

                                if (parsed.error) {
                                    logger.error('SSE error chunk:', parsed.error);
                                    callbacks.onError?.(parsed.error);
                                } else if (parsed.text) {
                                    callbacks.onMessage(parsed);
                                }
                            } catch (parseError) {
                                logger.warn('Failed to parse SSE chunk:', data);
                            }
                        }
                    }
                }
            })
            .catch((error) => {
                if (!isClosed) {
                    logger.error('SSE stream error:', error);
                    callbacks.onError?.(error.message || 'Stream connection failed');
                }
            });

        // Return cleanup function
        return () => {
            logger.info('Closing SSE stream');
            isClosed = true;
        };
    }
}

export const chatService = new ChatService();
export default chatService;
