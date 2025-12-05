// src/hooks/mediaHook.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
    uploadSingleFile,
    uploadMultipleFiles,
    createMediaRecord,
    createBulkMediaRecords,
    clearMediaError,
    clearUploadError,
    clearAllMediaErrors,
    createUploadSession,
    updateUploadProgress,
    cancelUploadSession,
    clearUploadSession,
    clearAllUploadSessions,
    selectFiles,
    removeSelectedFile,
    clearSelectedFiles,
    setDragActive,
    setUploadConfig,
    resetUploadConfig,
    addMediaFiles,
    removeMediaFile,
    clearMediaFiles,
    setInitialized,
    selectMediaFiles,
    selectMediaLoading,
    selectMediaError,
    selectUploading,
    selectUploadSessions,
    selectCurrentUploadSession,
    selectUploadProgress,
    selectUploadError,
    selectUploadConfig,
    selectSelectedFiles,
    selectPreviewUrls,
    selectDragActive,
    selectIsMediaInitialized,
    selectCurrentUploadSessionData,
    selectUploadProgress_percentage,
    selectImageFiles,
    selectVideoFiles,
    selectRecentMediaFiles,
} from '../store/slices/mediaSlice';
import { MediaService } from '../services/mediaService';
import {
    UseMediaReturn,
    MediaFile,
    CreateMediaRequest,
    CreateBulkMediaRequest,
    UploadConfig,
    FileValidationResult,
    ImageOptimizationOptions,
} from '../types/mediaTypes';

/**
 * Custom hook for media management
 * Provides all media-related functionality with Redux integration
 */
