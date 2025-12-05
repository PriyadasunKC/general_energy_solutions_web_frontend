'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Menu,
    X,
    Sun,
    Phone,
    Mail,
    MapPin,
    User,
    LogOut,
    ChevronDown,
    ShoppingCart,
    ChevronUp,
    Calculator,
    // Settings,
    AlertCircle,
    CheckCircle,
    Shield
} from 'lucide-react';

// Import your theme utilities and hooks
import { solarTheme } from '@/theme/theme';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/userHook';
import EmailVerificationModal from '@/components/ui/EmailVerificationModal';
import type { User as UserType } from '@/types/authTypes';

// Types
interface NavItem {
    name: string;
    href: string;
    isActive?: boolean;
}

interface UserMenuProps {
    user: UserType;
    onLogout: () => void;
    isMobile?: boolean;
}

interface CartProps {
    itemCount: number;
    onClick: () => void;
    isMobile?: boolean;
}

interface EmailVerificationBannerProps {
    user: UserType;
    onResendOTP: () => void;
    onDismiss: () => void;
    isResending: boolean;
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
    user,
    onResendOTP,
    onDismiss,
    isResending
}) => {
    return (
        <div
            className="px-4 py-3 text-sm font-medium text-center relative"
            style={{
                background: `linear-gradient(135deg, ${solarTheme.warning[100]} 0%, ${solarTheme.warning[50]} 100%)`,
                borderBottom: `1px solid ${solarTheme.warning[200]}`
            }}
        >
            <div className="flex items-center justify-center space-x-3 max-w-7xl mx-auto">
                <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: solarTheme.warning[600] }} />
                <div className="flex-1 min-w-0">
                    <span style={{ color: solarTheme.warning[800] }}>
                        Please verify your email address ({user.email}) to access all features.
                    </span>
                    <button
                        onClick={onResendOTP}
                        disabled={isResending}
                        className="ml-2 font-semibold underline hover:no-underline disabled:opacity-50 focus:outline-none"
                        style={{ color: solarTheme.warning[700] }}
                        onFocus={(e) => {
                            e.currentTarget.style.outline = `2px solid ${solarTheme.warning[500]}`;
                            e.currentTarget.style.outlineOffset = '2px';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                        }}
                    >
                        {isResending ? 'Opening...' : 'Resend verification'}
                    </button>
                </div>
                <button
                    onClick={onDismiss}
                    className="flex-shrink-0 p-1 rounded-full hover:opacity-70 transition-opacity focus:outline-none"
                    style={{ color: solarTheme.warning[600] }}
                    onFocus={(e) => {
                        e.currentTarget.style.outline = `2px solid ${solarTheme.warning[500]}`;
                        e.currentTarget.style.outlineOffset = '2px';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.outline = 'none';
                    }}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

