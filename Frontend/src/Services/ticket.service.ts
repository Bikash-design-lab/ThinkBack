/**
 * Ticket API Service
 * 
 * Service for ticket-related API operations.
 */

import { API_ENDPOINTS } from '../config/constants';
import type { Ticket, TicketCreate } from '../Types/ticket.types';
import apiService from './api.service';

class TicketService {
    /**
     * Get all tickets
     */
    async getAllTickets(): Promise<Ticket[]> {
        return apiService.get<Ticket[]>(API_ENDPOINTS.TICKETS);
    }

    /**
     * Create a new ticket
     */
    async createTicket(ticketData: TicketCreate): Promise<Ticket> {
        return apiService.post<Ticket>(API_ENDPOINTS.TICKETS, ticketData);
    }

    /**
     * Get ticket by ID (if backend supports in future)
     */
    async getTicketById(id: string): Promise<Ticket> {
        return apiService.get<Ticket>(`${API_ENDPOINTS.TICKETS}/${id}`);
    }
}

export const ticketService = new TicketService();
export default ticketService;
