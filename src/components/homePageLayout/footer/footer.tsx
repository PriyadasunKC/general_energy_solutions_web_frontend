"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Sun,
    Phone,
    Mail,
    MapPin,
    Clock,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    UserPlus,
    LogIn,
    Shield,
    Award,
    Headphones,
    Zap,
    Leaf,
    Battery,
    Home,
    Calculator,
    Star,
    TrendingUp
} from 'lucide-react';

// Import your theme
import { solarTheme } from '@/theme/theme';
import { cn, glassStyles, gradients, colorCombinations, animations, textSizes, spacing } from '@/lib/theme-utils';

// Types
interface FooterLink {
    name: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

interface SocialLink {
    name: string;
    href: string;
    icon: React.ReactNode;
}

const Footer: React.FC = () => {
    const [currentYear, setCurrentYear] = useState<number>(2024);

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    const footerSections: FooterSection[] = [
        {
            title: 'Solar Solutions',
            links: [
                { name: 'Residential Solar', href: '/residential' },
                { name: 'Commercial Solar', href: '/commercial' },
                { name: 'Industrial Systems', href: '/industrial' },
                { name: 'Solar Installation', href: '/installation' },
                { name: 'Maintenance', href: '/maintenance' },
            ]
        },
        {
            title: 'Products',
            links: [
                { name: 'Solar Panels', href: '/solar-panels' },
                { name: 'Energy Storage', href: '/energy-storage' },
                { name: 'Inverters', href: '/inverters' },
                { name: 'Monitoring Systems', href: '/monitoring' },
                { name: 'Accessories', href: '/accessories' },
            ]
        },
        {
            title: 'Support',
            links: [
                { name: 'Contact Us', href: '/contact' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Installation Guide', href: '/installation-guide' },
                { name: 'Warranty', href: '/warranty' },
                { name: 'Technical Support', href: '/support' },
            ]
        }
    ];

    const socialLinks: SocialLink[] = [
        { name: 'Facebook', href: '#', icon: <Facebook className="h-5 w-5" /> },
        { name: 'Twitter', href: '#', icon: <Twitter className="h-5 w-5" /> },
        { name: 'Instagram', href: '#', icon: <Instagram className="h-5 w-5" /> },
        { name: 'LinkedIn', href: '#', icon: <Linkedin className="h-5 w-5" /> },
    ];

    return (
        <footer className={cn("border-t border-gray-200", glassStyles.heavy)}>
            {/* Main Footer Content */}
            <div className="bg-solar">
                <div className={cn("max-w-7xl mx-auto py-12", spacing.container)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {/* Company Info */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center mb-4">
                                <div className={cn("p-2 rounded-lg shadow-md", gradients.primary)}>
                                    <Sun className="h-8 w-8 text-white" />
                                </div>
                                <div className="ml-3">
                                    <h2 className={cn("font-bold text-gray-900", textSizes.subtitle)}>
                                        General<span className="text-gradient-solar">Energy</span>
                                    </h2>
                                    <p className="text-sm text-gray-500">Clean Energy Solutions</p>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6 max-w-md">
                                Leading provider of premium solar panels and renewable energy solutions.
                                Empowering homes and businesses with clean, sustainable energy for over a decade.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <a 
                                    href="tel:+15551234567" 
                                    className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
                                >
                                    <Phone
                                        className="h-5 w-5 mr-3"
                                        style={{ color: solarTheme.primary[600] }}
                                    />
                                    <span>+1 (555) 123-4567</span>
                                </a>
                                <a 
                                    href="mailto:info@generalenergysolutions.com" 
                                    className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
                                >
                                    <Mail
                                        className="h-5 w-5 mr-3"
                                        style={{ color: solarTheme.primary[600] }}
                                    />
                                    <span>info@generalenergysolutions.com</span>
                                </a>
                                <a 
                                    href="https://maps.google.com/?q=456+Green+Energy+Blvd,+Solar+City,+CA+90210" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
                                >
                                    <MapPin
                                        className="h-5 w-5 mr-3"
                                        style={{ color: solarTheme.primary[600] }}
                                    />
                                    <span>456 Green Energy Blvd, Solar City, CA 90210</span>
                                </a>
                                <div className="flex items-center text-gray-600">
                                    <Clock
                                        className="h-5 w-5 mr-3"
                                        style={{ color: solarTheme.primary[600] }}
                                    />
                                    <span>Mon-Fri 8AM-6PM, Sat 9AM-4PM</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Links */}
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="text-gray-900 font-semibold mb-4">{section.title}</h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    "text-gray-600 transition-colors duration-200",
                                                    "hover:text-primary-600"
                                                )}
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Features Section */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex items-center">
                                <div
                                    className="p-3 rounded-lg"
                                    style={{ backgroundColor: solarTheme.primary[100] }}
                                >
                                    <Shield
                                        className="h-6 w-6"
                                        style={{ color: solarTheme.primary[600] }}
                                    />
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-semibold text-gray-900">25+ Year Warranty</h4>
                                    <p className="text-sm text-gray-600">Premium Protection</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div
                                    className="p-3 rounded-lg"
                                    style={{ backgroundColor: solarTheme.secondary[100] }}
                                >
                                    <TrendingUp
                                        className="h-6 w-6"
                                        style={{ color: solarTheme.secondary[600] }}
                                    />
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-semibold text-gray-900">High Efficiency</h4>
                                    <p className="text-sm text-gray-600">Up to 22% Efficiency</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div
                                    className="p-3 rounded-lg"
                                    style={{ backgroundColor: solarTheme.primary[100] }}
                                >
                                    <Headphones
                                        className="h-6 w-6"
                                        style={{ color: solarTheme.primary[600] }}
                                    />
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-semibold text-gray-900">Expert Support</h4>
                                    <p className="text-sm text-gray-600">Professional Service</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div
                                    className="p-3 rounded-lg"
                                    style={{ backgroundColor: solarTheme.accent[100] }}
                                >
                                    <Leaf
                                        className="h-6 w-6"
                                        style={{ color: solarTheme.accent[600] }}
                                    />
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-semibold text-gray-900">Eco-Friendly</h4>
                                    <p className="text-sm text-gray-600">Zero Emissions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Energy Stats Section */}
                    <div className="mt-8">
                        <div className={cn("rounded-2xl p-6", glassStyles.medium)}>
                            <h3 className="text-center text-lg font-semibold text-gray-900 mb-6">Our Environmental Impact</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                                <div>
                                    <div
                                        className="text-2xl font-bold"
                                        style={{ color: solarTheme.primary[600] }}
                                    >
                                        50MW+
                                    </div>
                                    <div className="text-sm text-gray-600">Solar Installed</div>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl font-bold"
                                        style={{ color: solarTheme.secondary[600] }}
                                    >
                                        15K+
                                    </div>
                                    <div className="text-sm text-gray-600">Happy Customers</div>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl font-bold"
                                        style={{ color: solarTheme.primary[600] }}
                                    >
                                        75M lbs
                                    </div>
                                    <div className="text-sm text-gray-600">CO₂ Prevented</div>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl font-bold"
                                        style={{ color: solarTheme.accent[600] }}
                                    >
                                        4.9★
                                    </div>
                                    <div className="text-sm text-gray-600">Customer Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/resources/solar-saving-calulator"
                            className="btn-solar inline-flex items-center px-6 py-3 text-sm font-medium"
                        >
                            <Calculator className="h-4 w-4 mr-2" />
                            Solar Calculator
                        </Link>
                        <Link
                            href="/main-products"
                            className="btn-solar-outline inline-flex items-center px-6 py-3 text-sm font-medium"
                        >
                            <Zap className="h-4 w-4 mr-2" />
                            Get Free Quote
                        </Link>
                        <Link
                            href="/products"
                            className={cn(
                                "inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                                glassStyles.light
                            )}
                            style={{ color: solarTheme.primary[600] }}
                        >
                            <Battery className="h-4 w-4 mr-2" />
                            View Products
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-gray-900">
                <div className={cn("max-w-7xl mx-auto py-6", spacing.container)}>
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            © {currentYear} General Energy Solutions. All rights reserved. |
                            <Link href="/privacy" className="hover:text-white ml-1">Privacy Policy</Link> |
                            <Link href="/terms" className="hover:text-white ml-1">Terms of Service</Link>
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    className={cn(
                                        "text-gray-400 hover:text-white transition-colors duration-200",
                                        animations.scale
                                    )}
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Certifications & Additional Info */}
                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-500 text-xs mb-2 md:mb-0">
                                Licensed Solar Installer | NABCEP Certified | Fully Insured | California Solar Initiative Partner
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                    <Star
                                        className="h-3 w-3 mr-1"
                                        style={{ color: solarTheme.secondary[500] }}
                                    />
                                    <span>Energy Star Partner</span>
                                </div>
                                <div className="flex items-center">
                                    <Leaf
                                        className="h-3 w-3 mr-1"
                                        style={{ color: solarTheme.primary[500] }}
                                    />
                                    <span>Green Business Certified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;