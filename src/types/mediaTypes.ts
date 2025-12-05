/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/mediaTypes.ts

// Media file interfaces
export interface MediaFile {
    media_id?: string;
    asset_id: string;
    public_id: string;
    url: string;
    bytes: number;
    width?: number;
    height?: number;
    resource_type: 'image' | 'video' | 'audio' | 'raw';
    format: string;
    file_name?: string;
    created_at?: string;
    modified_at?: string;
    modified_by?: string;
}

// Upload progress interface
export interface UploadProgress {
    fileId: string;
    fileName: string;
    progress: number;
    status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
    error?: string;
}

// Cloudinary upload response
export interface CloudinaryUploadResponse {
    asset_id: string;
    public_id: string;
    url: string;
    secure_url: string;
    bytes: number;
    width?: number;
    height?: number;
    format: string;
    resource_type: string;
    created_at: string;
    [key: string]: unknown;
}

// API Request interfaces
export interface CreateMediaRequest {
    asset_id: string;
    public_id: string;
    url: string;
    bytes: number;
    width?: number;
    height?: number;
    resource_type: 'image' | 'video' | 'audio' | 'raw';
    format: string;
    file_name?: string;
}

export type CreateBulkMediaRequest = CreateMediaRequest[];

// API Response interfaces
export interface CreateMediaResponse {
    success: boolean;
    message?: string;
    data: MediaFile;
}

export interface CreateBulkMediaResponse {
    success: boolean;
    message?: string;
    data: MediaFile[];
}

// Upload configuration
export interface UploadConfig {
    maxFileSize: number; // in bytes
    allowedFormats: string[];
    allowedResourceTypes: ('image' | 'video' | 'audio' | 'raw')[];
    maxFiles: number;
    folder?: string;
    transformation?: Record<string, unknown>;
}

// File validation result
export interface FileValidationResult {
    isValid: boolean;
    errors: string[];
    file: File;
}

// Upload session interface
export interface UploadSession {
    sessionId: string;
    files: File[];
    progress: UploadProgress[];
    status: 'idle' | 'uploading' | 'completed' | 'failed';
    totalFiles: number;
    completedFiles: number;
    failedFiles: number;
    startTime?: Date;
    endTime?: Date;
}

// State interfaces
export interface MediaState {
    // Media files
    mediaFiles: MediaFile[];
    mediaLoading: boolean;
    mediaError: string | null;

    // Upload state
    uploading: boolean;
    uploadSessions: Record<string, UploadSession>;
    currentUploadSession: string | null;
    uploadProgress: UploadProgress[];
    uploadError: string | null;

    // Configuration
    uploadConfig: UploadConfig;

    // UI state
    isInitialized: boolean;
    selectedFiles: File[];
    previewUrls: Record<string, string>;
    dragActive: boolean;
}

// Hook return types
export interface UseMediaReturn {
    // Media state
    mediaFiles: MediaFile[];
    mediaLoading: boolean;
    mediaError: string | null;

    // Upload state
    uploading: boolean;
    uploadSessions: Record<string, UploadSession>;
    currentUploadSession: string | null;
    uploadProgress: UploadProgress[];
    uploadError: string | null;

    // Configuration
    uploadConfig: UploadConfig;

    // Actions
    uploadFiles: (files: File[], config?: Partial<UploadConfig>) => Promise<{ success: MediaFile[]; failed: FileValidationResult[] }>;
    uploadSingleFile: (file: File, config?: Partial<UploadConfig>) => Promise<MediaFile>;
    createMediaRecord: (mediaData: CreateMediaRequest) => Promise<MediaFile>;
    createBulkMediaRecords: (mediaData: CreateBulkMediaRequest) => Promise<MediaFile[]>;
    validateFiles: (files: File[]) => FileValidationResult[];
    clearUploadErrors: () => void;
    clearMediaErrors: () => void;
    cancelUpload: (sessionId: string) => void;

    // File management
    selectFiles: (files: File[]) => void;
    removeSelectedFile: (index: number) => void;
    clearSelectedFiles: () => void;
    generatePreviewUrl: (file: File) => string;
    revokePreviewUrl: (fileId: string) => void;

    // Drag and drop
    dragActive: boolean;
    setDragActive: (active: boolean) => void;

    // Utilities
    isInitialized: boolean;
    formatFileSize: (bytes: number) => string;
    getFileType: (file: File) => 'image' | 'video' | 'audio' | 'document' | 'other';
    isImageFile: (file: File) => boolean;
    isVideoFile: (file: File) => boolean;
    generateUniqueFileName: (originalName: string) => string;
    getOptimizedImageUrl: (url: string, options?: ImageOptimizationOptions) => string;

    // Additional utilities
    initializeMedia: () => Promise<void>;
    getCurrentUploadSessionData: () => any;
    getUploadProgressPercentage: () => number;
    getRecentMediaFiles: (limit?: number) => MediaFile[];
    getThumbnailUrl: (mediaFile: MediaFile, size?: number) => string;
    compressImage: (file: File, options?: any) => Promise<File>;
    extractFileMetadata: (file: File) => Promise<Record<string, unknown>>;
    fileToBase64: (file: File) => Promise<string>;
    isCloudinaryConfigured: () => boolean;
    updateUploadConfig: (config: Partial<UploadConfig>) => void;
    resetUploadConfig: () => void;
    addMediaFiles: (files: MediaFile[]) => void;
    removeMediaFile: (mediaId: string) => void;
    clearMediaFiles: () => void;
    clearUploadSession: (sessionId: string) => void;
    clearAllUploadSessions: () => void;
    handleFileDrop: (files: File[]) => void;
    handleDragOver: (event: DragEvent) => void;
    handleDragLeave: (event: DragEvent) => void;
    getUploadStatusSummary: () => any;
}

// Image optimization options
export interface ImageOptimizationOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
}

// API endpoints
export const MEDIA_ENDPOINTS = {
    CREATE_MEDIA: '/api/media',
    CREATE_BULK_MEDIA: '/api/media/bulk',
} as const;

// Default upload configuration
export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'avi', 'mov', 'pdf', 'doc', 'docx'],
    allowedResourceTypes: ['image', 'video', 'raw'],
    maxFiles: 10,
    folder: 'general',
} as const;

// File type mappings
export const FILE_TYPE_MAPPINGS = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'],
    video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'],
    audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'],
    document: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx'],
} as const;

// Upload status messages
export const UPLOAD_STATUS_MESSAGES = {
    pending: 'Waiting to upload...',
    uploading: 'Uploading...',
    processing: 'Processing...',
    completed: 'Upload completed',
    failed: 'Upload failed',
} as const;

// Error messages
export const UPLOAD_ERROR_MESSAGES = {
    FILE_TOO_LARGE: 'File size exceeds maximum allowed size',
    INVALID_FORMAT: 'File format is not supported',
    TOO_MANY_FILES: 'Too many files selected',
    UPLOAD_FAILED: 'Upload failed. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
} as const;