'use client';
import React, { JSX } from 'react';
import { Wrench, Calculator, ArrowRight, Sun, Lightbulb } from 'lucide-react';
import { solarTheme } from '@/theme/theme';

interface ResourceCard {
    id: string;
    title: string;
    description: string;
    icon: JSX.Element;
    route: string;
    color: 'primary' | 'secondary';
    benefits: string[];
}

export default function ResourcesPage(): JSX.Element {
    const resourceCards: ResourceCard[] = [
        {
            id: 'maintenance',
            title: 'Solar Maintenance Tips',
            description: 'Learn how to keep your solar panels performing at their best with expert maintenance guidance and schedules.',
            icon: <Wrench className="w-6 h-6 sm:w-8 sm:h-8" />,
            route: '/resources/solar-maintenance-tips',
            color: 'primary',
            benefits: [
                'Extend panel lifespan',
                'Maximize energy output',
                'Prevent costly repairs',
                'Maintain warranty coverage'
            ]
        },
        {
            id: 'calculator',
            title: 'Solar Saving Calculator',
            description: 'Calculate your potential savings and return on investment with our comprehensive solar calculator.',
            icon: <Calculator className="w-6 h-6 sm:w-8 sm:h-8" />,
            route: '/resources/solar-saving-calulator',
            color: 'secondary',
            benefits: [
                'Estimate monthly savings',
                'Calculate payback period',
                'Compare financing options',
                'Environmental impact metrics'
            ]
        }
    ];

    const handleCardClick = (route: string): void => {
        // In a real app, you would use React Router or Next.js router
        window.location.href = route;
    };

    return (
        <div className="min-h-screen" style={{
            background: `linear-gradient(to bottom right, ${solarTheme.primary[50]}, white, ${solarTheme.secondary[50]})`
        }}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">

                {/* Header Section */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                        Solar Energy
                        <span className="block text-transparent bg-clip-text mt-1" style={{
                            backgroundImage: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.secondary[500]}, ${solarTheme.primary[500]})`
                        }}>
                            Resources
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto px-2">
                        Access expert tools and guidance to maximize your solar energy investment and maintain optimal system performance.
                    </p>
                </div>

                {/* Resource Cards */}
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
                    {resourceCards.map((card) => {
                        const cardColors = card.color === 'primary' ? solarTheme.primary : solarTheme.secondary;

                        return (
                            <div
                                key={card.id}
                                onClick={() => handleCardClick(card.route)}
                                className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl border-2 overflow-hidden transform transition-all duration-300 hover:scale-[1.02]"
                                style={{ borderColor: cardColors[200] }}
                            >
                                {/* Card Header */}
                                <div className="relative p-6 sm:p-8" style={{
                                    background: `linear-gradient(135deg, ${cardColors[50]}, ${cardColors[100]})`
                                }}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                                            style={{ backgroundColor: cardColors[500] }}>
                                            <div className="text-white">
                                                {card.icon}
                                            </div>
                                        </div>

                                        <ArrowRight
                                            className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform duration-300"
                                            style={{ color: cardColors[600] }}
                                        />
                                    </div>

                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                                        {card.title}
                                    </h3>

                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>

                                {/* Card Benefits */}
                                <div className="p-6 sm:p-8">
                                    <div className="flex items-center mb-4">
                                        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2" style={{ color: cardColors[600] }} />
                                        <span className="font-semibold text-gray-900 text-sm sm:text-base">Key Benefits:</span>
                                    </div>

                                    <ul className="space-y-2 sm:space-y-3">
                                        {card.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                                                    style={{ backgroundColor: cardColors[500] }}></div>
                                                <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                                    {benefit}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <div className="mt-6">
                                        <button
                                            className="w-full py-3 cursor-pointer px-6 rounded-lg font-semibold text-white transition-all duration-300 transform group-hover:shadow-lg min-h-[48px] text-sm sm:text-base"
                                            style={{
                                                background: `linear-gradient(135deg, ${cardColors[500]}, ${cardColors[600]})`
                                            }}
                                        >
                                            Access {card.title}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Additional Info Section */}
                <div className="mt-12 sm:mt-16 text-center">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto"
                        style={{ border: '1px solid', borderColor: solarTheme.primary[200] }}>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                            Why Use Our Solar Resources?
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                            Our expert-designed tools and guides are backed by years of industry experience and help thousands of solar owners optimize their systems for maximum efficiency and savings.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div className="text-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                                    style={{ backgroundColor: solarTheme.primary[100] }}>
                                    <span className="text-lg sm:text-xl font-bold" style={{ color: solarTheme.primary[600] }}>5+</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">Years Experience</p>
                            </div>

                            <div className="text-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                                    style={{ backgroundColor: solarTheme.secondary[100] }}>
                                    <span className="text-lg sm:text-xl font-bold" style={{ color: solarTheme.secondary[600] }}>10K+</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">Users Helped</p>
                            </div>

                            <div className="text-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                                    style={{ backgroundColor: solarTheme.primary[100] }}>
                                    <span className="text-lg sm:text-xl font-bold" style={{ color: solarTheme.primary[600] }}>24/7</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">Support Available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}