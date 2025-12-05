/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/mediaService.ts
import { apiClient } from './apiClient';
import {
    MediaFile,
    CreateMediaRequest,
    CreateBulkMediaRequest,
    CreateMediaResponse,
    CreateBulkMediaResponse,
    CloudinaryUploadResponse,
    UploadConfig,
    FileValidationResult,
    ImageOptimizationOptions,
    MEDIA_ENDPOINTS,
    DEFAULT_UPLOAD_CONFIG,
    FILE_TYPE_MAPPINGS,
    UPLOAD_ERROR_MESSAGES,
} from '../types/mediaTypes';

/**
 * Media Service
 * Handles all media-related operations including Cloudinary uploads and API calls
 */
export class MediaService {
    private static cloudinaryConfig = {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
    };

    /**
     * Upload file to Cloudinary
     */
    static async uploadToCloudinary(
        file: File,
        config: Partial<UploadConfig> = {},
        onProgress?: (progress: number) => void
    ): Promise<CloudinaryUploadResponse> {
        try {
            if (!this.cloudinaryConfig.cloudName || !this.cloudinaryConfig.uploadPreset) {
                throw new Error('Cloudinary configuration is missing');
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);

            // Add optional configurations
            if (config.folder) {
                formData.append('folder', config.folder);
            }

            if (config.transformation) {
                formData.append('transformation', JSON.stringify(config.transformation));
            }

            // Generate unique public_id if needed
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const publicId = `${config.folder || 'general'}/${timestamp}_${randomString}`;
            formData.append('public_id', publicId);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`Cloudinary upload failed: ${response.statusText}`);
            }

