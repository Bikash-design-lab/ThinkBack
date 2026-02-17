/**
 * Ticket Context
 * 
 * Provides global state management for tickets.
 * Ensures data persists across page navigations.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Ticket, TicketCreate } from '../Types/ticket.types';
import ticketService from '../Services/ticket.service';
import logger from '../utils/logger';

interface TicketContextType {
    tickets: Ticket[];
    loading: boolean;
    error: string | null;
    fetchTickets: (force?: boolean) => Promise<void>;
    createTicket: (data: TicketCreate) => Promise<Ticket | null>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = useCallback(async (force: boolean = false) => {
        // If we already have tickets and aren't forcing a refresh, skip
        if (tickets.length > 0 && !force) return;

        setLoading(true);
        setError(null);
        try {
            logger.info('Fetching tickets (global)...');
            const data = await ticketService.getAllTickets();
            setTickets(data);
            logger.info(`Fetched ${data.length} tickets globally`);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch tickets';
            setError(errorMessage);
            logger.error('Error fetching tickets globally:', err);
        } finally {
            setLoading(false);
        }
    }, [tickets.length]);

    const createTicket = useCallback(async (data: TicketCreate): Promise<Ticket | null> => {
        setLoading(true);
        setError(null);
        try {
            logger.info('Creating ticket (global):', data);
            const newTicket = await ticketService.createTicket(data);
            setTickets((prev) => [newTicket, ...prev]); // Add to beginning
            logger.info('Ticket created successfully in global state');
            return newTicket;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create ticket';
            setError(errorMessage);
            logger.error('Error creating ticket globally:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        tickets,
        loading,
        error,
        fetchTickets,
        createTicket,
    };

    return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};

export const useTicketContext = () => {
    const context = useContext(TicketContext);
    if (!context) {
        throw new Error('useTicketContext must be used within a TicketProvider');
    }
    return context;
};