export const useMedia = (): UseMediaReturn => {
    const dispatch = useDispatch<AppDispatch>();

    // Selectors
    const mediaFiles = useSelector((state: RootState) => selectMediaFiles(state));
    const mediaLoading = useSelector((state: RootState) => selectMediaLoading(state));
    const mediaError = useSelector((state: RootState) => selectMediaError(state));

    const uploading = useSelector((state: RootState) => selectUploading(state));
    const uploadSessions = useSelector((state: RootState) => selectUploadSessions(state));
    const currentUploadSession = useSelector((state: RootState) => selectCurrentUploadSession(state));
    const uploadProgress = useSelector((state: RootState) => selectUploadProgress(state));
    const uploadError = useSelector((state: RootState) => selectUploadError(state));

    const uploadConfig = useSelector((state: RootState) => selectUploadConfig(state));
    const selectedFiles = useSelector((state: RootState) => selectSelectedFiles(state));
    const previewUrls = useSelector((state: RootState) => selectPreviewUrls(state));
    const dragActive = useSelector((state: RootState) => selectDragActive(state));
    const isInitialized = useSelector((state: RootState) => selectIsMediaInitialized(state));

    // Derived selectors
    const imageFiles = useSelector((state: RootState) => selectImageFiles(state));
    const videoFiles = useSelector((state: RootState) => selectVideoFiles(state));

    /**
     * Upload multiple files
     */
    const uploadFiles = useCallback(async (
        files: File[],
        config: Partial<UploadConfig> = {}
    ): Promise<MediaFile[]> => {
        const result = await dispatch(uploadMultipleFiles({ files, config })).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Upload single file
     */
    const uploadSingleFileData = useCallback(async (
        file: File,
        config: Partial<UploadConfig> = {}
    ): Promise<MediaFile> => {
        const result = await dispatch(uploadSingleFile({ file, config })).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Create media record in database
     */
    const createMediaRecordData = useCallback(async (mediaData: CreateMediaRequest): Promise<MediaFile> => {
        const result = await dispatch(createMediaRecord(mediaData)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Create bulk media records in database
     */
    const createBulkMediaRecordsData = useCallback(async (mediaData: CreateBulkMediaRequest): Promise<MediaFile[]> => {
        const result = await dispatch(createBulkMediaRecords(mediaData)).unwrap();
        return result;
    }, [dispatch]);

    /**
     * Validate files
     */
    const validateFiles = useCallback((files: File[]): FileValidationResult[] => {
        return MediaService.validateFiles(files, uploadConfig);
    }, [uploadConfig]);

    /**
     * Clear upload errors
     */
    const clearUploadErrors = useCallback((): void => {
        dispatch(clearUploadError());
    }, [dispatch]);

    /**
     * Clear media errors
     */
    const clearMediaErrors = useCallback((): void => {
        dispatch(clearMediaError());
    }, [dispatch]);

    /**
     * Cancel upload session
     */
    const cancelUpload = useCallback((sessionId: string): void => {
        dispatch(cancelUploadSession(sessionId));
    }, [dispatch]);

    /**
     * Select files for upload
     */
    const selectFilesData = useCallback((files: File[]): void => {
        dispatch(selectFiles(files));
    }, [dispatch]);

    /**
     * Remove selected file
     */
    const removeSelectedFileData = useCallback((index: number): void => {
        dispatch(removeSelectedFile(index));
    }, [dispatch]);

    /**
     * Clear selected files
     */
    const clearSelectedFilesData = useCallback((): void => {
        dispatch(clearSelectedFiles());
    }, [dispatch]);

    /**
     * Generate preview URL for file
     */
    const generatePreviewUrl = useCallback((file: File): string => {
        return MediaService.generatePreviewUrl(file);
    }, []);

    /**
     * Revoke preview URL
     */
    const revokePreviewUrl = useCallback((fileId: string): void => {
        const url = previewUrls[fileId];
        if (url) {
            MediaService.revokePreviewUrl(url);
        }
    }, [previewUrls]);

    /**
     * Set drag active state
     */
    const setDragActiveData = useCallback((active: boolean): void => {
        dispatch(setDragActive(active));
    }, [dispatch]);

    /**
     * Format file size
     */
    const formatFileSize = useCallback((bytes: number): string => {
        return MediaService.formatFileSize(bytes);
    }, []);

    /**
     * Get file type
     */
    const getFileType = useCallback((file: File): 'image' | 'video' | 'audio' | 'document' | 'other' => {
        return MediaService.getFileType(file);
    }, []);

    /**
     * Check if file is image
     */
    const isImageFile = useCallback((file: File): boolean => {
        return MediaService.isImageFile(file);
    }, []);

    /**
     * Check if file is video
     */
    const isVideoFile = useCallback((file: File): boolean => {
        return MediaService.isVideoFile(file);
    }, []);

    /**
     * Generate unique file name
     */
    const generateUniqueFileName = useCallback((originalName: string): string => {
        return MediaService.generateUniqueFileName(originalName);
    }, []);

    /**
     * Get optimized image URL
     */
    const getOptimizedImageUrl = useCallback((url: string, options?: ImageOptimizationOptions): string => {
        return MediaService.getOptimizedImageUrl(url, options);
    }, []);

    /**
     * Initialize media
     */
    const initializeMedia = useCallback(async (): Promise<void> => {
        try {
            if (!isInitialized) {
                // Any initialization logic can go here
                dispatch(setInitialized(true));
            }
        } catch (error) {
            console.error('Failed to initialize media:', error);
        }
    }, [dispatch, isInitialized]);

    /**
     * Upload files with validation
     */
    const uploadFilesWithValidation = useCallback(async (
        files: File[],
        config: Partial<UploadConfig> = {}
    ): Promise<{ success: MediaFile[]; failed: FileValidationResult[] }> => {
        // Validate files first
        const validations = validateFiles(files);
        const validFiles: File[] = [];
        const failedValidations: FileValidationResult[] = [];

        validations.forEach(validation => {
            if (validation.isValid) {
                validFiles.push(validation.file);
            } else {
                failedValidations.push(validation);
            }
        });

        // Upload valid files
        let successfulUploads: MediaFile[] = [];
        if (validFiles.length > 0) {
            try {
                successfulUploads = await uploadFiles(validFiles, config);
            } catch (error) {
                console.error('Upload failed:', error);
            }
        }

        return {
            success: successfulUploads,
            failed: failedValidations,
        };
    }, [validateFiles, uploadFiles]);

    /**
     * Get upload session data
     */
    const getCurrentUploadSessionData = useCallback(() => {
        if (!currentUploadSession) return null;
        return uploadSessions[currentUploadSession] || null;
    }, [currentUploadSession, uploadSessions]);

    /**
     * Get upload progress percentage
     */
    const getUploadProgressPercentage = useCallback((): number => {
        const session = getCurrentUploadSessionData();
        if (!session || session.totalFiles === 0) return 0;

        const totalProgress = session.progress.reduce((sum, p) => sum + p.progress, 0);
        return Math.round(totalProgress / session.totalFiles);
    }, [getCurrentUploadSessionData]);

    /**
     * Get recent media files
     */
    const getRecentMediaFiles = useCallback((limit: number = 10): MediaFile[] => {
        return [...mediaFiles]
            .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
            .slice(0, limit);
    }, [mediaFiles]);

    /**
     * Get thumbnail URL for media file
     */
    const getThumbnailUrl = useCallback((mediaFile: MediaFile, size: number = 150): string => {
        return MediaService.getThumbnailUrl(mediaFile, size);
    }, []);

    /**
     * Compress image file
     */
    const compressImage = useCallback(async (
        file: File,
        options: { quality?: number; maxWidth?: number; maxHeight?: number } = {}
    ): Promise<File> => {
        return await MediaService.compressImage(file, options);
    }, []);

    /**
     * Extract file metadata
     */
    const extractFileMetadata = useCallback(async (file: File): Promise<Record<string, unknown>> => {
        return await MediaService.extractFileMetadata(file);
    }, []);

    /**
     * Convert file to base64
     */
    const fileToBase64 = useCallback(async (file: File): Promise<string> => {
        return await MediaService.fileToBase64(file);
    }, []);

    /**
     * Check if Cloudinary is configured
     */
    const isCloudinaryConfigured = useCallback((): boolean => {
        return MediaService.isCloudinaryConfigured();
    }, []);

    /**
     * Update upload configuration
     */
    const updateUploadConfig = useCallback((config: Partial<UploadConfig>): void => {
        dispatch(setUploadConfig(config));
    }, [dispatch]);

    /**
     * Reset upload configuration to defaults
     */
    const resetUploadConfigData = useCallback((): void => {
        dispatch(resetUploadConfig());
    }, [dispatch]);

    /**
     * Add media files to state
     */
    const addMediaFilesData = useCallback((files: MediaFile[]): void => {
        dispatch(addMediaFiles(files));
    }, [dispatch]);

    /**
     * Remove media file from state
     */
    const removeMediaFileData = useCallback((mediaId: string): void => {
        dispatch(removeMediaFile(mediaId));
    }, [dispatch]);

    /**
     * Clear all media files from state
     */
    const clearMediaFilesData = useCallback((): void => {
        dispatch(clearMediaFiles());
    }, [dispatch]);

    /**
     * Clear upload session
     */
    const clearUploadSessionData = useCallback((sessionId: string): void => {
        dispatch(clearUploadSession(sessionId));
    }, [dispatch]);

    /**
     * Clear all upload sessions
     */
    const clearAllUploadSessionsData = useCallback((): void => {
        dispatch(clearAllUploadSessions());
    }, [dispatch]);

    /**
     * Handle file drop
     */
    const handleFileDrop = useCallback((files: File[]): void => {
        setDragActiveData(false);
        selectFilesData(files);
    }, [setDragActiveData, selectFilesData]);

    /**
     * Handle drag over
     */
    const handleDragOver = useCallback((event: DragEvent): void => {
        event.preventDefault();
        setDragActiveData(true);
    }, [setDragActiveData]);

    /**
     * Handle drag leave
     */
    const handleDragLeave = useCallback((event: DragEvent): void => {
        event.preventDefault();
        setDragActiveData(false);
    }, [setDragActiveData]);

    /**
     * Get upload status summary
     */
    const getUploadStatusSummary = useCallback(() => {
        const session = getCurrentUploadSessionData();
        if (!session) {
            return {
                isActive: false,
                totalFiles: 0,
                completedFiles: 0,
                failedFiles: 0,
                progressPercentage: 0,
                status: 'idle' as const,
            };
        }

        return {
            isActive: session.status === 'uploading',
            totalFiles: session.totalFiles,
            completedFiles: session.completedFiles,
            failedFiles: session.failedFiles,
            progressPercentage: getUploadProgressPercentage(),
            status: session.status,
        };
    }, [getCurrentUploadSessionData, getUploadProgressPercentage]);

    return {
        // Media state
        mediaFiles,
        mediaLoading,
        mediaError,

        // Upload state
        uploading,
        uploadSessions,
        currentUploadSession,
        uploadProgress,
        uploadError,

        // Configuration
        uploadConfig,

        // Actions
        uploadFiles: uploadFilesWithValidation,
        uploadSingleFile: uploadSingleFileData,
        createMediaRecord: createMediaRecordData,
        createBulkMediaRecords: createBulkMediaRecordsData,
        validateFiles,
        clearUploadErrors,
        clearMediaErrors,
        cancelUpload,

        // File management
        selectFiles: selectFilesData,
        removeSelectedFile: removeSelectedFileData,
        clearSelectedFiles: clearSelectedFilesData,
        generatePreviewUrl,
        revokePreviewUrl,

        // Drag and drop
        dragActive,
        setDragActive: setDragActiveData,

        // Utilities
        isInitialized,
        formatFileSize,
        getFileType,
        isImageFile,
        isVideoFile,
        generateUniqueFileName,
        getOptimizedImageUrl,

        // Additional utilities
        initializeMedia,
        getCurrentUploadSessionData,
        getUploadProgressPercentage,
        getRecentMediaFiles,
        getThumbnailUrl,
        compressImage,
        extractFileMetadata,
        fileToBase64,
        isCloudinaryConfigured,
        updateUploadConfig,
        resetUploadConfig: resetUploadConfigData,
        addMediaFiles: addMediaFilesData,
        removeMediaFile: removeMediaFileData,
        clearMediaFiles: clearMediaFilesData,
        clearUploadSession: clearUploadSessionData,
        clearAllUploadSessions: clearAllUploadSessionsData,
        handleFileDrop,
        handleDragOver,
        handleDragLeave,
        getUploadStatusSummary,
    };
};

/**
 * Hook for media state only (lighter version)
 */
export const useMediaState = () => {
    const mediaFiles = useSelector((state: RootState) => selectMediaFiles(state));
    const mediaLoading = useSelector((state: RootState) => selectMediaLoading(state));
    const mediaError = useSelector((state: RootState) => selectMediaError(state));
    const uploading = useSelector((state: RootState) => selectUploading(state));
    const uploadError = useSelector((state: RootState) => selectUploadError(state));

    return {
        mediaFiles,
        mediaLoading,
        mediaError,
        uploading,
        uploadError,
    };
};

/**
 * Hook for upload progress
 */
export const useUploadProgress = () => {
    const uploading = useSelector((state: RootState) => selectUploading(state));
    const uploadProgress = useSelector((state: RootState) => selectUploadProgress(state));
    const currentSession = useSelector((state: RootState) => selectCurrentUploadSessionData(state));
    const progressPercentage = useSelector((state: RootState) => selectUploadProgress_percentage(state));

    return {
        uploading,
        uploadProgress,
        currentSession,
        progressPercentage,
        isActive: currentSession?.status === 'uploading',
    };
};

/**
 * Hook for file selection and drag/drop
 */
export const useFileSelection = () => {
    const dispatch = useDispatch<AppDispatch>();
    const selectedFiles = useSelector((state: RootState) => selectSelectedFiles(state));
    const previewUrls = useSelector((state: RootState) => selectPreviewUrls(state));
    const dragActive = useSelector((state: RootState) => selectDragActive(state));

    const selectFilesData = useCallback((files: File[]) => {
        dispatch(selectFiles(files));
    }, [dispatch]);

    const removeFile = useCallback((index: number) => {
        dispatch(removeSelectedFile(index));
    }, [dispatch]);

    const clearFiles = useCallback(() => {
        dispatch(clearSelectedFiles());
    }, [dispatch]);

    const setDragActiveData = useCallback((active: boolean) => {
        dispatch(setDragActive(active));
    }, [dispatch]);

    return {
        selectedFiles,
        previewUrls,
        dragActive,
        selectFiles: selectFilesData,
        removeFile,
        clearFiles,
        setDragActive: setDragActiveData,
    };
};

/**
 * Hook for image management
 */
export const useImageMedia = () => {
    const imageFiles = useSelector((state: RootState) => selectImageFiles(state));
    const recentImages = useSelector((state: RootState) => selectRecentMediaFiles(10)(state))
        .filter(file => file.resource_type === 'image');

    const getOptimizedImageUrl = useCallback((url: string, options?: ImageOptimizationOptions): string => {
        return MediaService.getOptimizedImageUrl(url, options);
    }, []);

    const getThumbnailUrl = useCallback((mediaFile: MediaFile, size: number = 150): string => {
        return MediaService.getThumbnailUrl(mediaFile, size);
    }, []);

    return {
        imageFiles,
        recentImages,
        getOptimizedImageUrl,
        getThumbnailUrl,
    };
};

// Export default
export default useMedia;