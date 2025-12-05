import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Leaf,
  Battery,
  ArrowRight,
  Play,
  Star,
  Users,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Award,
  Sparkles
} from 'lucide-react';

import { solarTheme } from '@/theme/theme';
import { cn } from '@/lib/cn';

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 15 + Math.random() * 10,
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

export default function ModernSolarHero() {
  const [currentStat, setCurrentStat] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      icon: <Users className="h-5 w-5" />,
      value: '15K+',
      label: 'Happy Customers',
      color: solarTheme.primary[500]
    },
    {
      icon: <Zap className="h-5 w-5" />,
      value: '85MW',
      label: 'Energy Generated',
      color: solarTheme.secondary[500]
    },
    {
      icon: <Award className="h-5 w-5" />,
      value: '98%',
      label: 'Efficiency Rate',
      color: solarTheme.accent[500]
    },
    {
      icon: <Star className="h-5 w-5" />,
      value: '4.9★',
      label: 'Customer Rating',
      color: solarTheme.primary[600]
    }
  ];

  const features = [
    { icon: <Zap className="h-4 w-4" />, text: 'Premium Efficiency Panels', color: solarTheme.primary[500] },
    { icon: <Battery className="h-4 w-4" />, text: 'Smart Energy Storage', color: solarTheme.accent[500] },
    { icon: <Shield className="h-4 w-4" />, text: '25+ Year Warranty', color: solarTheme.secondary[500] },
    { icon: <Leaf className="h-4 w-4" />, text: 'Carbon Neutral Future', color: solarTheme.primary[600] }
  ];

  // Auto-rotate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
      if (heroRef.current && heroRef.current.getBoundingClientRect) {
        const rect = heroRef.current.getBoundingClientRect();
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
    <div
      ref={heroRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${solarTheme.primary[50]} 0%, ${solarTheme.secondary[50]} 50%, ${solarTheme.accent[50]} 100%)`
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating orbs */}
        <div
          className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          style={{
            background: `radial-gradient(circle, ${solarTheme.primary[200]}, ${solarTheme.primary[100]})`,
            transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 30}px)`,
            animation: 'float 8s ease-in-out infinite',
            top: '-10%',
            left: '-10%'
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-25"
          style={{
            background: `radial-gradient(circle, ${solarTheme.secondary[200]}, ${solarTheme.secondary[100]})`,
            transform: `translate(${-mousePosition.x * 30}px, ${mousePosition.y * 40}px)`,
            animation: 'float 12s ease-in-out infinite reverse',
            top: '20%',
            right: '-10%'
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${solarTheme.accent[200]}, ${solarTheme.accent[100]})`,
            transform: `translate(${mousePosition.x * 20}px, ${-mousePosition.y * 25}px)`,
            animation: 'float 10s ease-in-out infinite',
            bottom: '10%',
            left: '20%'
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${solarTheme.primary[400]} 1px, transparent 0)`,
            backgroundSize: '60px 60px',
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        />

        {/* Floating particles */}
        <FloatingParticles />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Header space */}
          <div className="h-16" />

          {/* Scrollable content container */}
          <div className="px-4 pb-8">
            <div className="max-w-md mx-auto space-y-6">
              {/* Main heading - More compact */}
              <div className="space-y-3 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                  Transform Your Home with{' '}
                  <span
                    className="bg-gradient-to-r bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                    }}
                  >
                    General Energy Solutions
                  </span>
                </h1>

                <p className="text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                  Join the renewable energy revolution. Save money and reduce your carbon footprint with premium solar solutions.
                </p>
              </div>

              {/* CTA Buttons - More compact */}
              <div className="space-y-3">
                <button
                  className={cn(
                    "w-full py-3 px-6 rounded-xl text-white font-semibold text-base",
                    "transform transition-all duration-300 hover:scale-105 active:scale-95",
                    "shadow-xl relative overflow-hidden group"
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})`,
                    boxShadow: `0 15px 30px ${solarTheme.primary[500]}40`
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Get Free Solar Quote
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>

                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className={cn(
                    "w-full py-3 px-6 rounded-xl font-semibold text-base border-2",
                    "bg-white/10 backdrop-blur-md border-white/30",
                    "transition-all duration-300 hover:scale-105 hover:bg-white/20 flex items-center justify-center group"
                  )}
                  style={{ color: solarTheme.primary[700] }}
                >
                  <Play className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  Watch Demo Video
                </button>
              </div>

              {/* Mobile Stats Grid - More compact */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative p-4 rounded-xl cursor-pointer transition-all duration-500 group overflow-hidden",
                        "bg-white/10 backdrop-blur-md border border-white/20",
                        "hover:scale-105 hover:bg-white/20 hover:shadow-lg",
                        currentStat === index && "ring-2 ring-white/50 bg-white/20 scale-105"
                      )}
                      onClick={() => setCurrentStat(index)}
                      style={{
                        animationDelay: `${index * 150}ms`,
                        boxShadow: currentStat === index ? `0 15px 30px ${stat.color}20` : '0 8px 20px rgba(0,0,0,0.1)'
                      }}
                    >
                      {/* Icon with pulse animation */}
                      <div
                        className={cn(
                          "relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3",
                          "transform transition-all duration-300 group-hover:scale-110"
                        )}
                        style={{
                          backgroundColor: `${stat.color}15`,
                          boxShadow: currentStat === index ? `0 6px 15px ${stat.color}30` : 'none'
                        }}
                      >
                        <div style={{ color: stat.color }} className={currentStat === index ? 'animate-pulse' : ''}>
                          {stat.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div
                          className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${stat.color}, ${stat.color}cc)`
                          }}
                        >
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          {stat.label}
                        </div>
                      </div>

                      {/* Sparkle effect for active card */}
                      {currentStat === index && (
                        <div className="absolute top-2 right-2">
                          <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Stat indicators - More compact */}
                <div className="flex justify-center space-x-2">
                  {stats.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStat(index)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        index === currentStat ? "w-6" : "w-1.5 bg-gray-300"
                      )}
                      style={index === currentStat ? {
                        backgroundImage: `linear-gradient(90deg, ${solarTheme.primary[500]}, ${solarTheme.secondary[500]})`
                      } : {
                        backgroundColor: '#d1d5db'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Features - More compact */}
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-all duration-300",
                      "bg-white/10 backdrop-blur-md border border-white/20",
                      "hover:bg-white/20 hover:scale-105 hover:shadow-lg group cursor-pointer"
                    )}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      transform: `translateY(${index % 2 === 0 ? '0' : '4px'})`
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <div style={{ color: feature.color }}>
                        {feature.icon}
                      </div>
                    </div>
                    <span className="font-medium text-gray-700 text-sm">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trust indicators - More compact */}
              <div className="flex justify-center flex-wrap gap-3 text-xs text-gray-600">
                {[
                  { icon: CheckCircle, text: '25+ Years Warranty' },
                  { icon: Shield, text: 'Free Installation' },
                  { icon: Award, text: '24/7 Support' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-1.5">
                    <item.icon className="h-3 w-3" style={{ color: solarTheme.success[600] }} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Fixed for proper responsiveness */}
        <div className="hidden lg:flex lg:flex-col lg:min-h-screen">
          {/* Content container with proper centering */}
          <div className="flex-1 flex items-center justify-center px-4 xl:px-8 py-8">
            <div className="max-w-7xl w-full">
              <div className="grid grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center min-h-[600px]">
                {/* Left Column - Main Content */}
                <div className="col-span-12 lg:col-span-7 space-y-8">
                  {/* Main heading */}
                  <div className="space-y-6">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 leading-tight">
                      Power Your Future with{' '}
                      <span
                        className="bg-gradient-to-r bg-clip-text text-transparent block lg:inline"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`
                        }}
                      >
                        General Energy Solutions
                      </span>
                    </h1>

                    <p className="text-lg xl:text-xl text-gray-600 max-w-2xl leading-relaxed">
                      Join the renewable energy revolution. Save money, increase home value,
                      and create a sustainable future with our cutting-edge solar technology.
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                    <button
                      className={cn(
                        "py-4 px-8 rounded-2xl text-white font-semibold text-lg xl:text-xl",
                        "transform transition-all duration-300 hover:scale-105 hover:shadow-2xl",
                        "relative overflow-hidden group min-w-[200px]"
                      )}
                      style={{
                        background: `linear-gradient(135deg, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})`,
                        boxShadow: `0 20px 40px ${solarTheme.primary[500]}40`
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        Get Free Quote
                        <ArrowRight className="h-5 w-5 ml-3 transition-transform group-hover:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>

                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className={cn(
                        "py-4 px-8 rounded-2xl font-semibold text-lg xl:text-xl border-2",
                        "bg-white/10 backdrop-blur-md border-white/30",
                        "transition-all duration-300 hover:scale-105 hover:bg-white/20 flex items-center justify-center group min-w-[200px]"
                      )}
                      style={{ color: solarTheme.primary[700] }}
                    >
                      <Play className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
                      Watch Demo
                    </button>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex flex-wrap items-center gap-6 lg:gap-8 text-sm xl:text-base text-gray-600">
                    {[
                      { icon: CheckCircle, text: '25+ Years Warranty' },
                      { icon: Shield, text: 'Free Installation' },
                      { icon: Award, text: '24/7 Support' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4 xl:h-5 xl:w-5" style={{ color: solarTheme.success[600] }} />
                        <span className="font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Stats and Features */}
                <div className="col-span-12 lg:col-span-5 space-y-6 lg:space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 lg:gap-6">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className={cn(
                          "relative p-4 lg:p-6 rounded-xl cursor-pointer transition-all duration-500 group overflow-hidden",
                          "bg-white/10 backdrop-blur-md border border-white/20",
                          "hover:scale-105 hover:bg-white/20 hover:shadow-lg",
                          currentStat === index && "ring-2 ring-white/50 bg-white/20 scale-105"
                        )}
                        onClick={() => setCurrentStat(index)}
                        style={{
                          animationDelay: `${index * 150}ms`,
                          boxShadow: currentStat === index ? `0 15px 30px ${stat.color}20` : '0 8px 20px rgba(0,0,0,0.1)'
                        }}
                      >
                        {/* Icon */}
                        <div
                          className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-lg mb-3"
                          style={{ backgroundColor: `${stat.color}15` }}
                        >
                          <div style={{ color: stat.color }} className={cn("w-5 h-5 lg:w-6 lg:h-6", currentStat === index ? 'animate-pulse' : '')}>
                            {stat.icon}
                          </div>
                        </div>

                        {/* Content */}
                        <div>
                          <div
                            className="text-2xl lg:text-3xl font-bold mb-1"
                            style={{ color: stat.color }}
                          >
                            {stat.value}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-600 font-medium">
                            {stat.label}
                          </div>
                        </div>

                        {/* Active indicator */}
                        {currentStat === index && (
                          <div className="absolute top-3 right-3">
                            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Contact card */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 lg:p-8">
                    <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Get Started Today</h4>
                    <div className="space-y-3 lg:space-y-4">
                      {[
                        { icon: Phone, text: '(555) 123-SOLAR' },
                        { icon: Mail, text: 'hello@generalenergy.com' },
                        { icon: MapPin, text: 'Serving nationwide' }
                      ].map((contact, index) => (
                        <div key={index} className="flex items-center space-x-3 text-gray-600 text-sm lg:text-base">
                          <contact.icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                          <span>{contact.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(2deg); }
          66% { transform: translateY(10px) rotate(-1deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        /* Ensure proper height on all screen sizes */
        @media (min-width: 1024px) {
          .min-h-screen {
            min-height: 100vh;
          }
        }
      `}</style>
    </div>
  );
}