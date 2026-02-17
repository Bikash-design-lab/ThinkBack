/**
 * useTickets Hook
 * 
 * Custom React hook for managing ticket operations.
 * Provides state management for fetching and creating tickets.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Ticket, TicketCreate } from '../Types/ticket.types';
import ticketService from '../Services/ticket.service';
import logger from '../utils/logger';

interface UseTicketsReturn {
    tickets: Ticket[];
    loading: boolean;
    error: string | null;
    fetchTickets: () => Promise<void>;
    createTicket: (data: TicketCreate) => Promise<Ticket | null>;
    refreshTickets: () => Promise<void>;
}

export const useTickets = (autoFetch: boolean = true): UseTicketsReturn => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            logger.info('Fetching tickets...');
            const data = await ticketService.getAllTickets();
            setTickets(data);
            logger.info(`Fetched ${data.length} tickets`);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch tickets';
            setError(errorMessage);
            logger.error('Error fetching tickets:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createTicket = useCallback(async (data: TicketCreate): Promise<Ticket | null> => {
        setLoading(true);
        setError(null);
        try {
            logger.info('Creating ticket:', data);
            const newTicket = await ticketService.createTicket(data);
            setTickets((prev) => [newTicket, ...prev]); // Add to beginning of list
            logger.info('Ticket created successfully:', newTicket);
            return newTicket;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create ticket';
            setError(errorMessage);
            logger.error('Error creating ticket:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshTickets = useCallback(async () => {
        await fetchTickets();
    }, [fetchTickets]);

    // Auto-fetch on mount if enabled
    useEffect(() => {
        if (autoFetch) {
            fetchTickets();
        }
    }, [autoFetch, fetchTickets]);

    return {
        tickets,
        loading,
        error,
        fetchTickets,
        createTicket,
        refreshTickets,
    };
};

export default useTickets;
