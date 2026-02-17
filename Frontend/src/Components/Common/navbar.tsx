/**
 * Navbar Component
 * 
 * Responsive navigation bar with React Router integration.
 */

import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                        ThinkBack
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <Link to="/tickets" className="text-gray-300 hover:text-white transition-colors">
                            Tickets
                        </Link>
                        <Link to="/chat/global" className="text-gray-300 hover:text-white transition-colors">
                            Chat with AI
                        </Link>
                        <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                            About
                        </Link>
                    </div>

                    {/* Mobile menu button - TODO: implement hamburger menu */}
                    <div className="md:hidden">
                        <button className="text-gray-300 hover:text-white">
                            ☰
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