const Cart: React.FC<CartProps> = ({ itemCount, onClick, isMobile = false }) => {
    if (isMobile) {
        return (
            <div className="w-full">
                <button
                    onClick={onClick}
                    className="relative w-full p-4 rounded-2xl transition-all duration-300 border backdrop-blur-sm active:scale-95 focus:outline-none"
                    style={{
                        backgroundColor: `${solarTheme.neutral[50]}f0`,
                        borderColor: solarTheme.neutral[200],
                        color: solarTheme.neutral[700],
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                        e.currentTarget.style.outlineOffset = '2px';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.outline = 'none';
                    }}
                >
                    <div className="flex items-center justify-center space-x-3">
                        <ShoppingCart className="h-6 w-6" />
                        <span className="font-medium text-base">Shopping Cart</span>
                        {itemCount > 0 && (
                            <span
                                className="h-6 w-6 rounded-full text-xs font-semibold text-white flex items-center justify-center shadow-md"
                                style={{
                                    backgroundColor: solarTheme.error[500],
                                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                                }}
                            >
                                {itemCount > 99 ? '99+' : itemCount}
                            </span>
                        )}
                    </div>
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={onClick}
            className="relative p-3 rounded-xl transition-all duration-300 focus:outline-none"
            style={{
                backgroundColor: solarTheme.neutral[50],
                color: solarTheme.neutral[700],
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = solarTheme.neutral[100];
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = solarTheme.neutral[50];
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}
            onFocus={(e) => {
                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
            }}
        >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
                <span
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-semibold text-white flex items-center justify-center shadow-md"
                    style={{
                        backgroundColor: solarTheme.error[500],
                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                    }}
                >
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </button>
    );
};

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, isMobile = false }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('right');
    const [dropdownWidth, setDropdownWidth] = useState<string>('280px');
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    // Calculate dropdown position and size based on viewport
    useEffect(() => {
        if (!isOpen || !buttonRef.current) return;

        const updatePosition = () => {
            const buttonRect = buttonRef.current?.getBoundingClientRect();
            if (!buttonRect) return;

            const viewportWidth = window.innerWidth;
            const rightSpace = viewportWidth - buttonRect.right;
            const leftSpace = buttonRect.left;

            // Determine dropdown width based on screen size
            let width = '280px';
            if (viewportWidth < 1024) { // lg breakpoint
                width = Math.min(320, viewportWidth - 32) + 'px'; // 16px padding on each side
            } else if (viewportWidth < 1280) { // xl breakpoint
                width = '300px';
            } else {
                width = '320px';
            }

            // Determine position based on available space
            const dropdownWidth = parseInt(width);
            if (rightSpace >= dropdownWidth) {
                setDropdownPosition('right');
            } else if (leftSpace >= dropdownWidth) {
                setDropdownPosition('left');
            } else {
                // Not enough space on either side, center it
                setDropdownPosition('right');
                width = Math.min(dropdownWidth, viewportWidth - 32) + 'px';
            }

            setDropdownWidth(width);
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [isOpen]);

    const getUserInitials = (user: UserType): string => {
        if (user.firstName && user.lastName) {
            return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
        }
        if (user.firstName) {
            return user.firstName.charAt(0).toUpperCase();
        }
        if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    const getUserDisplayName = (user: UserType): string => {
        if (user.firstName) {
            return user.firstName;
        }
        return user.email.split('@')[0];
    };

    const getUserFullName = (user: UserType): string => {
        return `${user.firstName || ''} ${user.lastName || ''}`.trim() || getUserDisplayName(user);
    };

    const handleLogout = () => {
        setIsOpen(false);
        onLogout();
    };

    const handleToggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Mobile version
    if (isMobile) {
        return (
            <div className="w-full" ref={menuRef}>
                <button
                    ref={buttonRef}
                    onClick={handleToggleMenu}
                    className="w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border backdrop-blur-sm active:scale-95 focus:outline-none"
                    style={{
                        backgroundColor: `${solarTheme.neutral[50]}f0`,
                        borderColor: solarTheme.neutral[200],
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onFocus={(e) => {
                        e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                        e.currentTarget.style.outlineOffset = '2px';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.outline = 'none';
                    }}
                >
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                style={{
                                    backgroundColor: solarTheme.primary[600],
                                    boxShadow: `0 4px 8px ${solarTheme.primary[600]}40`
                                }}
                            >
                                {getUserInitials(user)}
                            </div>
                            {!user.emailVerified && (
                                <div
                                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
                                    style={{ backgroundColor: solarTheme.warning[500] }}
                                >
                                    <AlertCircle className="h-2.5 w-2.5 text-white" />
                                </div>
                            )}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                            <p className="text-base font-semibold truncate" style={{ color: solarTheme.neutral[900] }}>
                                {getUserDisplayName(user)}
                            </p>
                            <p className="text-sm truncate" style={{ color: solarTheme.neutral[600] }}>
                                {user.email}
                            </p>
                            {!user.emailVerified && (
                                <p className="text-xs font-medium" style={{ color: solarTheme.warning[600] }}>
                                    Email not verified
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                        {isOpen ? (
                            <ChevronUp className="h-5 w-5 transition-transform duration-300" style={{ color: solarTheme.neutral[500] }} />
                        ) : (
                            <ChevronDown className="h-5 w-5 transition-transform duration-300" style={{ color: solarTheme.neutral[500] }} />
                        )}
                    </div>
                </button>

                {/* Mobile Dropdown */}
                <div className={`
                    mt-3 overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                    <div
                        className="bg-white rounded-2xl border p-2 space-y-1 backdrop-blur-sm"
                        style={{
                            borderColor: solarTheme.neutral[200],
                            backgroundColor: `${solarTheme.neutral[50]}f8`,
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none"
                            style={{
                                color: solarTheme.neutral[700]
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.outline = 'none';
                            }}
                        >
                            <User className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: solarTheme.neutral[500] }} />
                            <span className="font-medium">My Profile</span>
                        </Link>

                        <Link
                            href="/orders"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none"
                            style={{
                                color: solarTheme.neutral[700]
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.outline = 'none';
                            }}
                        >
                            <ShoppingCart className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: solarTheme.neutral[500] }} />
                            <span className="font-medium">My Orders</span>
                        </Link>

                        {/* <Link
                            href="/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none"
                            style={{
                                color: solarTheme.neutral[700]
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.outline = 'none';
                            }}
                        >
                            <Settings className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: solarTheme.neutral[500] }} />
                            <span className="font-medium">Settings</span>
                        </Link> */}

                        {!user.emailVerified && (
                            <div
                                className="mx-2 my-2 p-3 rounded-xl"
                                style={{ backgroundColor: solarTheme.warning[50], border: `1px solid ${solarTheme.warning[200]}` }}
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: solarTheme.warning[600] }} />
                                    <span className="text-xs font-medium" style={{ color: solarTheme.warning[800] }}>
                                        Email not verified
                                    </span>
                                </div>
                                <p className="text-xs mb-2" style={{ color: solarTheme.warning[700] }}>
                                    Verify your email to access all features
                                </p>
                                <Link
                                    href="/verify-email"
                                    className="text-xs font-semibold underline hover:no-underline focus:outline-none"
                                    style={{ color: solarTheme.warning[700] }}
                                    onClick={() => setIsOpen(false)}
                                    onFocus={(e) => {
                                        e.currentTarget.style.outline = `2px solid ${solarTheme.warning[500]}`;
                                        e.currentTarget.style.outlineOffset = '2px';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.outline = 'none';
                                    }}
                                >
                                    Verify Now
                                </Link>
                            </div>
                        )}

                        <div className="border-t pt-1 mt-2" style={{ borderColor: solarTheme.neutral[200] }}>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none"
                                style={{
                                    color: solarTheme.error[600]
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.outline = `2px solid ${solarTheme.error[500]}`;
                                    e.currentTarget.style.outlineOffset = '2px';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.outline = 'none';
                                }}
                            >
                                <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop version (rest of the UserMenu component stays the same)
    return (
        <div className="relative" ref={menuRef}>
            <button
                ref={buttonRef}
                onClick={handleToggleMenu}
                className="flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl transition-all duration-300 focus:outline-none"
                style={{
                    backgroundColor: solarTheme.neutral[50],
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = solarTheme.neutral[100];
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = solarTheme.neutral[50];
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                }}
                aria-expanded={isOpen}
                aria-haspopup="true"
                onFocus={(e) => {
                    e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                    e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                }}
            >
                <div className="relative flex-shrink-0">
                    <div
                        className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                        style={{
                            backgroundColor: solarTheme.primary[600],
                            boxShadow: `0 2px 4px ${solarTheme.primary[600]}40`
                        }}
                    >
                        {getUserInitials(user)}
                    </div>
                    {!user.emailVerified && (
                        <div
                            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full border border-white flex items-center justify-center"
                            style={{ backgroundColor: solarTheme.warning[500] }}
                        >
                            <AlertCircle className="h-1.5 w-1.5 lg:h-2 lg:w-2 text-white" />
                        </div>
                    )}
                </div>
                <div className="hidden md:block min-w-0 flex-1">
                    <div className="max-w-24 lg:max-w-32 xl:max-w-40">
                        <span className="text-sm lg:text-sm font-medium truncate block" style={{ color: solarTheme.neutral[700] }}>
                            {getUserDisplayName(user)}
                        </span>
                        {!user.emailVerified && (
                            <p className="text-xs truncate block" style={{ color: solarTheme.warning[600] }}>
                                Not verified
                            </p>
                        )}
                    </div>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} style={{ color: solarTheme.neutral[500] }} />
            </button>

            {/* Desktop Dropdown */}
            {isOpen && (
                <div
                    className="absolute mt-2 overflow-x-hidden bg-white rounded-2xl border py-2 z-50 backdrop-blur-sm"
                    style={{
                        borderColor: solarTheme.neutral[200],
                        backgroundColor: `${solarTheme.neutral[50]}f8`,
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        [dropdownPosition]: '0',
                        width: dropdownWidth,
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}
                >
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: solarTheme.neutral[200] }}>
                        <div className="flex items-center space-x-3">
                            <div className="relative flex-shrink-0">
                                <div
                                    className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                                    style={{
                                        backgroundColor: solarTheme.primary[600],
                                        boxShadow: `0 2px 4px ${solarTheme.primary[600]}40`
                                    }}
                                >
                                    {getUserInitials(user)}
                                </div>
                                {!user.emailVerified && (
                                    <div
                                        className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border border-white"
                                        style={{ backgroundColor: solarTheme.warning[500] }}
                                    />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm lg:text-base font-semibold truncate" style={{ color: solarTheme.neutral[900] }}>
                                    {getUserFullName(user)}
                                </p>
                                <p className="text-xs lg:text-sm truncate" style={{ color: solarTheme.neutral[500] }}>
                                    {user.email}
                                </p>
                                {!user.emailVerified && (
                                    <p className="text-xs font-medium" style={{ color: solarTheme.warning[600] }}>
                                        Email not verified
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Email Verification Warning */}
                    {!user.emailVerified && (
                        <div className="px-4 py-3 border-b" style={{ borderColor: solarTheme.neutral[200] }}>
                            <div
                                className="p-3 rounded-xl"
                                style={{ backgroundColor: solarTheme.warning[50], border: `1px solid ${solarTheme.warning[200]}` }}
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    <Shield className="h-4 w-4 flex-shrink-0" style={{ color: solarTheme.warning[600] }} />
                                    <span className="text-sm font-medium" style={{ color: solarTheme.warning[800] }}>
                                        Verify your email
                                    </span>
                                </div>
                                <p className="text-sm mb-2" style={{ color: solarTheme.warning[700] }}>
                                    Get access to all features by verifying your email address.
                                </p>
                                <Link
                                    href="/verify-email"
                                    className="text-sm font-semibold underline hover:no-underline focus:outline-none rounded"
                                    style={{
                                        color: solarTheme.warning[700]
                                    }}
                                    onClick={() => setIsOpen(false)}
                                    onFocus={(e) => {
                                        e.currentTarget.style.outline = `2px solid ${solarTheme.warning[500]}`;
                                        e.currentTarget.style.outlineOffset = '2px';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.outline = 'none';
                                    }}
                                >
                                    Verify Now →
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Menu Items */}
                    <div className="py-1">
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center w-full px-3 py-2 text-sm transition-all duration-200 rounded-lg mx-2 focus:outline-none"
                            style={{
                                color: solarTheme.neutral[700]
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = solarTheme.primary[50];
                                e.currentTarget.style.color = solarTheme.primary[700];
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = solarTheme.neutral[700];
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.outline = 'none';
                            }}
                        >
                            <User className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: solarTheme.neutral[500] }} />
                            <span>My Profile</span>
                        </Link>

                        <Link
                            href="/orders"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center w-full px-3 py-2 text-sm transition-all duration-200 rounded-lg mx-2 focus:outline-none"
                            style={{
                                color: solarTheme.neutral[700]
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = solarTheme.primary[50];
                                e.currentTarget.style.color = solarTheme.primary[700];
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = solarTheme.neutral[700];
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.outline = 'none';
                            }}
                        >
                            <ShoppingCart className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: solarTheme.neutral[500] }} />
                            <span>My Orders</span>
                        </Link>

                        {/* <Link
                            href="/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center w-full px-3 py-2 text-sm transition-all duration-200 rounded-lg mx-2 focus:outline-none"
                            style={{
                                color: solarTheme.neutral[700]
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = solarTheme.primary[50];
                                e.currentTarget.style.color = solarTheme.primary[700];
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = solarTheme.neutral[700];
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.outline = 'none';
                            }}
                        >
                            <Settings className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: solarTheme.neutral[500] }} />
                            <span>Settings</span>
                        </Link> */}
                    </div>

                    {/* Logout Section */}
                    <div className="border-t py-1" style={{ borderColor: solarTheme.neutral[200] }}>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2 text-sm transition-all duration-200 rounded-lg mx-2 focus:outline-none"
                            style={{
                                color: solarTheme.error[600]
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = solarTheme.error[50];
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.outline = `2px solid ${solarTheme.error[500]}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.outline = 'none';
                            }}
                        >
                            <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const NavBar: React.FC = () => {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [currentPath, setCurrentPath] = useState<string>('/');
    const [mounted, setMounted] = useState<boolean>(false);
    const [showVerificationBanner, setShowVerificationBanner] = useState<boolean>(true);
    const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);

    // Use auth hook
    const {
        user,
        isAuthenticated,
        isInitialized,
        logout,
        isLoading: authLoading
    } = useAuth();

    // Use cart hooks
    const { getCartItemCount, initializeCart } = useCart();

    // Get cart item count
    const cartItemCount = getCartItemCount();

    // Initialize cart when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            initializeCart();
        }
    }, [isAuthenticated, initializeCart]);

    // Use useEffect to ensure component is mounted before using router
    useEffect(() => {
        setMounted(true);
        // Get current path from window.location
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, []);

    const handleNavigation = (href: string) => {
        if (typeof window !== 'undefined') {
            router.push(href);
        }
    };

    const handleSolarCalculatorClick = () => {
        handleNavigation('/resources/solar-saving-calulator');
    };

    const handleLoginClick = () => {
        handleNavigation('/login');
    };

    const handleSignUpClick = () => {
        handleNavigation('/signup');
    };

    const handleCartClick = () => {
        // Navigate to shopping cart page
        handleNavigation('/shopping-cart');
    };

    const navigationItems: NavItem[] = [
        { name: 'Home', href: '/' },
        { name: 'Packages', href: '/main-products' },
        { name: 'Products', href: '/products' },
        { name: 'Resources', href: '/resources' },
        { name: 'Contact', href: '/contact-us' },
        { name: 'About', href: '/about-us' },
    ];

    const handleMobileMenuClose = (): void => {
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = (): void => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleResendVerification = (): void => {
        // Open the verification modal instead of directly sending OTP
        setShowVerificationModal(true);
    };

    const handleVerificationModalClose = (): void => {
        setShowVerificationModal(false);
    };

    const handleEmailVerified = (): void => {
        setShowVerificationModal(false);
        setShowVerificationBanner(false);
        // You might want to show a success message or refresh user data
    };

    // Show loading state while initializing
    if (!mounted || !isInitialized) {
        return (
            <nav className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50" style={{ borderColor: solarTheme.neutral[200] }}>
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                    <div className="flex justify-between items-center h-16 sm:h-18">
                        <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
                        <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Email Verification Banner - Only show for authenticated users with unverified email */}
            {isAuthenticated && user && !user.emailVerified && showVerificationBanner && (
                <EmailVerificationBanner
                    user={user}
                    onResendOTP={handleResendVerification}
                    onDismiss={() => setShowVerificationBanner(false)}
                    isResending={authLoading}
                />
            )}

            {/* Top Bar - Hidden on mobile, visible on desktop */}
            <div
                className="hidden xl:block text-white py-3 backdrop-blur-sm"
                style={{
                    background: `linear-gradient(135deg, ${solarTheme.primary[700]} 0%, ${solarTheme.primary[600]} 100%)`,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center text-sm font-medium">
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>info@generalenergysolutions.com</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>Free Installation Consultation | 25+ Year Warranty</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation - Mobile First Design */}
            <nav className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50" style={{ borderColor: solarTheme.neutral[200] }}>
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                    {/* Mobile Navigation (xs to lg) */}
                    <div className="flex justify-between items-center h-16 sm:h-18 lg:hidden">
                        {/* Mobile Logo */}
                        <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('/')}>
                            <div className="flex-shrink-0 flex items-center">
                                <div
                                    className="p-2.5 rounded-2xl shadow-md"
                                    style={{
                                        background: `linear-gradient(135deg, ${solarTheme.primary[600]} 0%, ${solarTheme.primary[500]} 100%)`,
                                        boxShadow: `0 4px 8px ${solarTheme.primary[600]}40`
                                    }}
                                >
                                    <Sun className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                                </div>
                                <div className="ml-3">
                                    <h1 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: solarTheme.neutral[900] }}>
                                        General<span style={{ color: solarTheme.primary[600] }}>Energy</span>
                                    </h1>
                                    <p className="text-xs font-medium tracking-wide hidden sm:block" style={{ color: solarTheme.neutral[500] }}>
                                        Clean Energy Solutions
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-3 rounded-2xl transition-all duration-300 focus:outline-none active:scale-95"
                            style={{
                                backgroundColor: solarTheme.neutral[50],
                                color: solarTheme.neutral[700],
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                            }}
                            aria-expanded="false"
                            onFocus={(e) => {
                                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.outline = 'none';
                            }}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>

                    {/* Desktop Navigation (lg and up) - PROPERLY RESPONSIVE FOR ALL DESKTOP SIZES */}
                    <div className="hidden lg:flex items-center h-20">
                        <div className="w-full flex items-center justify-between px-4 lg:px-6 xl:px-8 2xl:px-12 max-w-screen-2xl mx-auto">
                            {/* Logo Section - Responsive sizing */}
                            <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => handleNavigation('/')}>
                                <div className="flex items-center">
                                    <div
                                        className="p-2.5 lg:p-3 rounded-2xl shadow-md"
                                        style={{
                                            background: `linear-gradient(135deg, ${solarTheme.primary[600]} 0%, ${solarTheme.primary[500]} 100%)`,
                                            boxShadow: `0 4px 8px ${solarTheme.primary[600]}40`
                                        }}
                                    >
                                        <Sun className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                                    </div>
                                    <div className="ml-3 lg:ml-4">
                                        <h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: solarTheme.neutral[900] }}>
                                            General<span style={{ color: solarTheme.primary[600] }}>Energy</span>
                                        </h1>
                                        <p className="text-xs font-medium tracking-wide" style={{ color: solarTheme.neutral[500] }}>
                                            Clean Energy Solutions
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Center Navigation - Properly spaced for all desktop sizes */}
                            <div className="flex-1 flex justify-center px-4 lg:px-6 xl:px-8">
                                <div className="flex items-center space-x-1 lg:space-x-2 xl:space-x-3 2xl:space-x-4">
                                    {navigationItems.map((item) => (
                                        <button
                                            key={item.name}
                                            onClick={() => handleNavigation(item.href)}
                                            className={`px-2 lg:px-3 xl:px-4 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-300 relative whitespace-nowrap focus:outline-none ${currentPath === item.href ? 'shadow-lg' : ''
                                                }`}
                                            style={{
                                                color: currentPath === item.href ? 'white' : solarTheme.neutral[700],
                                                backgroundColor: currentPath === item.href ? solarTheme.primary[600] : 'transparent',
                                                boxShadow: currentPath === item.href ? `0 4px 8px ${solarTheme.primary[600]}40` : 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (currentPath !== item.href) {
                                                    e.currentTarget.style.backgroundColor = solarTheme.neutral[100];
                                                    e.currentTarget.style.color = solarTheme.primary[700];
                                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (currentPath !== item.href) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = solarTheme.neutral[700];
                                                    e.currentTarget.style.transform = 'translateY(0px)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                                e.currentTarget.style.outlineOffset = '2px';
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.outline = 'none';
                                            }}
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Section - Responsive spacing and sizing */}
                            <div className="flex items-center space-x-2 lg:space-x-3 xl:space-x-4 2xl:space-x-6 flex-shrink-0">
                                {/* Cart */}
                                <Cart itemCount={cartItemCount} onClick={handleCartClick} />

                                {isAuthenticated && user ? (
                                    <UserMenu user={user} onLogout={handleLogout} />
                                ) : (
                                    <div className="flex items-center space-x-2 lg:space-x-3 xl:space-x-4">
                                        <button
                                            onClick={handleLoginClick}
                                            className="px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-300 focus:outline-none"
                                            style={{ color: solarTheme.neutral[700] }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = solarTheme.neutral[100];
                                                e.currentTarget.style.color = solarTheme.primary[700];
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = solarTheme.neutral[700];
                                                e.currentTarget.style.transform = 'translateY(0px)';
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                                e.currentTarget.style.outlineOffset = '2px';
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.outline = 'none';
                                            }}
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={handleSignUpClick}
                                            className="px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-semibold border-2 transition-all duration-300 focus:outline-none"
                                            style={{
                                                borderColor: solarTheme.primary[600],
                                                color: solarTheme.primary[600]
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = solarTheme.primary[50];
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                                e.currentTarget.style.boxShadow = `0 4px 8px ${solarTheme.primary[600]}30`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.transform = 'translateY(0px)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                                e.currentTarget.style.outlineOffset = '2px';
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.outline = 'none';
                                            }}
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={handleSolarCalculatorClick}
                                    className="text-white font-semibold py-2.5 lg:py-3 px-3 lg:px-4 xl:px-6 rounded-xl transition-all duration-300 inline-flex items-center text-xs lg:text-sm shadow-lg whitespace-nowrap focus:outline-none"
                                    style={{
                                        background: `linear-gradient(135deg, ${solarTheme.primary[600]} 0%, ${solarTheme.primary[500]} 100%)`,
                                        boxShadow: `0 4px 8px ${solarTheme.primary[600]}40`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = `linear-gradient(135deg, ${solarTheme.primary[700]} 0%, ${solarTheme.primary[600]} 100%)`;
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = `0 8px 15px ${solarTheme.primary[600]}50`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = `linear-gradient(135deg, ${solarTheme.primary[600]} 0%, ${solarTheme.primary[500]} 100%)`;
                                        e.currentTarget.style.transform = 'translateY(0px)';
                                        e.currentTarget.style.boxShadow = `0 4px 8px ${solarTheme.primary[600]}40`;
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.outline = `2px solid ${solarTheme.primary[300]}`;
                                        e.currentTarget.style.outlineOffset = '2px';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.outline = 'none';
                                    }}
                                >
                                    <Calculator className="h-3 w-3 lg:h-4 lg:w-4 mr-1.5 lg:mr-2" />
                                    <span className="hidden lg:inline xl:hidden">Calc</span>
                                    <span className="hidden xl:inline">Solar Calculator</span>
                                    <span className="lg:hidden">Calc</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu - App-like Design */}
                <div
                    className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        } overflow-hidden bg-white/95 backdrop-blur-md border-t`}
                    style={{ borderColor: solarTheme.neutral[200] }}
                >
                    <div className="px-4 pt-6 pb-8 space-y-6 max-w-md mx-auto">
                        {/* Mobile Contact Info */}
                        <div
                            className="rounded-2xl p-5 border backdrop-blur-sm"
                            style={{
                                background: `linear-gradient(135deg, ${solarTheme.primary[50]} 0%, ${solarTheme.primary[100]} 100%)`,
                                borderColor: solarTheme.primary[200],
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <div className="flex items-center space-x-3 text-sm mb-3" style={{ color: solarTheme.primary[700] }}>
                                <Phone className="h-4 w-4" />
                                <span className="font-semibold">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm" style={{ color: solarTheme.primary[700] }}>
                                <Mail className="h-4 w-4" />
                                <span className="font-semibold">info@generalenergysolutions.com</span>
                            </div>
                        </div>

                        {/* Mobile Cart */}
                        <Cart
                            itemCount={cartItemCount}
                            onClick={() => {
                                handleMobileMenuClose();
                                handleCartClick();
                            }}
                            isMobile={true}
                        />

                        {/* Mobile User Menu */}
                        {isAuthenticated && user && (
                            <UserMenu user={user} onLogout={handleLogout} isMobile={true} />
                        )}

                        {/* Mobile Navigation Items - App-like Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        handleMobileMenuClose();
                                        handleNavigation(item.href);
                                    }}
                                    className={`p-4 rounded-2xl text-base font-semibold transition-all duration-300 active:scale-95 focus:outline-none ${currentPath === item.href ? 'shadow-lg' : ''
                                        }`}
                                    style={{
                                        color: currentPath === item.href ? 'white' : solarTheme.neutral[700],
                                        background: currentPath === item.href
                                            ? `linear-gradient(135deg, ${solarTheme.primary[600]} 0%, ${solarTheme.primary[500]} 100%)`
                                            : solarTheme.neutral[50],
                                        boxShadow: currentPath === item.href
                                            ? `0 4px 8px ${solarTheme.primary[600]}40`
                                            : '0 2px 4px rgba(0, 0, 0, 0.05)',
                                        borderColor: solarTheme.neutral[200]
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                        e.currentTarget.style.outlineOffset = '2px';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.outline = 'none';
                                    }}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Auth Section */}
                        {!isAuthenticated && (
                            <div className="border-t pt-6" style={{ borderColor: solarTheme.neutral[200] }}>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <button
                                        onClick={() => {
                                            handleMobileMenuClose();
                                            handleLoginClick();
                                        }}
                                        className="text-center border-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 active:scale-95 focus:outline-none"
                                        style={{
                                            borderColor: solarTheme.primary[600],
                                            color: solarTheme.primary[600]
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                            e.currentTarget.style.outlineOffset = '2px';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.outline = 'none';
                                        }}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleMobileMenuClose();
                                            handleSignUpClick();
                                        }}
                                        className="text-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 active:scale-95 focus:outline-none"
                                        style={{
                                            backgroundColor: solarTheme.neutral[100],
                                            color: solarTheme.neutral[700]
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.outline = `2px solid ${solarTheme.primary[500]}`;
                                            e.currentTarget.style.outlineOffset = '2px';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.outline = 'none';
                                        }}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Mobile CTA - Full width */}
                        <button
                            onClick={() => {
                                handleMobileMenuClose();
                                handleSolarCalculatorClick();
                            }}
                            className="text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 w-full text-base flex items-center justify-center shadow-lg active:scale-95 focus:outline-none"
                            style={{
                                background: `linear-gradient(135deg, ${solarTheme.primary[600]} 0%, ${solarTheme.primary[500]} 100%)`,
                                boxShadow: `0 4px 8px ${solarTheme.primary[600]}40`
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.outline = `2px solid ${solarTheme.primary[300]}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.outline = 'none';
                            }}
                        >
                            <Calculator className="h-5 w-5 mr-2" />
                            Solar Calculator
                        </button>
                    </div>
                </div>
            </nav>

            {/* Email Verification Modal */}
            <EmailVerificationModal
                isOpen={showVerificationModal}
                onClose={handleVerificationModalClose}
                onVerified={handleEmailVerified}
                title="Verify Your Email Address"
                message="We'll send a 6-digit verification code to your email"
                showOTPInput={true}
            />
        </>
    );
};

export default NavBar;