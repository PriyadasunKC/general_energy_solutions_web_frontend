/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import Link from 'next/link';
import {
    Sun,
    ArrowLeft,
    Shield,
    Eye,
    Lock,
    Mail,
    Calendar,
    CheckCircle,
    Info,
} from 'lucide-react';

export default function PrivacyPageComponent() {
    const lastUpdated = "January 15, 2024";

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #fffbeb 100%)' }}>
            {/* Mobile Header */}
            <div className="lg:hidden">
                <div className="px-4 py-4 border-b bg-white/80 backdrop-blur-md border border-white/30">
                    <div className="flex items-center">
                        <button className="mr-3 p-2 hover:scale-105 transition-transform duration-200">
                            <ArrowLeft className="h-5 w-5 text-green-600" />
                        </button>
                        <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-gradient-to-r from-green-500 to-green-600">
                                <Sun className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Privacy Policy</h1>
                                <p className="text-xs text-gray-600">General Energy Solutions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Desktop Header */}
                <div className="hidden lg:block mb-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 shadow-lg bg-gradient-to-r from-green-500 to-green-600">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Your privacy is important to us at General Energy Solutions.
                        </p>
                        <div className="flex items-center justify-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            Last updated: {lastUpdated}
                        </div>
                    </div>
                </div>

                {/* Mobile Header Info */}
                <div className="lg:hidden mb-6">
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-4">
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Privacy Policy</h2>
                            <div className="flex items-center justify-center text-xs text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                Updated: {lastUpdated}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                    {/* Information We Collect */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Eye className="h-5 w-5 mr-3 text-green-600" />
                            Information We Collect
                        </h3>
                        <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed">
                                We collect information to provide better solar energy solutions and services to our customers.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Name and contact details</li>
                                        <li>• Billing and shipping addresses</li>
                                        <li>• Payment information</li>
                                        <li>• Energy consumption data</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Usage Information</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Website interaction data</li>
                                        <li>• Device and browser information</li>
                                        <li>• Solar system performance data</li>
                                        <li>• Customer service interactions</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How We Use Information */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Shield className="h-5 w-5 mr-3 text-green-600" />
                            How We Use Your Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                                        Process orders and installations
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                                        Provide customer support
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                                        Monitor system performance
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                                        Send service communications
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                                        Improve our services
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                                        Comply with legal requirements
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Data Protection */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Lock className="h-5 w-5 mr-3 text-green-600" />
                            Data Protection & Your Rights
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-gray-700 font-medium mb-2">We never sell your personal information.</p>
                                <p className="text-sm text-gray-600">
                                    Your data is protected with industry-standard security measures and only shared with trusted partners necessary for service delivery.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Your Rights</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Access your personal data</li>
                                        <li>• Correct inaccurate information</li>
                                        <li>• Request data deletion</li>
                                        <li>• Opt-out of marketing communications</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Security Measures</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• SSL/TLS encryption</li>
                                        <li>• Secure data storage</li>
                                        <li>• Regular security audits</li>
                                        <li>• Access controls and monitoring</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Questions About Your Privacy?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Contact our privacy team if you have questions about this policy or how we handle your information.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="mailto:privacy@generalenergy.com"
                                    className="flex-1 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg p-4 text-center hover:bg-white/90 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                >
                                    <Mail className="h-5 w-5 mx-auto mb-2 text-green-600" />
                                    <div className="text-sm font-medium text-gray-900">Email</div>
                                    <div className="text-sm text-gray-600">privacy@generalenergy.com</div>
                                </Link>

                                <Link
                                    href="tel:+18007652799"
                                    className="flex-1 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg p-4 text-center hover:bg-white/90 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                >
                                    <Shield className="h-5 w-5 mx-auto mb-2 text-green-600" />
                                    <div className="text-sm font-medium text-gray-900">Phone</div>
                                    <div className="text-sm text-gray-600">1-800-SOLAR-99</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                  
                </div>

                {/* Footer */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mt-6">
                    <Link href="/" className="hover:opacity-80 transition-opacity">Home</Link>
                    <Link href="/terms" className="hover:opacity-80 transition-opacity">Terms of Service</Link>
                    <Link href="/contact-us" className="hover:opacity-80 transition-opacity">Contact</Link>
                </div>
                
            </div>
        </div>
    );
}