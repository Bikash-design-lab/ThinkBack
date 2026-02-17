/**
 * useTickets Hook
 * 
 * Custom React hook for managing ticket operations.
 * Provides state management for fetching and creating tickets.
 */

import { useEffect, useCallback } from 'react';
import { useTicketContext } from '../Context/TicketContext';
import type { Ticket, TicketCreate } from '../Types/ticket.types';

interface UseTicketsReturn {
    tickets: Ticket[];
    loading: boolean;
    error: string | null;
    fetchTickets: (force?: boolean) => Promise<void>;
    createTicket: (data: TicketCreate) => Promise<Ticket | null>;
    refreshTickets: () => Promise<void>;
}

export const useTickets = (autoFetch: boolean = true): UseTicketsReturn => {
    const { tickets, loading, error, fetchTickets, createTicket } = useTicketContext();

    const refreshTickets = useCallback(async () => {
        await fetchTickets(true); // Force refresh
    }, [fetchTickets]);

    // Auto-fetch on mount if enabled (handled by context logic if empty)
    useEffect(() => {
        if (autoFetch) {
            fetchTickets(false); // Only fetch if empty
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
