/**
 * Application Constants and Configuration
 * 
 * Centralized configuration file for environment variables,
 * API endpoints, and application-wide constants.
 */

// Runtime Environment Detection
const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

// Automatic Backend URL Selection
export const API_BASE_URL = isLocalhost
    ? 'http://localhost:8000'  // Local development
    : 'https://think-back-backend.vercel.app';  // Production

export const IS_DEVELOPMENT = isLocalhost;

// API Endpoints
export const API_ENDPOINTS = {
    TICKETS: '/api/tickets',
    CHAT_GLOBAL: '/api/chat/global/stream',
    CHAT_TICKET: (ticketId: string) => `/api/chat/ticket/${ticketId}/stream`,
    HEALTH: '/',
} as const;

// Ticket Categories
export const TICKET_CATEGORIES = [
    'AI',
    'Podcast',
    'Education',
    'Programming',
    'Science',
    'Math',
    'Other',
] as const;

export type TicketCategory = typeof TICKET_CATEGORIES[number];

// Validation Rules (matching backend)
export const VALIDATION = {
    TITLE_MIN_LENGTH: 5,
    DESCRIPTION_MIN_LENGTH: 10,
    MAX_TAGS: 10,
} as const;

// Session Storage Keys
export const STORAGE_KEYS = {
    GLOBAL_CHAT: 'thinkback_global_chat',
    TICKET_CHAT: (ticketId: string) => `thinkback_ticket_chat_${ticketId}`,
} as const;

// Rate Limiting (frontend-side awareness)
export const RATE_LIMIT = {
    REQUESTS_PER_MINUTE: 10,
    WARNING_THRESHOLD: 8,
} as const;

export default {
    API_BASE_URL,
    IS_DEVELOPMENT,
    API_ENDPOINTS,
    TICKET_CATEGORIES,
    VALIDATION,
    STORAGE_KEYS,
    RATE_LIMIT,
};
