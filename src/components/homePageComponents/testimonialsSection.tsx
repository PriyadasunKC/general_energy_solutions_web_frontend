import React, { useState, useEffect, useRef } from 'react';
import {
    Star,
    Quote,
    User,
    MapPin,
    Calendar,
    Award,
    Sparkles
} from 'lucide-react';

// Define a solar-themed color palette
import { solarTheme } from '@/theme/theme';

// Floating background elements component
const FloatingElements = () => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 15 + Math.random() * 10,
        size: 4 + Math.random() * 12,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {elements.map((element) => (
                <div
                    key={element.id}
                    className="absolute rounded-full opacity-6"
                    style={{
                        left: `${element.x}%`,
                        top: `${element.y}%`,
                        width: `${element.size}px`,
                        height: `${element.size}px`,
                        background: `radial-gradient(circle, ${solarTheme.secondary[300]}40, ${solarTheme.primary[300]}40)`,
                        animation: `float ${element.duration}s ease-in-out infinite`,
                        animationDelay: `${element.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [dragState, setDragState] = useState({
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isDragging: false
    });
    const [scrollY, setScrollY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sample testimonials data
    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Homeowner",
            location: "California, USA",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616c830e6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            date: "2 months ago",
            testimonial: "Switching to solar energy was the best decision we made! Our electricity bills dropped by 90% and the installation team was incredibly professional.",
            savings: "$2,400/year",
            featured: true,
            cardColor: solarTheme.primary[100],
            accentColor: solarTheme.primary[500]
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Business Owner",
            location: "Texas, USA",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            date: "3 weeks ago",
            testimonial: "The solar installation for our warehouse was seamless. The team handled everything from permits to installation. We're now generating more energy than we consume!",
            savings: "$8,500/year",
            featured: false,
            cardColor: solarTheme.secondary[100],
            accentColor: solarTheme.secondary[500]
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            role: "Environmental Advocate",
            location: "Florida, USA",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            date: "1 month ago",
            testimonial: "Not only are we saving money, but we're also contributing to a cleaner environment. The solar panels look great and the app makes monitoring easy.",
            savings: "$1,800/year",
            featured: true,
            cardColor: solarTheme.accent[100],
            accentColor: solarTheme.accent[500]
        },
        {
            id: 4,
            name: "David Thompson",
            role: "Retired Engineer",
            location: "Arizona, USA",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            date: "6 weeks ago",
            testimonial: "As an engineer, I was skeptical about solar efficiency claims. But after installing this system, I'm amazed by the performance data. Best ROI ever!",
            savings: "$3,200/year",
            featured: false,
            cardColor: solarTheme.primary[100],
            accentColor: solarTheme.primary[600]
        },
        {
            id: 5,
            name: "Lisa Parker",
            role: "Teacher",
            location: "Nevada, USA",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            date: "5 days ago",
            testimonial: "The whole process was educational and transparent. They explained every step, and now I'm teaching my students about renewable energy!",
            savings: "$1,600/year",
            featured: true,
            cardColor: solarTheme.secondary[100],
            accentColor: solarTheme.secondary[600]
        }
    ];

    // Auto-rotation effect
    useEffect(() => {
        if (!isAutoPlaying || dragState.isDragging) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, dragState.isDragging, testimonials.length]);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Touch/Mouse handlers for natural swipe
    const handlePointerDown = (e: React.PointerEvent) => {
        setIsAutoPlaying(false);
        setDragState({
            startX: e.clientX,
            startY: e.clientY,
            currentX: e.clientX,
            currentY: e.clientY,
            isDragging: true
        });
        e.preventDefault();
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragState.isDragging) return;

        setDragState(prev => ({
            ...prev,
            currentX: e.clientX,
            currentY: e.clientY
        }));
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!dragState.isDragging) return;

        const deltaX = dragState.currentX - dragState.startX;
        const deltaY = dragState.currentY - dragState.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Only trigger if swipe is significant
        if (distance > 50) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0) {
                    goToPrevious();
                } else {
                    goToNext();
                }
            } else {
                // Vertical swipe
                if (deltaY > 0) {
                    goToPrevious();
                } else {
                    goToNext();
                }
            }
        }

        setDragState({
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            isDragging: false
        });

        // Resume auto-play after interaction
        setTimeout(() => setIsAutoPlaying(true), 3000);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
            />
        ));
    };

    return (
        <section
            className="relative py-16 lg:py-24 overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${solarTheme.primary[50]} 0%, ${solarTheme.secondary[50]} 50%, ${solarTheme.primary[50]} 100%)`
            }}
        >
            {/* Background Elements */}
            <FloatingElements />

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-3"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${solarTheme.primary[400]} 1px, transparent 0)`,
                    backgroundSize: '80px 80px',
                    transform: `translateY(${scrollY * 0.01}px)`
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: solarTheme.secondary[500] }}
                        />
                        <span
                            className="text-sm font-semibold uppercase tracking-wider"
                            style={{ color: solarTheme.primary[600] }}
                        >
                            Customer Stories
                        </span>
                        <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: solarTheme.secondary[500] }}
                        />
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        What Our{' '}
                        <span
                            className="bg-gradient-to-r bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(135deg, ${solarTheme.primary[600]}, ${solarTheme.secondary[600]})`
                            }}
                        >
                            Customers
                        </span>{' '}
                        Say
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
                        Join thousands of satisfied customers who have transformed their energy future with our solar solutions.
                    </p>

                    {/* Swipe hint */}
                    <p className="text-sm text-gray-400 italic">
                        Swipe to explore testimonials
                    </p>
                </div>

                {/* Natural 3D Card Stack */}
                <div className="relative max-w-md mx-auto" style={{ perspective: '1200px' }}>
                    <div
                        ref={containerRef}
                        className="relative h-[650px] cursor-grab active:cursor-grabbing select-none"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        style={{
                            touchAction: 'none',
                            userSelect: 'none'
                        }}
                    >
                        {testimonials.map((testimonial, index) => {
                            const offset = index - currentIndex;
                            const absOffset = Math.abs(offset);
                            const isActive = index === currentIndex;
                            const isVisible = absOffset <= 2;

                            if (!isVisible) return null;

                            // Calculate drag effect for active card
                            const dragOffsetX = dragState.isDragging && isActive
                                ? (dragState.currentX - dragState.startX) * 0.3
                                : 0;
                            const dragOffsetY = dragState.isDragging && isActive
                                ? (dragState.currentY - dragState.startY) * 0.2
                                : 0;
                            const dragRotation = dragState.isDragging && isActive
                                ? (dragState.currentX - dragState.startX) * 0.1
                                : 0;

                            return (
                                <div
                                    key={testimonial.id}
                                    className={`
                    absolute inset-0 transition-all duration-500 ease-out
                    ${isActive ? 'z-30' : `z-${20 - absOffset * 2}`}
                    ${dragState.isDragging && isActive ? 'duration-75' : 'duration-500'}
                  `}
                                    style={{
                                        transform: `
                      translateX(${dragOffsetX + (offset * 8)}px)
                      translateY(${dragOffsetY + (absOffset * -20)}px)
                      translateZ(${isActive ? 0 : -absOffset * 80}px)
                      rotateX(${absOffset * 10}deg)
                      rotateY(${dragRotation + (offset * 3)}deg)
                      rotateZ(${dragRotation * 0.3 + (offset * 1)}deg)
                      scale(${1 - absOffset * 0.08})
                    `,
                                        opacity: isActive ? 1 : Math.max(0.15, 1 - absOffset * 0.6),
                                        filter: `blur(${absOffset * 2.5}px)`,
                                        transformStyle: 'preserve-3d',
                                        transformOrigin: 'center center',
                                    }}
                                >
                                    {/* 3D Portrait Card */}
                                    <div
                                        className={`
                      w-full h-full rounded-3xl shadow-xl transition-all duration-300
                      border-4 border-white/60 backdrop-blur-sm
                      ${testimonial.featured && isActive ? 'ring-4 ring-yellow-400/30' : ''}
                    `}
                                        style={{
                                            background: `linear-gradient(135deg, 
                        ${testimonial.cardColor}${isActive ? '' : 'cc'}, 
                        rgba(255,255,255,${isActive ? '0.95' : '0.8'}), 
                        ${testimonial.cardColor}${isActive ? '95' : 'aa'}
                      )`,
                                            boxShadow: isActive
                                                ? `
                          0 30px 90px rgba(0,0,0,0.3),
                          0 0 0 1px rgba(255,255,255,0.8),
                          inset 0 1px 0 rgba(255,255,255,0.9),
                          inset 0 0 20px rgba(255,255,255,0.1)
                        `
                                                : `
                          0 ${15 + absOffset * 10}px ${40 + absOffset * 15}px rgba(0,0,0,0.2),
                          0 0 0 1px rgba(255,255,255,0.6),
                          inset 0 1px 0 rgba(255,255,255,0.7)
                        `,
                                        }}
                                    >
                                        {/* Card Header */}
                                        <div className="relative p-6 pb-4">
                                            {/* Featured Badge */}
                                            {testimonial.featured && isActive && (
                                                <div className="absolute -top-2 -right-2 z-10">
                                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2.5 shadow-lg border-2 border-white animate-pulse">
                                                        <Award className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Sparkle for active card */}
                                            {isActive && (
                                                <div className="absolute top-4 right-6 z-10">
                                                    <Sparkles className="w-5 h-5 text-yellow-400 animate-bounce" />
                                                </div>
                                            )}

                                            {/* Quote Icon */}
                                            <div className="absolute top-6 left-6">
                                                <div
                                                    className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/70 shadow-md"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${testimonial.accentColor}25, ${testimonial.accentColor}45)`
                                                    }}
                                                >
                                                    <Quote className="w-6 h-6" style={{ color: testimonial.accentColor }} />
                                                </div>
                                            </div>

                                            {/* Avatar Section */}
                                            <div className="flex flex-col items-center pt-12">
                                                <div className="relative mb-4">
                                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                                        <img
                                                            src={testimonial.avatar}
                                                            alt={testimonial.name}
                                                            className="w-full h-full object-cover"
                                                            draggable="false"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = "/packages/product_placeholder.png";
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-3 border-white shadow-lg"
                                                        style={{ backgroundColor: testimonial.accentColor }}
                                                    >
                                                        <User className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-xl text-gray-900 mb-1 text-center">
                                                    {testimonial.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2 text-center font-medium">
                                                    {testimonial.role}
                                                </p>

                                                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{testimonial.location}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{testimonial.date}</span>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center space-x-2 mb-6">
                                                    <div className="flex items-center space-x-1">
                                                        {renderStars(testimonial.rating)}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-600">
                                                        {testimonial.rating}.0
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="px-6 pb-8">
                                            {/* Testimonial Text */}
                                            <blockquote className="text-center text-gray-800 leading-relaxed mb-6 font-medium text-base">
                                                &ldquo;{testimonial.testimonial}&rdquo;
                                            </blockquote>

                                            {/* Savings Badge */}
                                            <div className="flex justify-center">
                                                <div className="inline-flex items-center space-x-2 px-4 py-3 rounded-full border-2 shadow-sm" style={{
                                                    backgroundColor: `${solarTheme.primary[50]}`,
                                                    borderColor: `${solarTheme.primary[200]}`
                                                }}>
                                                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: solarTheme.primary[500] }} />
                                                    <span className="text-sm font-bold" style={{ color: solarTheme.primary[700] }}>
                                                        Saves {testimonial.savings}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer Accent */}
                                        <div
                                            className="absolute bottom-0 left-0 right-0 h-3 rounded-b-3xl"
                                            style={{
                                                background: `linear-gradient(90deg, ${testimonial.accentColor}, ${testimonial.accentColor}bb, ${testimonial.accentColor})`
                                            }}
                                        />

                                        {/* Subtle shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl pointer-events-none" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Minimal progress indicator */}
                <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                        {testimonials.map((_, index) => (
                            <div
                                key={index}
                                className={`
                  transition-all duration-500 rounded-full
                  ${index === currentIndex ? 'w-8 h-2 opacity-100' : 'w-2 h-2 opacity-40'}
                `}
                                style={{
                                    backgroundColor: solarTheme.primary[500]
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
      `}</style>
        </section>
    );
}