"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    Sun,
    CheckCircle,
    Zap,
    Users,
    Shield,
    AlertCircle
} from 'lucide-react';

// Import theme (assuming these are available in your project)
import { solarTheme } from '@/theme/theme';
import { cn, glassStyles } from '@/lib/theme-utils';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface FormTouched {
    name: boolean;
    email: boolean;
    phone: boolean;
    subject: boolean;
    message: boolean;
}

export default function ContactPageComponent() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState<FormErrors>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [touched, setTouched] = useState<FormTouched>({
        name: false,
        email: false,
        phone: false,
        subject: false,
        message: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Enhanced validation functions
    const validateName = (name: string): string => {
        if (!name.trim()) {
            return 'Full name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters long';
        }
        if (name.trim().length > 50) {
            return 'Name cannot exceed 50 characters';
        }
        if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
            return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }
        return '';
    };

    const validateEmail = (email: string): string => {
        if (!email.trim()) {
            return 'Email address is required';
        }

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (!emailRegex.test(email.trim())) {
            return 'Please enter a valid email address';
        }

        if (email.length > 254) {
            return 'Email address is too long';
        }

        return '';
    };

    const validatePhone = (phone: string): string => {
        if (!phone.trim()) {
            return ''; // Phone is optional
        }

        // Remove all non-digit characters for validation
        const digitsOnly = phone.replace(/\D/g, '');

        if (digitsOnly.length < 10) {
            return 'Phone number must be at least 10 digits';
        }

        if (digitsOnly.length > 15) {
            return 'Phone number cannot exceed 15 digits';
        }

        return '';
    };

    const validateSubject = (subject: string): string => {
        if (!subject.trim()) {
            return 'Please select a subject';
        }
        return '';
    };

    const validateMessage = (message: string): string => {
        if (!message.trim()) {
            return 'Message is required';
        }
        if (message.trim().length < 10) {
            return 'Message must be at least 10 characters long';
        }
        if (message.trim().length > 1000) {
            return 'Message cannot exceed 1000 characters';
        }
        return '';
    };

    // Validate individual field
    const validateField = (field: keyof ContactFormData, value: string): string => {
        switch (field) {
            case 'name':
                return validateName(value);
            case 'email':
                return validateEmail(value);
            case 'phone':
                return validatePhone(value);
            case 'subject':
                return validateSubject(value);
            case 'message':
                return validateMessage(value);
            default:
                return '';
        }
    };

    // Validate entire form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            name: validateName(formData.name),
            email: validateEmail(formData.email),
            phone: validatePhone(formData.phone),
            subject: validateSubject(formData.subject),
            message: validateMessage(formData.message)
        };

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const handleInputChange = (field: keyof ContactFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Real-time validation if field has been touched
        if (touched[field]) {
            const error = validateField(field, value);
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    const handleInputBlur = (field: keyof FormTouched) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        // Validate field when user leaves it
        const value = formData[field as keyof ContactFormData];
        const error = validateField(field as keyof ContactFormData, value);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched to show validation errors
        setTouched({
            name: true,
            email: true,
            phone: true,
            subject: true,
            message: true
        });

        if (!validateForm()) {
            // Scroll to first error field
            const firstErrorField = Object.keys(errors).find(key => errors[key as keyof FormErrors]);
            if (firstErrorField) {
                const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
                element?.focus();
            }
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSubmitted(true);

            // Reset form and touched state
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            setTouched({
                name: false,
                email: false,
                phone: false,
                subject: false,
                message: false
            });

            setErrors({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get input classes based on validation state
    const getInputClasses = (fieldName: keyof FormTouched): string => {
        const baseClasses = "input-solar";
        const hasError = errors[fieldName] && touched[fieldName];
        const hasValue = formData[fieldName].trim().length > 0;
        const isValid = touched[fieldName] && !errors[fieldName] && hasValue;

        if (hasError) {
            return cn(baseClasses, "border-red-500 focus:ring-red-500 focus:border-red-500");
        }

        if (isValid) {
            return cn(baseClasses, "border-green-500 focus:ring-green-500 focus:border-green-500");
        }

        return baseClasses;
    };

    const contactInfo = [
        {
            icon: <Phone className="h-5 w-5" />,
            title: "Phone",
            info: "+1 (555) 123-4567",
            description: "Mon-Fri 8AM-6PM EST",
            href: "tel:+15551234567",
            isClickable: true
        },
        {
            icon: <Mail className="h-5 w-5" />,
            title: "Email",
            info: "info@generalenergy.com",
            description: "24/7 support response",
            href: "mailto:info@generalenergy.com",
            isClickable: true
        },
        {
            icon: <MapPin className="h-5 w-5" />,
            title: "Address",
            info: "123 Solar Drive, Green City, GC 12345",
            description: "Visit our showroom",
            href: "https://maps.google.com/?q=123+Solar+Drive,+Green+City,+GC+12345",
            isClickable: true
        },
        {
            icon: <Clock className="h-5 w-5" />,
            title: "Business Hours",
            info: "Monday - Friday: 8AM-6PM",
            description: "Weekend consultations available",
            href: null,
            isClickable: false
        }
    ];

    const stats = [
        { icon: <Users className="h-5 w-5" />, value: "10K+", label: "Happy Customers" },
        { icon: <Zap className="h-5 w-5" />, value: "50MW", label: "Energy Generated" },
        { icon: <Shield className="h-5 w-5" />, value: "25+", label: "Years Warranty" }
    ];

    return (
        <div className="min-h-screen bg-solar">
            {/* Header Section */}
            <div className="section-padding">
                <div className="container-solar">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg"
                            style={{ background: `linear-gradient(to right, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})` }}>
                            <Sun className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Contact <span className="text-gradient-solar">General Energy Solutions</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            Ready to harness the power of solar energy? Get in touch with our expert team for personalized solar solutions.
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {stats.map((stat, index) => (
                            <div key={index} className={cn("card-solar text-center hover-lift")}>
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-4"
                                    style={{ backgroundColor: solarTheme.primary[100] }}>
                                    <div style={{ color: solarTheme.primary[600] }}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    Get in Touch
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Our solar energy experts are here to help you make the switch to clean, renewable energy.
                                    Contact us for free consultations, quotes, and personalized solar solutions.
                                </p>
                            </div>

                            {/* Contact Cards */}
                            <div className="space-y-4">
                                {contactInfo.map((contact, index) => (
                                    <div key={index}>
                                        {contact.isClickable ? (
                                            <Link 
                                                href={contact.href!}
                                                className={cn("rounded-xl p-6 hover-lift transition-all duration-200 block", glassStyles.light)}
                                                target={contact.title === "Address" ? "_blank" : "_self"}
                                                rel={contact.title === "Address" ? "noopener noreferrer" : undefined}
                                            >
                                                <div className="flex items-start space-x-4">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                                                        style={{ backgroundColor: solarTheme.primary[100] }}>
                                                        <div style={{ color: solarTheme.primary[600] }}>
                                                            {contact.icon}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 mb-1">{contact.title}</h3>
                                                        <p className="text-gray-900 font-medium mb-1 hover:underline">{contact.info}</p>
                                                        <p className="text-sm text-gray-600">{contact.description}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className={cn("rounded-xl p-6 hover-lift transition-all duration-200", glassStyles.light)}>
                                                <div className="flex items-start space-x-4">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                                                        style={{ backgroundColor: solarTheme.primary[100] }}>
                                                        <div style={{ color: solarTheme.primary[600] }}>
                                                            {contact.icon}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 mb-1">{contact.title}</h3>
                                                        <p className="text-gray-900 font-medium mb-1">{contact.info}</p>
                                                        <p className="text-sm text-gray-600">{contact.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Why Choose Us */}
                            <div className={cn("rounded-2xl p-6", glassStyles.medium)}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose General Energy Solutions?</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                        <span className="text-sm text-gray-700">Free consultation and site assessment</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                        <span className="text-sm text-gray-700">25+ year warranty on all solar panels</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                        <span className="text-sm text-gray-700">Professional installation by certified technicians</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: solarTheme.primary[600] }} />
                                        <span className="text-sm text-gray-700">Financing options available</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="card-solar">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                            {/* Success Message */}
                            {isSubmitted && (
                                <div className="mb-6 p-4 rounded-lg animate-fade-in"
                                    style={{ backgroundColor: solarTheme.success[50] }}>
                                    <div className="flex items-start">
                                        <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                                        <div>
                                            <p className="text-sm font-medium" style={{ color: solarTheme.success[600] }}>
                                                Message sent successfully!
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                We&rsquo;ll get back to you within 24 hours.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        onBlur={() => handleInputBlur('name')}
                                        className={getInputClasses('name')}
                                        placeholder="Enter your full name"
                                        disabled={isLoading}
                                    />
                                    {errors.name && touched.name && (
                                        <div className="mt-1 flex items-start animate-fade-in">
                                            <p className="text-sm" style={{ color: solarTheme.error[600] }}>
                                                {errors.name}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        onBlur={() => handleInputBlur('email')}
                                        className={getInputClasses('email')}
                                        placeholder="Enter your email address"
                                        disabled={isLoading}
                                    />
                                    {errors.email && touched.email && (
                                        <div className="mt-1 flex items-start animate-fade-in">
                                            <p className="text-sm" style={{ color: solarTheme.error[600] }}>
                                                {errors.email}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        onBlur={() => handleInputBlur('phone')}
                                        className={getInputClasses('phone')}
                                        placeholder="Enter your phone number"
                                        disabled={isLoading}
                                    />
                                    {errors.phone && touched.phone && (
                                        <div className="mt-1 flex items-start animate-fade-in">
                                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                                            <p className="text-sm" style={{ color: solarTheme.error[600] }}>
                                                {errors.phone}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Subject Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={(e) => handleInputChange('subject', e.target.value)}
                                        onBlur={() => handleInputBlur('subject')}
                                        className={getInputClasses('subject')}
                                        disabled={isLoading}
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general-inquiry">General Inquiry</option>
                                        <option value="solar-installation">Solar Installation</option>
                                        <option value="energy-storage">Energy Storage</option>
                                        <option value="maintenance">Maintenance & Support</option>
                                        <option value="financing">Financing Options</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.subject && touched.subject && (
                                        <div className="mt-1 flex items-start animate-fade-in">
                                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                                            <p className="text-sm" style={{ color: solarTheme.error[600] }}>
                                                {errors.subject}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message * ({formData.message.length}/1000)
                                    </label>
                                    <textarea
                                        rows={4}
                                        name="message"
                                        value={formData.message}
                                        onChange={(e) => handleInputChange('message', e.target.value)}
                                        onBlur={() => handleInputBlur('message')}
                                        className={cn(getInputClasses('message'), "resize-none")}
                                        placeholder="Tell us about your solar energy needs..."
                                        disabled={isLoading}
                                        maxLength={1000}
                                    />
                                    {errors.message && touched.message && (
                                        <div className="mt-1 flex items-start animate-fade-in">
                                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                                            <p className="text-sm" style={{ color: solarTheme.error[600] }}>
                                                {errors.message}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Form Validation Summary */}
                                {Object.values(touched).some(t => t) && Object.values(errors).some(e => e) && (
                                    <div className="p-4 rounded-lg animate-fade-in"
                                        style={{ backgroundColor: solarTheme.error[50] }}>
                                        <div className="flex items-start">
                                            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: solarTheme.error[600] }}>
                                                    Please fix the following errors:
                                                </p>
                                                <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                                                    {Object.entries(errors).map(([field, error]) => (
                                                        error && touched[field as keyof FormTouched] && (
                                                            <li key={field}>{error}</li>
                                                        )
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || (Object.values(touched).some(t => t) && Object.values(errors).some(e => e))}
                                    className="btn-solar w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="h-5 w-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Form Note */}
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">
                                    By submitting this form, you agree to our terms of service and privacy policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}