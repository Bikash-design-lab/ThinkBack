/**
 * Navbar Component
 * 
 * Responsive navigation bar with React Router integration.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../Styles/navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            setIsVisible(false);
        } else {
            // Scrolling up
            setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <nav className={`navbar ${!isVisible ? 'navbar-hidden' : ''} ${isMenuOpen ? 'navbar-open' : ''}`}>
            <div className="navbar-container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        ThinkBack
                    </Link>

                    {/* Navigation Links */}
                    <div className="nav-links">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                        <Link to="/tickets" className="nav-link">
                            View Tickets
                        </Link>
                        <Link to="/chat" className="nav-link">
                            Chat with AI <span className="nav-badge">NEW</span>
                        </Link>
                        <Link to="/about" className="nav-link">
                            About
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="mobile-menu-container">
                        <button
                            className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`}
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
                    <div className="mobile-nav-links">
                        <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                            Home
                        </Link>
                        <Link to="/tickets" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                            View Tickets
                        </Link>
                        <Link to="/chat" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                            Chat with AI <span className="nav-badge">NEW</span>
                        </Link>
                        <Link to="/about" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                            About
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
