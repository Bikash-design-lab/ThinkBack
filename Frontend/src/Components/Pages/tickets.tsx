/**
 * Tickets Page Component
 * 
 * Displays all tickets from the database in a grid layout.
 * Create a new ticket button should open a modal to create a new ticket.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ScaleLoader from '../Common/loader';
import { formatDate, formatCategory, truncateWords } from '../../utils/formatters';
import useTickets from '../../Hooks/useTickets';
import CreateNewTicket from '../Forms/createNewTicket';
import Footer from './footer';
import '../../Styles/tickets.css';

const Tickets = () => {
    const { tickets, loading, error, fetchTickets } = useTickets(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const location = useLocation();

    // Handle auto-opening modal from dashboard navigation
    useEffect(() => {
        if (location.state?.openCreate) {
            setIsCreateModalOpen(true);
            // Clear state to prevent modal from re-opening on manual refresh or back button
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <div className="tickets-container">
            <div className="tickets-content">
                {/* Page Header */}
                <header className="tickets-header">
                    <div className="tickets-header-top">
                        <h1 className="tickets-title">Browse Tickets</h1>
                        <button
                            className="create-ticket-btn"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <span className="plus-icon">+</span> Create Ticket
                        </button>
                    </div>
                </header>

                {/* Create Ticket Modal */}
                {isCreateModalOpen && (
                    <CreateNewTicket
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={() => {
                            fetchTickets();
                            setIsCreateModalOpen(false);
                        }}
                    />
                )}
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
                                            {truncateWords(ticket.description, 15)}
                                        </p>
                                    )}

                                    {/* Tags */}
                                    <div className="ticket-tags">
                                        {ticket.tags && ticket.tags.length > 0 ? (
                                            <>
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
                                            </>
                                        ) : (
                                            <span className="ticket-tag no-tags">No tags</span>
                                        )}
                                    </div>

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