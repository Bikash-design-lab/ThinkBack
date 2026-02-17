/**
 * Chat Type Definitions
 * 
 * TypeScript interfaces for chat-related functionality and SSE streaming.
 */

export const StreamStatus = {
    IDLE: 'IDLE',
    CONNECTING: 'CONNECTING',
    STREAMING: 'STREAMING',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR',
} as const;

export type StreamStatus = typeof StreamStatus[keyof typeof StreamStatus];

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface SSEChunk {
    text?: string;
    error?: string;
}

export interface ChatState {
    messages: ChatMessage[];
    status: StreamStatus;
    error: string | null;
}
