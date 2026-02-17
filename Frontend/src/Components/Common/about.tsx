/**
 * About Page Component
 * 
 * Full-width monochromatic redesign matching Dashboard UI.
 * Removed "cover card" look for a clean, professional aesthetic.
 */

import aboutData from '../Data/data.about.json';
import Footer from '../Pages/footer';
import '../../Styles/about.css';

const About = () => {
    const { project, features } = aboutData;

    return (
        <div className="about-page">

            {/* Hero Section - Full Width Background */}
            <header className="about-hero-full">
                <h1 className="about-title">{project.name}</h1>
                <p className="about-tagline">{project.tagline}</p>
                <p className="about-description">{project.description}</p>

            </header>

            {/* Content Section - Centered Max-Width Wrapper */}
            <div className="about-content-wrapper">

                {/* Features Display */}
                <section className="about-section">
                    <h2 className="about-section-title">Capabilities</h2>
                    <div className="features-grid">
                        {features.map((feature) => (
                            <div key={feature.id} className="info-item">
                                <h3 className="info-item-title">{feature.title}</h3>
                                <p className="info-item-text">{feature.description}</p>
                                <p className="info-item-text italic opacity-40 mt-3 text-xs">{feature.detail}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default About;
