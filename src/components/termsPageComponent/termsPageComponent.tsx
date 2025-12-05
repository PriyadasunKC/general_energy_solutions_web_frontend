"use client";

import React from 'react';
import Link from 'next/link';
import {
    Sun,
    ArrowLeft,
    Scale,
    Zap,
    Shield,
    CreditCard,
    Calendar,
    Mail,
    Phone,
} from 'lucide-react';

export default function TermsPageComponent() {
    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #fffbeb 100%)' }}>
            {/* Mobile Header */}
            <div className="lg:hidden">
                <div className="px-4 py-4 border-b bg-white/80 backdrop-blur-md border border-white/30">
                    <div className="flex items-center">
                        <button className="mr-3 p-2">
                            <ArrowLeft className="h-5 w-5 text-green-600" />
                        </button>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-gradient-to-r from-green-500 to-green-600">
                                <Sun className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Terms of Service</h1>
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
                            <Scale className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Terms of Service
                        </h1>
                        <p className="text-gray-600 mb-4">
                            These terms govern your use of General Energy Solutions services.
                        </p>
                        <div className="flex items-center justify-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            Last updated: January 15, 2024
                        </div>
                    </div>
                </div>

                {/* Mobile Header Info */}
                <div className="lg:hidden mb-6">
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-4">
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Terms of Service</h2>
                            <div className="flex items-center justify-center text-xs text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                Updated: January 15, 2024
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                    {/* Acceptance */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Scale className="h-5 w-5 mr-3 text-green-600" />
                            Acceptance of Terms
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            By using General Energy Solutions&apos; services, you agree to these terms. If you don&apos;t agree,
                            please don&apos;t use our services.
                        </p>
                    </div>

                    {/* Services */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Zap className="h-5 w-5 mr-3 text-green-600" />
                            Our Services
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We provide solar panel systems, installation, and ongoing support services.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">What We Offer:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Solar panel systems</li>
                                    <li>• Professional installation</li>
                                    <li>• System monitoring</li>
                                    <li>• Maintenance and support</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Service Areas:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Residential properties</li>
                                    <li>• Commercial buildings</li>
                                    <li>• Subject to local regulations</li>
                                    <li>• Permit requirements apply</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <CreditCard className="h-5 w-5 mr-3 text-green-600" />
                            Payment Terms
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Payment schedules are outlined in your service contract. We offer cash, financing, and leasing options.
                        </p>
                        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Typical Payment Schedule:</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>• 10% deposit at contract signing</div>
                                <div>• 80% at installation completion</div>
                                <div>• 10% final payment at system activation</div>
                            </div>
                        </div>
                    </div>

                    {/* Warranties */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Shield className="h-5 w-5 mr-3 text-green-600" />
                            Warranties
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Equipment:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• 25-year solar panel warranty</li>
                                    <li>• 10-25 year inverter warranty</li>
                                    <li>• Manufacturer defect coverage</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Installation:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• 10-year workmanship warranty</li>
                                    <li>• Roof leak protection</li>
                                    <li>• System performance monitoring</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Liability */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Liability & Cancellation
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-1">Cancellation Rights:</h4>
                                <p className="text-sm text-gray-600">
                                    3-day cooling-off period after contract signing with full refund.
                                </p>
                            </div>
                            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-1">Insurance:</h4>
                                <p className="text-sm text-gray-600">
                                    We maintain liability insurance. Customers should notify their homeowner&apos;s insurance about solar installation.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Questions About These Terms?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Contact us for clarification on any terms or conditions.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="mailto:legal@generalenergy.com"
                                    className="flex-1 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg p-4 text-center hover:bg-white/90 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                >
                                    <Mail className="h-5 w-5 mx-auto mb-2 text-green-600" />
                                    <div className="text-sm font-medium text-gray-900">Email</div>
                                    <div className="text-sm text-gray-600">legal@generalenergy.com</div>
                                </Link>

                                <Link
                                    href="tel:+18007652799"
                                    className="flex-1 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg p-4 text-center hover:bg-white/90 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                >
                                    <Phone className="h-5 w-5 mx-auto mb-2 text-green-600" />
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
                    <Link href="/privacy" className="hover:opacity-80 transition-opacity">Privacy Policy</Link>
                    <Link href="/contact-us" className="hover:opacity-80 transition-opacity">Contact</Link>
                </div>

            </div>
        </div>
    );
}