/**
 * About Page Component
 * 
 * Full-width monochromatic redesign matching Dashboard UI.
 * Removed "cover card" look for a clean, professional aesthetic.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import aboutData from '../Data/data.about.json';
import Footer from '../Pages/footer';
import '../../Styles/about.css';

const About = () => {
    const { project, features } = aboutData;

    // Prepare clones for true infinite loop
    // Cloned items for seamless looping
    const extendedFeatures = [
        ...features.slice(-6),
        ...features,
        ...features.slice(0, 6)
    ];

    const [currentIndex, setCurrentIndex] = useState(6); // Start at the first original item
    const [itemsPerView, setItemsPerView] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const reelRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<any>(null);
    const dragStartRef = useRef<number>(0);
    const lastInteractionRef = useRef<number>(Date.now());

    // Flick Physics state
    const lastPosRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const velocityRef = useRef<number>(0);

    const updateDimensions = useCallback(() => {
        const width = window.innerWidth;
        if (width >= 1200) setItemsPerView(3);
        else if (width >= 768) setItemsPerView(2);
        else setItemsPerView(1);
    }, []);

    useEffect(() => {
        updateDimensions();
        // Delay ensures layout is ready before the first calculate
        const timer = setTimeout(updateDimensions, 100);
        window.addEventListener('resize', updateDimensions);
        return () => {
            window.removeEventListener('resize', updateDimensions);
            clearTimeout(timer);
        };
    }, [updateDimensions]);

    const handleTransitionEnd = useCallback(() => {
        // Safe jump logic: if we are in the clone zones, jump to the equivalent original index
        if (currentIndex <= 0) {
            setIsTransitioning(false);
            setCurrentIndex(features.length);
        } else if (currentIndex >= features.length + 6) {
            setIsTransitioning(false);
            setCurrentIndex(currentIndex - features.length);
        }
    }, [currentIndex, features.length]);

    // Restore transition after the "jump"
    useEffect(() => {
        if (!isTransitioning) {
            const timer = setTimeout(() => setIsTransitioning(true), 15);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    const nextSlide = useCallback(() => {
        if (!isTransitioning) return;
        if (isDragging) return;
        setCurrentIndex((prev) => prev + 1);
        lastInteractionRef.current = Date.now();
    }, [isDragging, isTransitioning]);

    const prevSlide = useCallback(() => {
        if (!isTransitioning) return;
        if (isDragging) return;
        setCurrentIndex((prev) => prev - 1);
        lastInteractionRef.current = Date.now();
    }, [isDragging, isTransitioning]);

    const goToSlide = (index: number) => {
        if (!isTransitioning) return;
        setCurrentIndex(index + 6);
        lastInteractionRef.current = Date.now();
    };

    // Auto Play logic
    useEffect(() => {
        autoPlayRef.current = setInterval(() => {
            const idleTime = Date.now() - lastInteractionRef.current;
            if (idleTime > 6000 && !isDragging && isTransitioning) {
                nextSlide();
            }
        }, 4000);
        return () => clearInterval(autoPlayRef.current);
    }, [nextSlide, isDragging, isTransitioning]);

    // Drag Handlers
    const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isTransitioning) return;

        setIsDragging(true);
        setIsTransitioning(false);
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        dragStartRef.current = clientX;
        lastPosRef.current = clientX;
        lastTimeRef.current = Date.now();
        lastInteractionRef.current = Date.now();
    };

    const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const offset = clientX - dragStartRef.current;
        setDragOffset(offset);

        const now = Date.now();
        const elapsed = now - lastTimeRef.current;
        if (elapsed > 0) {
            velocityRef.current = (clientX - lastPosRef.current) / elapsed;
        }
        lastPosRef.current = clientX;
        lastTimeRef.current = now;
    };

    const onDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        setIsTransitioning(true);

        const slideWidth = reelRef.current ? reelRef.current.offsetWidth / itemsPerView : 1;
        const threshold = slideWidth / 4;
        const flickPower = velocityRef.current * 120;

        if (Math.abs(dragOffset) > threshold || Math.abs(flickPower) > 10) {
            if (dragOffset > 0 || flickPower > 10) setCurrentIndex((prev) => prev - 1);
            else setCurrentIndex((prev) => prev + 1);
        }

        setDragOffset(0);
        velocityRef.current = 0;
    };

    // Calculate "real" index for the dots
    const realIndex = (currentIndex - 6 + features.length) % features.length;

    return (
        <div className="about-page" style={{ marginTop: '10px' }}>
            <header className="about-hero-full">
                <h1 className="about-title">{project.name}</h1>
                <p className="about-tagline">{project.tagline}</p>
                <p className="about-description">{project.description}</p>
            </header>

            <div className="about-content-wrapper">
                <section className="about-section">
                    <h2 className="about-section-title">Capabilities</h2>

                    <div className="carousel-outer-wrapper" style={{ position: 'relative' }}>
                        <div
                            className={`carousel-outer ${isDragging ? 'dragging' : ''}`}
                            onMouseDown={onDragStart}
                            onMouseMove={onDragMove}
                            onMouseUp={onDragEnd}
                            onMouseLeave={onDragEnd}
                            onTouchStart={onDragStart}
                            onTouchMove={onDragMove}
                            onTouchEnd={onDragEnd}
                        >
                            <button className="carousel-arrow left" onClick={(e) => { e.stopPropagation(); prevSlide(); }} aria-label="Previous slide">
                                &#10094;
                            </button>

                            <div className="carousel-viewport">
                                <div
                                    ref={reelRef}
                                    className="carousel-reel"
                                    onTransitionEnd={handleTransitionEnd}
                                    style={{
                                        transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% + ${dragOffset}px))`,
                                        transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                                    }}
                                >
                                    {extendedFeatures.map((feature, index) => (
                                        <div key={`${feature.id}-${index}`} className="carousel-slide">
                                            <div className="info-item">
                                                <h3 className="info-item-title">{feature.title}</h3>
                                                <p className="info-item-text">{feature.description}</p>
                                                <div className="info-item-text italic opacity-40 mt-3 text-xs">{feature.detail}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="carousel-arrow right" onClick={(e) => { e.stopPropagation(); nextSlide(); }} aria-label="Next slide">
                                &#10095;
                            </button>
                        </div>

                        {/* Pagination Dots */}
                        <div className="carousel-dots">
                            {features.map((_, index) => (
                                <button
                                    key={index}
                                    className={`carousel-dot ${realIndex === index ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default About;
