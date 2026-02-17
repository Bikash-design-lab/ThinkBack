/**
 * Dashboard Page Component
 * 
 * Landing page with quick actions and recent tickets preview.
 */

import { Link } from 'react-router-dom';
import useTickets from '../../Hooks/useTickets';
import ScaleLoader from '../Common/loader';
import { formatDate, formatCategory } from '../../utils/formatters';
import Footer from '../Pages/footer';
import '../../Styles/dashboard.css';

const Dashboard = () => {
    const { tickets, loading, error } = useTickets(true);

    // Get 3 most recent tickets
    const recentTickets = tickets.slice(0, 3);

    return (
        <>
            <div className="dashboard-container">
                <div className="dashboard-content">

                    {/* Hero Section */}
                    <section className="hero-section">
                        <h1 className="hero-title">
                            ThinkBack
                        </h1>
                        <p className="hero-subtitle">
                            AI Educational Helpdesk Platform
                        </p>
                    </section>

                    {/* Quick Actions */}
                    <section className="quick-actions-grid">

                        <Link
                            to="/tickets"
                            state={{ openCreate: true }}
                            className="action-card create"
                        >
                            <div className="action-icon"></div>
                            <h3 className="action-title">Create Ticket</h3>
                            <p>Ask a question or report an issue</p>
                        </Link>

                        <Link
                            to="/chat"
                            className="action-card chat"
                        >
                            <div className="action-icon"></div>
                            <h3 className="action-title">Chat with AI</h3>
                            <p>Get instant help from AI tutor</p>
                        </Link>

                        <Link
                            to="/tickets"
                            className="action-card view"
                        >
                            <div className="action-icon"></div>
                            <h3 className="action-title">View Tickets</h3>
                            <p>Browse all knowledge tickets</p>
                        </Link>

                    </section>

                    {/* Recent Tickets */}
                    <section className="recent-tickets-section">
                        <div className="section-header">
                            <h2 className="section-title">Recent Tickets</h2>
                            <Link to="/tickets" className="view-all-link">
                                View All →
                            </Link>
                        </div>

                        {loading && (
                            <div className="state-container">
                                <ScaleLoader
                                    loading={true}
                                    color="#f97316"
                                    height={35}
                                    width={4}
                                />
                            </div>
                        )}

                        {error && (
                            <div className="state-container">
                                <p className="error-text">❌ {error}</p>
                            </div>
                        )}

                        {!loading && !error && recentTickets.length === 0 && (
                            <div className="state-container">
                                <p className="empty-text">No tickets yet. Create your first one!</p>
                            </div>
                        )}

                        {!loading && !error && recentTickets.length > 0 && (
                            <div className="tickets-list">
                                {recentTickets.map((ticket) => (
                                    <Link
                                        key={ticket.id}
                                        to={`/chat/ticket/${ticket.id}`}
                                        className="ticket-card"
                                    >
                                        <div className="ticket-header">
                                            <h3 className="ticket-title">
                                                {ticket.title}
                                            </h3>
                                            <span className="ticket-category">
                                                {formatCategory(ticket.category)}
                                            </span>
                                        </div>

                                        {ticket.ai_summary && (
                                            <p className="ticket-summary">
                                                {ticket.ai_summary}
                                            </p>
                                        )}

                                        <div className="ticket-meta">
                                            <span>Created:{formatDate(ticket.created_at)}</span>
                                            {ticket.tags && ticket.tags.length > 0 && (
                                                <span>🏷️ {ticket.tags.join(', ')}</span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                </div>

            </div>
            <Footer />
        </>
    );
};

export default Dashboard;
