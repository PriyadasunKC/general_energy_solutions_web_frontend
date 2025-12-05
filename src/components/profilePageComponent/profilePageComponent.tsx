'use client';

import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Edit3,
    Save,
    X,
    AlertCircle,
    CheckCircle,
    Shield,
    Camera,
    Settings,
    Calendar,
    Clock,
} from 'lucide-react';

import { solarTheme } from '@/theme/theme';
import { glassStyles, cn } from '@/lib/theme-utils';
import { useAuth } from '@/hooks/useAuth';
import EmailVerificationModal from '@/components/ui/EmailVerificationModal';
import type { User as UserType } from '@/types/authTypes';
import { AuthService } from '@/services/authService';

interface ProfileFormData {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
}

interface FormErrors {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
}

export default function ProfilePage() {
    const {
        user,
        isAuthenticated,
        isInitialized,
        updateUser,
        isLoading,
        error: authError,
        clearError,
        isEmailVerified
    } = useAuth();

    // Simple modal state management instead of using the hook
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState<FormErrors>({
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
    });

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string>('');

    // Initialize form data when user is loaded
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    // Clear success message after delay
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Clear auth error on mount
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            firstName: '',
            lastName: '',
            phone: '',
            address: ''
        };

        // First name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName.trim())) {
            newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
        }

        // Last name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName.trim())) {
            newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        }

        // Phone validation (optional)
        if (formData.phone.trim() && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone.trim())) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleInputChange = (field: keyof ProfileFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear field error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        // Clear auth error
        if (authError) {
            clearError();
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size must be less than 5MB');
            return;
        }

        setIsUploadingImage(true);
        setUploadError('');

        try {
            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            const uploadData = await uploadResponse.json();

            if (!uploadData.success || !uploadData.data?.secure_url) {
                throw new Error('Invalid upload response');
            }

            // Update profile with the new image URL
            await AuthService.updateProfile(user.userId, {
                imgUrl: uploadData.data.secure_url,
            });

            // Update local state
            updateUser({ imgUrl: uploadData.data.secure_url });

            setSuccessMessage('Profile image updated successfully!');
        } catch (error) {
            console.error('Image upload failed:', error);
            setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!validateForm()) {
            return;
        }

        if (!user) return;

        setIsSaving(true);

        try {
            // Update user profile on backend
            const updates: Partial<UserType> = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: formData.phone.trim() || null,
                address: formData.address.trim() || null
            };

            await AuthService.updateProfile(user.userId, updates);

            // Update local state
            updateUser(updates);

            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');

        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        // Reset form data to original user data
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
        setErrors({
            firstName: '',
            lastName: '',
            phone: '',
            address: ''
        });
        setIsEditing(false);
        clearError();
    };

    const handleEmailVerified = () => {
        setSuccessMessage('Email verified successfully! You now have access to all features.');
        setIsVerificationModalOpen(false);
    };

    const openVerificationModal = () => {
        setIsVerificationModalOpen(true);
    };

    const closeVerificationModal = () => {
        setIsVerificationModalOpen(false);
    };

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

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Component for rendering field errors
    const FieldError = ({ error }: { error: string }) => {
        if (!error) return null;

        return (
            <div className="mt-1 flex items-start animate-fade-in">
                <span className="text-sm leading-5" style={{ color: solarTheme.error[600] }}>
                    {error}
                </span>
            </div>
        );
    };

    // Show loading while initializing
    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-solar flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-solar flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ color: solarTheme.error[500] }} />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600">Please sign in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-solar py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 rounded-lg animate-fade-in"
                        style={{ backgroundColor: solarTheme.success[50], borderColor: solarTheme.success[200], border: '1px solid' }}>
                        <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: solarTheme.success[600] }} />
                            <p className="text-sm" style={{ color: solarTheme.success[600] }}>{successMessage}</p>
                        </div>
                    </div>
                )}

                {/* Auth Error Message */}
                {authError && (
                    <div className="mb-6 p-4 rounded-lg animate-fade-in"
                        style={{ backgroundColor: solarTheme.error[50], borderColor: solarTheme.error[200], border: '1px solid' }}>
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: solarTheme.error[600] }} />
                            <span className="text-sm" style={{ color: solarTheme.error[600] }}>{authError}</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="card-solar">
                            {/* Profile Photo */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    {user.imgUrl ? (
                                        <div
                                            className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg mx-auto"
                                            style={{ backgroundColor: solarTheme.neutral[100] }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={user.imgUrl}
                                                alt={`${user.firstName || ''} ${user.lastName || ''}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto"
                                            style={{
                                                backgroundColor: solarTheme.primary[600],
                                                boxShadow: `0 8px 16px ${solarTheme.primary[600]}40`
                                            }}
                                        >
                                            {getUserInitials(user)}
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="profile-image-upload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="profile-image-upload"
                                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
                                        style={{ backgroundColor: solarTheme.secondary[600] }}
                                    >
                                        {isUploadingImage ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        ) : (
                                            <Camera className="h-4 w-4" />
                                        )}
                                    </label>
                                </div>
                                {uploadError && (
                                    <p className="text-xs mt-2" style={{ color: solarTheme.error[600] }}>
                                        {uploadError}
                                    </p>
                                )}
                                <h3 className="text-xl font-semibold text-gray-900 mt-4">
                                    {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                                </h3>
                                <p className="text-gray-600">{user.email}</p>
                            </div>

                            {/* Account Status */}
                            <div className="space-y-4">
                                {/* Email Verification Status */}
                                <div
                                    className="p-4 rounded-lg"
                                    style={{
                                        backgroundColor: user.emailVerified ? solarTheme.success[50] : solarTheme.warning[50],
                                        border: `1px solid ${user.emailVerified ? solarTheme.success[200] : solarTheme.warning[200]}`
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            {user.emailVerified ? (
                                                <CheckCircle className="h-5 w-5" style={{ color: solarTheme.success[600] }} />
                                            ) : (
                                                <AlertCircle className="h-5 w-5" style={{ color: solarTheme.warning[600] }} />
                                            )}
                                            <div>
                                                <p
                                                    className="text-sm font-medium"
                                                    style={{ color: user.emailVerified ? solarTheme.success[800] : solarTheme.warning[800] }}
                                                >
                                                    Email {user.emailVerified ? 'Verified' : 'Not Verified'}
                                                </p>
                                                <p
                                                    className="text-xs"
                                                    style={{ color: user.emailVerified ? solarTheme.success[700] : solarTheme.warning[700] }}
                                                >
                                                    {user.emailVerified ? 'Full access enabled' : 'Limited access'}
                                                </p>
                                            </div>
                                        </div>
                                        {!user.emailVerified && (
                                            <button
                                                onClick={openVerificationModal}
                                                className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                                                style={{
                                                    backgroundColor: solarTheme.warning[100],
                                                    color: solarTheme.warning[800]
                                                }}
                                            >
                                                Verify
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Account Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span>Joined {formatDate(user.createdAt)}</span>
                                    </div>
                                    {user.lastLoginAt && (
                                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            <span>Last login {formatDate(user.lastLoginAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Form */}
                    <div className="lg:col-span-2">
                        <div className="card-solar">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                        style={{
                                            backgroundColor: solarTheme.primary[50],
                                            color: solarTheme.primary[700]
                                        }}
                                    >
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={isSaving}
                                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
                                            style={{
                                                backgroundColor: solarTheme.neutral[100],
                                                color: solarTheme.neutral[700]
                                            }}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
                                            style={{
                                                backgroundColor: solarTheme.primary[600],
                                                color: 'white'
                                            }}
                                        >
                                            {isSaving ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            ) : (
                                                <Save className="h-4 w-4 mr-2" />
                                            )}
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <form className="space-y-6">
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${!isEditing ? 'bg-gray-50' : 'bg-white'
                                                    } placeholder:text-gray-400 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                                                    }`}
                                                placeholder="Enter your first name"
                                            />
                                        </div>
                                        <FieldError error={errors.firstName} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${!isEditing ? 'bg-gray-50' : 'bg-white'
                                                    } placeholder:text-gray-400 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                                                    }`}
                                                placeholder="Enter your last name"
                                            />
                                        </div>
                                        <FieldError error={errors.lastName} />
                                    </div>
                                </div>

                                {/* Email Field (Read-only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                                        />
                                        {!user.emailVerified && (
                                            <button
                                                type="button"
                                                onClick={openVerificationModal}
                                                className="absolute right-3 top-3 px-2 py-1 text-xs font-medium rounded"
                                                style={{
                                                    backgroundColor: solarTheme.warning[100],
                                                    color: solarTheme.warning[800]
                                                }}
                                            >
                                                Verify
                                            </button>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Email address cannot be changed. Contact support if needed.
                                    </p>
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                        <span className="text-gray-500 font-normal ml-1">(optional)</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${!isEditing ? 'bg-gray-50' : 'bg-white'
                                                } placeholder:text-gray-400 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                                                }`}
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <FieldError error={errors.phone} />
                                </div>

                                {/* Address Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                        <span className="text-gray-500 font-normal ml-1">(optional)</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            disabled={!isEditing}
                                            rows={3}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors resize-none ${!isEditing ? 'bg-gray-50' : 'bg-white'
                                                } placeholder:text-gray-400 ${errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                                                }`}
                                            placeholder="Enter your address"
                                        />
                                    </div>
                                    <FieldError error={errors.address} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Verification Modal - FIXED with showOTPInput prop */}
            <EmailVerificationModal
                isOpen={isVerificationModalOpen}
                onClose={closeVerificationModal}
                onVerified={handleEmailVerified}
                title="Verify Your Email Address"
                message="Complete your account setup by verifying your email"
                showOTPInput={true}
            />
        </div>
    );
}