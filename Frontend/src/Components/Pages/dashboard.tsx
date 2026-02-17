/**
 * Dashboard Page Component
 * 
 * Landing page with quick actions and recent tickets preview.
 */

import { Link } from 'react-router-dom';
import useTickets from '../../Hooks/useTickets';
import ScaleLoader from '../Common/loader';
import { formatDate, formatCategory } from '../../utils/formatters';

const Dashboard = () => {
    const { tickets, loading, error } = useTickets(true);

    // Get 3 most recent tickets
    const recentTickets = tickets.slice(0, 3);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8 max-w-6xl">

                {/* Hero Section */}
                <section className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        ThinkBack
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        AI Educational Helpdesk Platform
                    </p>
                </section>

                {/* Quick Actions */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                    <Link
                        to="/tickets/create"
                        className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="text-4xl mb-4">📝</div>
                        <h3 className="text-2xl font-bold mb-2">Create Ticket</h3>
                        <p className="text-blue-100">Ask a question or report an issue</p>
                    </Link>

                    <Link
                        to="/chat/global"
                        className="bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-2xl font-bold mb-2">Chat with AI</h3>
                        <p className="text-purple-100">Get instant help from AI tutor</p>
                    </Link>

                    <Link
                        to="/tickets"
                        className="bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="text-4xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold mb-2">View Tickets</h3>
                        <p className="text-green-100">Browse all knowledge tickets</p>
                    </Link>

                </section>

                {/* Recent Tickets */}
                <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-white">Recent Tickets</h2>
                        <Link to="/tickets" className="text-blue-400 hover:text-blue-300 font-medium">
                            View All →
                        </Link>
                    </div>

                    {loading && (
                        <div className="flex justify-center py-12">
                            <ScaleLoader
                                loading={true}
                                color="#3b82f6"
                                height={35}
                                width={4}
                            />
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12">
                            <p className="text-red-400 text-lg">❌ {error}</p>
                        </div>
                    )}

                    {!loading && !error && recentTickets.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No tickets yet. Create your first one!</p>
                        </div>
                    )}

                    {!loading && !error && recentTickets.length > 0 && (
                        <div className="space-y-4">
                            {recentTickets.map((ticket) => (
                                <Link
                                    key={ticket.id}
                                    to={`/chat/ticket/${ticket.id}`}
                                    className="block bg-white/5 hover:bg-white/10 rounded-xl p-6 transition-all duration-200 border border-white/10 hover:border-white/20"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-semibold text-white flex-1">
                                            {ticket.title}
                                        </h3>
                                        <span className="text-sm px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 ml-4">
                                            {formatCategory(ticket.category)}
                                        </span>
                                    </div>

                                    {ticket.ai_summary && (
                                        <p className="text-gray-300 mb-3 line-clamp-2">
                                            {ticket.ai_summary}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span>📅 {formatDate(ticket.created_at)}</span>
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
    );
};

export default Dashboard;
