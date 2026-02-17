/**
 * Tickets Page Component
 * 
 * Displays all tickets from the database in a grid layout.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScaleLoader from '../Common/loader';
import { formatDate, formatCategory } from '../../utils/formatters';
import { API_BASE_URL } from '../../config/constants';
import Footer from './footer';
import '../../Styles/tickets.css';

interface Ticket {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    image: string;
    ai_summary: string;
    created_at: string;
}

const BACKEND_URL = API_BASE_URL;

const Tickets = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BACKEND_URL}/api/tickets/`);

                if (!response.ok) {
                    throw new Error('Failed to fetch tickets');
                }

                const data = await response.json();
                setTickets(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    return (
        <div className="tickets-container">
            <div className="tickets-content">
                {/* Page Header */}
                <header className="tickets-header">
                    <h1 className="tickets-title">Browse Tickets</h1>
                </header>

                {/* Loading State */}
                {loading && (
                    <div className="tickets-state-container">
                        <ScaleLoader
                            loading={true}
                            color="#f97316"
                            height={35}
                            width={4}
                        />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="tickets-state-container">
                        <p className="tickets-error-text">❌ {error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && tickets.length === 0 && (
                    <div className="tickets-state-container">
                        <p className="tickets-empty-text">No tickets found. Create your first one!</p>
                    </div>
                )}

                {/* Tickets Grid */}
                {!loading && !error && tickets.length > 0 && (
                    <div className="tickets-grid">
                        {tickets.map((ticket) => (
                            <Link
                                key={ticket.id}
                                to={`/chat/ticket/${ticket.id}`}
                                className="ticket-item-card"
                            >
                                {/* Ticket Image */}
                                <div className="ticket-image-container">
                                    {ticket.image ? (
                                        <img
                                            src={ticket.image}
                                            alt={ticket.title}
                                            className="ticket-image"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML =
                                                    '<div class="ticket-image-fallback">📄</div>';
                                            }}
                                        />
                                    ) : (
                                        <div className="ticket-image-fallback">📄</div>
                                    )}
                                </div>

                                {/* Ticket Content */}
                                <div className="ticket-content">
                                    <div className="ticket-content-header">
                                        <h3 className="ticket-item-title">{ticket.title}</h3>
                                        <span className="ticket-item-category">
                                            {formatCategory(ticket.category)}
                                        </span>
                                    </div>

                                    {ticket.description && (
                                        <p className="ticket-item-description">
                                            {ticket.description}
                                        </p>
                                    )}

                                    {/* Tags */}
                                    {ticket.tags && ticket.tags.length > 0 && (
                                        <div className="ticket-tags">
                                            {ticket.tags.slice(0, 3).map((tag, index) => (
                                                <span key={index} className="ticket-tag">
                                                    {tag}
                                                </span>
                                            ))}
                                            {ticket.tags.length > 3 && (
                                                <span className="ticket-tag">
                                                    +{ticket.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="ticket-footer">
                                        <span className="ticket-date">
                                            Posted:{formatDate(ticket.created_at)}
                                        </span>
                                        <span className="ticket-id">
                                            #{ticket.id}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Tickets;