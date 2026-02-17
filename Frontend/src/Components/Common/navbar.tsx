/**
 * Navbar Component
 * 
 * Responsive navigation bar with React Router integration.
 */

import { Link } from 'react-router-dom';
import '../../Styles/navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        ThinkBack
                    </Link>

                    {/* Navigation Links */}
                    <div className="nav-links">
                        <Link to="/" className="nav-link">
                            Dashboard
                        </Link>
                        <Link to="/tickets" className="nav-link">
                            View Tickets
                        </Link>
                        <Link to="/chat" className="nav-link">
                            Chat with AI
                        </Link>
                        <Link to="/about" className="nav-link">
                            About
                        </Link>
                    </div>

                    {/* Mobile menu button - TODO: implement hamburger menu */}
                    <div className="mobile-menu-container">
                        <button className="mobile-menu-btn">
                            ☰
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
