/**
 * Footer Component
 * 
 * Simple footer with big brand name and bottom links row.
 */

import '../../Styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Big Brand Logo */}
                <div className="footer-brand">
                    <h2 className="footer-logo">ThinkBack</h2>
                </div>

                {/* Bottom Row: Company + Copyright + Links */}
                <div className="footer-bottom">
                    <div className="footer-company">
                        <span className="footer-company-logo">ThinkBack</span>
                    </div>

                    <p className="footer-copyright">
                        © {new Date().getFullYear()} ThinkBack. All rights reserved.
                    </p>

                    <ul className="footer-bottom-links">
                        <li>
                            <a href="https://github.com/bikash-design-lab/ThinkBack" target="_blank" rel="noopener noreferrer" className="footer-bottom-link">
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a href="https://linkedin.com/in/bikash-prasad-barnwal" target="_blank" rel="noopener noreferrer" className="footer-bottom-link">
                                LinkedIn
                            </a>
                        </li>
                        <li>
                            <a href="https://heybikash.vercel.app" target="_blank" rel="noopener noreferrer" className="footer-bottom-link">
                                Portfolio
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
