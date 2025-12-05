import React, { useState, useEffect, useRef } from 'react';
import {
  Leaf,
  Battery,
  Shield,
  Award,
  Users,
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Sun,
  Heart,
  Target
} from 'lucide-react';

// Define a solar-themed color palette
import { solarTheme } from '@/theme/theme';

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 12 + Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: solarTheme.secondary[400],
            animation: `float ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function WhyChooseUsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const benefits = [
    {
      icon: <Sun className="h-6 w-6" />,
      title: 'Premium Solar Technology',
      description: 'State-of-the-art solar panels with industry-leading efficiency ratings and cutting-edge technology.',
      color: solarTheme.secondary[500],
      gradient: `linear-gradient(135deg, ${solarTheme.secondary[100]}, ${solarTheme.secondary[50]})`
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: '25+ Year Warranty',
      description: 'Comprehensive warranty coverage with 24/7 monitoring and maintenance support for peace of mind.',
      color: solarTheme.accent[500],
      gradient: `linear-gradient(135deg, ${solarTheme.accent[100]}, ${solarTheme.accent[50]})`
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Maximum Savings',
      description: 'Reduce your energy bills by up to 90% with our optimized solar solutions and smart energy management.',
      color: solarTheme.primary[500],
      gradient: `linear-gradient(135deg, ${solarTheme.primary[100]}, ${solarTheme.primary[50]})`
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Expert Installation',
      description: 'Certified professionals with over 15,000 successful installations and industry expertise.',
      color: solarTheme.secondary[600],
      gradient: `linear-gradient(135deg, ${solarTheme.secondary[200]}, ${solarTheme.secondary[100]})`
    },
    {
      icon: <Battery className="h-6 w-6" />,
      title: 'Smart Energy Storage',
      description: 'Advanced battery systems to store excess energy and provide backup power during outages.',
      color: solarTheme.accent[600],
      gradient: `linear-gradient(135deg, ${solarTheme.accent[200]}, ${solarTheme.accent[100]})`
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: 'Environmental Impact',
      description: 'Reduce your carbon footprint by an average of 3-4 tons of CO2 per year with clean energy.',
      color: solarTheme.success[500],
      gradient: `linear-gradient(135deg, ${solarTheme.success[100]}, ${solarTheme.success[50]})`
    }
  ];

  const stats = [
    { value: '15K+', label: 'Happy Customers', icon: <Heart className="h-5 w-5" /> },
    { value: '98%', label: 'Satisfaction Rate', icon: <Star className="h-5 w-5" /> },
    { value: '24/7', label: 'Support Available', icon: <Clock className="h-5 w-5" /> },
    { value: '25+', label: 'Years Experience', icon: <Award className="h-5 w-5" /> }
  ];

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${solarTheme.primary[50]} 0%, ${solarTheme.secondary[50]} 50%, ${solarTheme.accent[50]} 100%)`
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating orbs */}
        <div
          className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${solarTheme.primary[200]}, ${solarTheme.primary[100]})`,
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 20}px)`,
            animation: 'float 12s ease-in-out infinite',
            top: '10%',
            right: '-10%'
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15"
          style={{
            background: `radial-gradient(circle, ${solarTheme.secondary[200]}, ${solarTheme.secondary[100]})`,
            transform: `translate(${-mousePosition.x * 20}px, ${mousePosition.y * 30}px)`,
            animation: 'float 15s ease-in-out infinite reverse',
            bottom: '20%',
            left: '-5%'
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${solarTheme.primary[400]} 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollY * 0.05}px)`
          }}
        />

        {/* Floating particles */}
        <FloatingParticles />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 relative overflow-hidden group">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(135deg, ${solarTheme.primary[400]}, ${solarTheme.secondary[400]})`
              }}
            />
            <div
              className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle, ${solarTheme.accent[300]}, transparent)`
              }}
            />
            <Target
              className="h-8 w-8 relative z-10"
              style={{ color: solarTheme.primary[600] }}
            />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Why Choose{' '}
            <span
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${solarTheme.primary[600]}, ${solarTheme.secondary[600]})`
              }}
            >
              General Energy
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the benefits of choosing our services for your energy solutions.
            We deliver premium solar technology with unmatched expertise and support.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative p-4 md:p-6 rounded-xl text-center group cursor-pointer transition-all duration-500 hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  animationDelay: `${index * 100}ms`
                }}
                onMouseEnter={() => setHoveredCard(`stat-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${solarTheme.primary[500]}20` }}
                >
                  <div style={{ color: solarTheme.primary[600] }}>
                    {stat.icon}
                  </div>
                </div>
                <div
                  className="text-2xl md:text-3xl font-bold mb-1"
                  style={{ color: solarTheme.primary[600] }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>

                {hoveredCard === `stat-${index}` && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="relative p-6 lg:p-8 rounded-2xl cursor-pointer transition-all duration-500 group overflow-hidden"
              style={{
                background: hoveredCard === index
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                animationDelay: `${index * 100}ms`,
                transform: hoveredCard === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hoveredCard === index
                  ? `0 25px 50px ${benefit.color}20`
                  : '0 10px 25px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{ background: benefit.gradient }}
              />

              {/* Icon */}
              <div
                className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{
                  backgroundColor: `${benefit.color}15`,
                  boxShadow: hoveredCard === index ? `0 10px 25px ${benefit.color}30` : 'none'
                }}
              >
                <div
                  style={{ color: benefit.color }}
                  className={hoveredCard === index ? 'animate-pulse' : ''}
                >
                  {benefit.icon}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700">
                  {benefit.description}
                </p>

                {/* Learn more link */}
                <div className="flex items-center text-sm font-semibold transition-all duration-300 group-hover:translate-x-2">
                  <span style={{ color: benefit.color }}>Learn More</span>
                  <ArrowRight
                    className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: benefit.color }}
                  />
                </div>
              </div>

              {/* Hover indicator */}
              {hoveredCard === index && (
                <div className="absolute top-4 right-4">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
              )}

              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div
            className="inline-block p-6 lg:p-8 rounded-2xl relative overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 mr-2" style={{ color: solarTheme.success[500] }} />
                <span className="text-lg font-semibold text-gray-800">Ready to Get Started?</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-2xl">
                Join thousands of satisfied customers who have made the switch to clean, renewable energy.
              </p>
              <button
                onClick={() => window.location.href = '/about-us'}
                className="py-4 px-8 rounded-xl cursor-pointer text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})`,
                  boxShadow: `0 15px 30px ${solarTheme.primary[500]}40`
                }}
              >
                <span className="relative z-10 flex items-center">
                  Learn More About Our Services
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>

            {/* Background gradient */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${solarTheme.primary[200]}, ${solarTheme.secondary[200]})`
              }}
            />
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(1deg); }
          66% { transform: translateY(8px) rotate(-0.5deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}