            const result: CloudinaryUploadResponse = await response.json();
            return result;
        } catch (error) {
            console.error('Cloudinary upload failed:', error);
            throw error;
        }
    }

    /**
     * Upload multiple files to Cloudinary
     */
    static async uploadMultipleToCloudinary(
        files: File[],
        config: Partial<UploadConfig> = {},
        onProgress?: (fileIndex: number, progress: number) => void
    ): Promise<CloudinaryUploadResponse[]> {
        const uploadPromises = files.map((file, index) =>
            this.uploadToCloudinary(
                file,
                config,
                onProgress ? (progress) => onProgress(index, progress) : undefined
            )
        );

        try {
            const results = await Promise.all(uploadPromises);
            return results;
        } catch (error) {
            console.error('Multiple file upload failed:', error);
            throw error;
        }
    }

    /**
     * Create media record in database
     */
    static async createMediaRecord(mediaData: CreateMediaRequest): Promise<CreateMediaResponse> {
        try {
            const response = await apiClient.post<CreateMediaResponse>(
                MEDIA_ENDPOINTS.CREATE_MEDIA,
                mediaData
            );
            return response;
        } catch (error) {
            console.error('Failed to create media record:', error);
            throw error;
        }
    }

    /**
     * Create multiple media records in database
     */
    static async createBulkMediaRecords(mediaData: CreateBulkMediaRequest): Promise<CreateBulkMediaResponse> {
        try {
            const response = await apiClient.post<CreateBulkMediaResponse>(
                MEDIA_ENDPOINTS.CREATE_BULK_MEDIA,
                mediaData
            );
            return response;
        } catch (error) {
            console.error('Failed to create bulk media records:', error);
            throw error;
        }
    }

    /**
     * Complete upload process: Upload to Cloudinary and create database record
     */
    static async uploadFile(
        file: File,
        config: Partial<UploadConfig> = {}
    ): Promise<MediaFile> {
        try {
            // Validate file first
            const validation = this.validateFile(file, { ...DEFAULT_UPLOAD_CONFIG, ...config });
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Upload to Cloudinary
            const cloudinaryResult = await this.uploadToCloudinary(file, config);

            // Create database record
            const mediaData: CreateMediaRequest = {
                asset_id: cloudinaryResult.asset_id,
                public_id: cloudinaryResult.public_id,
                url: cloudinaryResult.secure_url || cloudinaryResult.url,
                bytes: cloudinaryResult.bytes,
                width: cloudinaryResult.width,
                height: cloudinaryResult.height,
                resource_type: cloudinaryResult.resource_type as 'image' | 'video' | 'audio' | 'raw',
                format: cloudinaryResult.format,
                file_name: file.name,
            };

            const dbResult = await this.createMediaRecord(mediaData);
            return dbResult.data;
        } catch (error) {
            console.error('File upload failed:', error);
            throw error;
        }
    }

    /**
     * Upload multiple files with progress tracking
     */
    static async uploadFiles(
        files: File[],
        config: Partial<UploadConfig> = {},
        onProgress?: (fileIndex: number, progress: number) => void
    ): Promise<MediaFile[]> {
        try {
            // Validate all files first
            const validations = this.validateFiles(files, { ...DEFAULT_UPLOAD_CONFIG, ...config });
            const invalidFiles = validations.filter(v => !v.isValid);

            if (invalidFiles.length > 0) {
                throw new Error(`Invalid files: ${invalidFiles.map(v => v.errors.join(', ')).join('; ')}`);
            }

            // Upload to Cloudinary
            const cloudinaryResults = await this.uploadMultipleToCloudinary(files, config, onProgress);

            // Create database records
            const mediaData: CreateBulkMediaRequest = cloudinaryResults.map((result, index) => ({
                asset_id: result.asset_id,
                public_id: result.public_id,
                url: result.secure_url || result.url,
                bytes: result.bytes,
                width: result.width,
                height: result.height,
                resource_type: result.resource_type as 'image' | 'video' | 'audio' | 'raw',
                format: result.format,
                file_name: files[index].name,
            }));

            const dbResult = await this.createBulkMediaRecords(mediaData);
            return dbResult.data;
        } catch (error) {
            console.error('Multiple file upload failed:', error);
            throw error;
        }
    }

    /**
     * Validate a single file
     */
    static validateFile(file: File, config: UploadConfig): FileValidationResult {
        const errors: string[] = [];

        // Check file size
        if (file.size > config.maxFileSize) {
            errors.push(`${UPLOAD_ERROR_MESSAGES.FILE_TOO_LARGE} (${this.formatFileSize(config.maxFileSize)})`);
        }

        // Check file format
        const fileExtension = this.getFileExtension(file.name).toLowerCase();
        if (!config.allowedFormats.includes(fileExtension)) {
            errors.push(`${UPLOAD_ERROR_MESSAGES.INVALID_FORMAT}. Allowed: ${config.allowedFormats.join(', ')}`);
        }

        // Check resource type
        const resourceType = this.getResourceType(file);
        if (!config.allowedResourceTypes.includes(resourceType)) {
            errors.push(`Resource type '${resourceType}' is not allowed`);
        }

        return {
            isValid: errors.length === 0,
            errors,
            file,
        };
    }

    /**
     * Validate multiple files
     */
    static validateFiles(files: File[], config: UploadConfig): FileValidationResult[] {
        // Check total file count
        if (files.length > config.maxFiles) {
            const error = `${UPLOAD_ERROR_MESSAGES.TOO_MANY_FILES} (max: ${config.maxFiles})`;
            return files.map(file => ({
                isValid: false,
                errors: [error],
                file,
            }));
        }

        return files.map(file => this.validateFile(file, config));
    }

    /**
     * Get file extension
     */
    static getFileExtension(fileName: string): string {
        return fileName.split('.').pop() || '';
    }

    /**
     * Get resource type based on file extension
     */
    static getResourceType(file: File): 'image' | 'video' | 'audio' | 'raw' {
        const extension = this.getFileExtension(file.name).toLowerCase();

        if (FILE_TYPE_MAPPINGS.image.includes(extension as any)) return 'image';
        if (FILE_TYPE_MAPPINGS.video.includes(extension as any)) return 'video';
        if (FILE_TYPE_MAPPINGS.audio.includes(extension as any)) return 'audio';

        return 'raw';
    }

    /**
     * Get file type for UI purposes
     */
    static getFileType(file: File): 'image' | 'video' | 'audio' | 'document' | 'other' {
        const extension = this.getFileExtension(file.name).toLowerCase();

        if (FILE_TYPE_MAPPINGS.image.includes(extension as any)) return 'image';
        if (FILE_TYPE_MAPPINGS.video.includes(extension as any)) return 'video';
        if (FILE_TYPE_MAPPINGS.audio.includes(extension as any)) return 'audio';
        if (FILE_TYPE_MAPPINGS.document.includes(extension as any)) return 'document';

        return 'other';
    }

    /**
     * Check if file is an image
     */
    static isImageFile(file: File): boolean {
        return this.getFileType(file) === 'image';
    }

    /**
     * Check if file is a video
     */
    static isVideoFile(file: File): boolean {
        return this.getFileType(file) === 'video';
    }

    /**
     * Format file size for display
     */
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Generate unique file name
     */
    static generateUniqueFileName(originalName: string): string {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = this.getFileExtension(originalName);
        const nameWithoutExt = originalName.replace(`.${extension}`, '');

        return `${nameWithoutExt}_${timestamp}_${randomString}.${extension}`;
    }

    /**
     * Generate preview URL for file
     */
    static generatePreviewUrl(file: File): string {
        return URL.createObjectURL(file);
    }

    /**
     * Revoke preview URL
     */
    static revokePreviewUrl(url: string): void {
        URL.revokeObjectURL(url);
    }

    /**
     * Get optimized image URL from Cloudinary
     */
    static getOptimizedImageUrl(url: string, options: ImageOptimizationOptions = {}): string {
        if (!url.includes('cloudinary.com')) {
            return url; // Return original URL if not from Cloudinary
        }

        try {
            const urlParts = url.split('/upload/');
            if (urlParts.length !== 2) return url;

            const transformations: string[] = [];

            if (options.width) transformations.push(`w_${options.width}`);
            if (options.height) transformations.push(`h_${options.height}`);
            if (options.quality) transformations.push(`q_${options.quality}`);
            if (options.format) transformations.push(`f_${options.format}`);
            if (options.crop) transformations.push(`c_${options.crop}`);

            if (transformations.length === 0) return url;

            const transformationString = transformations.join(',');
            return `${urlParts[0]}/upload/${transformationString}/${urlParts[1]}`;
        } catch (error) {
            console.error('Failed to optimize image URL:', error);
            return url;
        }
    }

    /**
     * Get thumbnail URL for media
     */
    static getThumbnailUrl(mediaFile: MediaFile, size: number = 150): string {
        if (mediaFile.resource_type === 'image') {
            return this.getOptimizedImageUrl(mediaFile.url, {
                width: size,
                height: size,
                crop: 'fill',
                quality: 80,
                format: 'auto',
            });
        }

        // For non-images, return a default thumbnail or the original URL
        return mediaFile.url;
    }

    /**
     * Check if Cloudinary is configured
     */
    static isCloudinaryConfigured(): boolean {
        return Boolean(
            this.cloudinaryConfig.cloudName &&
            this.cloudinaryConfig.uploadPreset
        );
    }

    /**
     * Get upload configuration with defaults
     */
    static getUploadConfig(customConfig: Partial<UploadConfig> = {}): UploadConfig {
        return {
            ...DEFAULT_UPLOAD_CONFIG,
            ...customConfig,
        };
    }

    /**
     * Extract metadata from file
     */
    static async extractFileMetadata(file: File): Promise<Record<string, unknown>> {
        const metadata: Record<string, unknown> = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            lastModifiedDate: new Date(file.lastModified),
        };

        // For images, try to extract dimensions
        if (this.isImageFile(file)) {
            try {
                const dimensions = await this.getImageDimensions(file);
                metadata.width = dimensions.width;
                metadata.height = dimensions.height;
            } catch (error) {
                console.warn('Failed to extract image dimensions:', error);
            }
        }

        return metadata;
    }

    /**
     * Get image dimensions
     */
    private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                });
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image'));
            };

            img.src = url;
        });
    }

    /**
     * Convert file to base64
     */
    static fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert file to base64'));
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Compress image file
     */
    static async compressImage(
        file: File,
        options: { quality?: number; maxWidth?: number; maxHeight?: number } = {}
    ): Promise<File> {
        if (!this.isImageFile(file)) {
            return file; // Return original file if not an image
        }

        const { quality = 0.8, maxWidth = 1920, maxHeight = 1080 } = options;

        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Failed to compress image'));
                        }
                    },
                    file.type,
                    quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image for compression'));
            img.src = URL.createObjectURL(file);
        });
    }
}

// Export as default for easier importing
export default MediaService;