/**
 * Ticket Type Definitions
 * 
 * TypeScript interfaces matching the backend Pydantic schemas.
 * Ensures type safety across the frontend application.
 */

import { TICKET_CATEGORIES } from '../config/constants';

export type TicketCategory = typeof TICKET_CATEGORIES[number];

export interface TicketBase {
    title: string;
    description: string;
    category: TicketCategory;
    tags: string[];
    image?: string;
}

export interface TicketCreate extends TicketBase { }

export interface Ticket extends TicketBase {
    id: string;
    ai_summary?: string;
    created_at: string; // ISO 8601 datetime string
}

export interface TicketResponse extends Ticket { }

// API Response wrapper
export interface TicketsResponse {
    tickets: Ticket[];
    total: number;
}
