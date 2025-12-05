// src/store/slices/mediaSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MediaService } from '../../services/mediaService';
import {
    MediaState,
    MediaFile,
    CreateMediaRequest,
    CreateBulkMediaRequest,
    UploadConfig,
    UploadProgress,
    UploadSession,
    DEFAULT_UPLOAD_CONFIG,
} from '../../types/mediaTypes';
import { APIError } from '../../types/authTypes';

// Generate unique session ID
const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Initial state
const initialState: MediaState = {
    // Media files
    mediaFiles: [],
    mediaLoading: false,
    mediaError: null,

    // Upload state
    uploading: false,
    uploadSessions: {},
    currentUploadSession: null,
    uploadProgress: [],
    uploadError: null,

    // Configuration
    uploadConfig: DEFAULT_UPLOAD_CONFIG,

    // UI state
    isInitialized: false,
    selectedFiles: [],
    previewUrls: {},
    dragActive: false,
};

// Async thunks for media actions

/**
 * Upload single file
 */
export const uploadSingleFile = createAsyncThunk<
    MediaFile,
    { file: File; config?: Partial<UploadConfig> },
    { rejectValue: APIError }
>(
    'media/uploadSingleFile',
    async ({ file, config = {} }, { rejectWithValue, dispatch }) => {
        try {
            // Create upload session
            const sessionId = generateSessionId();
            dispatch(createUploadSession({
                sessionId,
                files: [file],
            }));

            // Update progress
            dispatch(updateUploadProgress({
                sessionId,
                fileIndex: 0,
                progress: {
                    fileId: `${file.name}_${Date.now()}`,
                    fileName: file.name,
                    progress: 0,
                    status: 'uploading',
                },
            }));

            // Upload file
            const result = await MediaService.uploadFile(file, config);

            // Update progress to completed
            dispatch(updateUploadProgress({
                sessionId,
                fileIndex: 0,
                progress: {
                    fileId: `${file.name}_${Date.now()}`,
                    fileName: file.name,
                    progress: 100,
                    status: 'completed',
                },
            }));

            return result;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Upload multiple files
 */
export const uploadMultipleFiles = createAsyncThunk<
    MediaFile[],
    { files: File[]; config?: Partial<UploadConfig> },
    { rejectValue: APIError }
>(
    'media/uploadMultipleFiles',
    async ({ files, config = {} }, { rejectWithValue, dispatch }) => {
        try {
            // Create upload session
            const sessionId = generateSessionId();
            dispatch(createUploadSession({
                sessionId,
                files,
            }));

            // Initialize progress for all files
            files.forEach((file, index) => {
                dispatch(updateUploadProgress({
                    sessionId,
                    fileIndex: index,
                    progress: {
                        fileId: `${file.name}_${Date.now()}_${index}`,
                        fileName: file.name,
                        progress: 0,
                        status: 'uploading',
                    },
                }));
            });

            // Upload files with progress tracking
            const results = await MediaService.uploadFiles(
                files,
                config,
                (fileIndex: number, progress: number) => {
                    dispatch(updateUploadProgress({
                        sessionId,
                        fileIndex,
                        progress: {
                            fileId: `${files[fileIndex].name}_${Date.now()}_${fileIndex}`,
                            fileName: files[fileIndex].name,
                            progress,
                            status: progress === 100 ? 'completed' : 'uploading',
                        },
                    }));
                }
            );

            return results;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Create media record
 */
export const createMediaRecord = createAsyncThunk<
    MediaFile,
    CreateMediaRequest,
    { rejectValue: APIError }
>(
    'media/createMediaRecord',
    async (mediaData, { rejectWithValue }) => {
        try {
            const response = await MediaService.createMediaRecord(mediaData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

/**
 * Create bulk media records
 */
export const createBulkMediaRecords = createAsyncThunk<
    MediaFile[],
    CreateBulkMediaRequest,
    { rejectValue: APIError }
>(
    'media/createBulkMediaRecords',
    async (mediaData, { rejectWithValue }) => {
        try {
            const response = await MediaService.createBulkMediaRecords(mediaData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error as APIError);
        }
    }
);

// Media slice
const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        // Clear errors
        clearMediaError: (state) => {
            state.mediaError = null;
        },

        clearUploadError: (state) => {
            state.uploadError = null;
        },

        clearAllMediaErrors: (state) => {
            state.mediaError = null;
            state.uploadError = null;
        },

        // Upload session management
        createUploadSession: (state, action: PayloadAction<{ sessionId: string; files: File[] }>) => {
            const { sessionId, files } = action.payload;
            const session: UploadSession = {
                sessionId,
                files,
                progress: [],
                status: 'uploading',
                totalFiles: files.length,
                completedFiles: 0,
                failedFiles: 0,
                startTime: new Date(),
            };

            state.uploadSessions[sessionId] = session;
            state.currentUploadSession = sessionId;
        },

        updateUploadProgress: (state, action: PayloadAction<{
            sessionId: string;
            fileIndex: number;
            progress: UploadProgress;
        }>) => {
            const { sessionId, fileIndex, progress } = action.payload;
            const session = state.uploadSessions[sessionId];

            if (session) {
                // Update or add progress for this file
                const existingProgressIndex = session.progress.findIndex(p => p.fileId === progress.fileId);

                if (existingProgressIndex !== -1) {
                    session.progress[existingProgressIndex] = progress;
                } else {
                    session.progress.push(progress);
                }

                // Update session statistics
                const completedFiles = session.progress.filter(p => p.status === 'completed').length;
                const failedFiles = session.progress.filter(p => p.status === 'failed').length;

                session.completedFiles = completedFiles;
                session.failedFiles = failedFiles;

                // Update session status
                if (completedFiles + failedFiles === session.totalFiles) {
                    session.status = failedFiles > 0 ? 'failed' : 'completed';
                    session.endTime = new Date();
                }

                // Update global upload progress
                state.uploadProgress = session.progress;
            }
        },

        cancelUploadSession: (state, action: PayloadAction<string>) => {
            const sessionId = action.payload;
            const session = state.uploadSessions[sessionId];

            if (session) {
                session.status = 'failed';
                session.endTime = new Date();

                // Mark all pending uploads as failed
                session.progress = session.progress.map(p =>
                    p.status === 'uploading' || p.status === 'pending'
                        ? { ...p, status: 'failed' as const, error: 'Upload cancelled' }
                        : p
                );
            }

            if (state.currentUploadSession === sessionId) {
                state.currentUploadSession = null;
            }
        },

        clearUploadSession: (state, action: PayloadAction<string>) => {
            const sessionId = action.payload;
            delete state.uploadSessions[sessionId];

            if (state.currentUploadSession === sessionId) {
                state.currentUploadSession = null;
                state.uploadProgress = [];
            }
        },

        clearAllUploadSessions: (state) => {
            state.uploadSessions = {};
            state.currentUploadSession = null;
            state.uploadProgress = [];
        },

        // File selection management
        selectFiles: (state, action: PayloadAction<File[]>) => {
            state.selectedFiles = action.payload;

            // Generate preview URLs for selected files
            state.previewUrls = {};
            action.payload.forEach((file, index) => {
                if (MediaService.isImageFile(file)) {
                    const url = MediaService.generatePreviewUrl(file);
                    state.previewUrls[`${file.name}_${index}`] = url;
                }
            });
        },

        removeSelectedFile: (state, action: PayloadAction<number>) => {
            const index = action.payload;
            if (index >= 0 && index < state.selectedFiles.length) {
                const file = state.selectedFiles[index];
                const previewKey = `${file.name}_${index}`;

                // Revoke preview URL
                if (state.previewUrls[previewKey]) {
                    MediaService.revokePreviewUrl(state.previewUrls[previewKey]);
                    delete state.previewUrls[previewKey];
                }

                // Remove file
                state.selectedFiles.splice(index, 1);
            }
        },

        clearSelectedFiles: (state) => {
            // Revoke all preview URLs
            Object.values(state.previewUrls).forEach(url => {
                MediaService.revokePreviewUrl(url);
            });

            state.selectedFiles = [];
            state.previewUrls = {};
        },

        // Drag and drop state
        setDragActive: (state, action: PayloadAction<boolean>) => {
            state.dragActive = action.payload;
        },

        // Upload configuration
        setUploadConfig: (state, action: PayloadAction<Partial<UploadConfig>>) => {
            state.uploadConfig = { ...state.uploadConfig, ...action.payload };
        },

        resetUploadConfig: (state) => {
            state.uploadConfig = DEFAULT_UPLOAD_CONFIG;
        },

        // Loading states
        setMediaLoading: (state, action: PayloadAction<boolean>) => {
            state.mediaLoading = action.payload;
        },

        setUploading: (state, action: PayloadAction<boolean>) => {
            state.uploading = action.payload;
        },

        // Add media files to state
        addMediaFiles: (state, action: PayloadAction<MediaFile[]>) => {
            state.mediaFiles = [...state.mediaFiles, ...action.payload];
        },

        removeMediaFile: (state, action: PayloadAction<string>) => {
            const mediaId = action.payload;
            state.mediaFiles = state.mediaFiles.filter(file => file.media_id !== mediaId);
        },

        clearMediaFiles: (state) => {
            state.mediaFiles = [];
        },

        // Mark as initialized
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Upload Single File
        builder
            .addCase(uploadSingleFile.pending, (state) => {
                state.uploading = true;
                state.uploadError = null;
            })
            .addCase(uploadSingleFile.fulfilled, (state, action) => {
                state.uploading = false;
                state.uploadError = null;
                state.mediaFiles.push(action.payload);
            })
            .addCase(uploadSingleFile.rejected, (state, action) => {
                state.uploading = false;
                state.uploadError = action.payload?.message || 'Failed to upload file';
            });

        // Upload Multiple Files
        builder
            .addCase(uploadMultipleFiles.pending, (state) => {
                state.uploading = true;
                state.uploadError = null;
            })
            .addCase(uploadMultipleFiles.fulfilled, (state, action) => {
                state.uploading = false;
                state.uploadError = null;
                state.mediaFiles = [...state.mediaFiles, ...action.payload];
            })
            .addCase(uploadMultipleFiles.rejected, (state, action) => {
                state.uploading = false;
                state.uploadError = action.payload?.message || 'Failed to upload files';
            });

        // Create Media Record
        builder
            .addCase(createMediaRecord.pending, (state) => {
                state.mediaLoading = true;
                state.mediaError = null;
            })
            .addCase(createMediaRecord.fulfilled, (state, action) => {
                state.mediaLoading = false;
                state.mediaError = null;
                state.mediaFiles.push(action.payload);
            })
            .addCase(createMediaRecord.rejected, (state, action) => {
                state.mediaLoading = false;
                state.mediaError = action.payload?.message || 'Failed to create media record';
            });

        // Create Bulk Media Records
        builder
            .addCase(createBulkMediaRecords.pending, (state) => {
                state.mediaLoading = true;
                state.mediaError = null;
            })
            .addCase(createBulkMediaRecords.fulfilled, (state, action) => {
                state.mediaLoading = false;
                state.mediaError = null;
                state.mediaFiles = [...state.mediaFiles, ...action.payload];
            })
            .addCase(createBulkMediaRecords.rejected, (state, action) => {
                state.mediaLoading = false;
                state.mediaError = action.payload?.message || 'Failed to create media records';
            });
    },
});

// Export actions
export const {
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
    setMediaLoading,
    setUploading,
    addMediaFiles,
    removeMediaFile,
    clearMediaFiles,
    setInitialized,
} = mediaSlice.actions;

// Export selectors
export const selectMediaState = (state: { media: MediaState }) => state.media;
export const selectMediaFiles = (state: { media: MediaState }) => state.media.mediaFiles;
export const selectMediaLoading = (state: { media: MediaState }) => state.media.mediaLoading;
export const selectMediaError = (state: { media: MediaState }) => state.media.mediaError;

export const selectUploading = (state: { media: MediaState }) => state.media.uploading;
export const selectUploadSessions = (state: { media: MediaState }) => state.media.uploadSessions;
export const selectCurrentUploadSession = (state: { media: MediaState }) => state.media.currentUploadSession;
export const selectUploadProgress = (state: { media: MediaState }) => state.media.uploadProgress;
export const selectUploadError = (state: { media: MediaState }) => state.media.uploadError;

export const selectUploadConfig = (state: { media: MediaState }) => state.media.uploadConfig;
export const selectSelectedFiles = (state: { media: MediaState }) => state.media.selectedFiles;
export const selectPreviewUrls = (state: { media: MediaState }) => state.media.previewUrls;
export const selectDragActive = (state: { media: MediaState }) => state.media.dragActive;
export const selectIsMediaInitialized = (state: { media: MediaState }) => state.media.isInitialized;

// Derived selectors
export const selectCurrentUploadSessionData = (state: { media: MediaState }) => {
    const sessionId = state.media.currentUploadSession;
    return sessionId ? state.media.uploadSessions[sessionId] : null;
};

export const selectUploadProgress_percentage = (state: { media: MediaState }) => {
    const session = selectCurrentUploadSessionData({ media: state.media });
    if (!session || session.totalFiles === 0) return 0;

    const totalProgress = session.progress.reduce((sum, p) => sum + p.progress, 0);
    return Math.round(totalProgress / session.totalFiles);
};

export const selectImageFiles = (state: { media: MediaState }) =>
    state.media.mediaFiles.filter(file => file.resource_type === 'image');

export const selectVideoFiles = (state: { media: MediaState }) =>
    state.media.mediaFiles.filter(file => file.resource_type === 'video');

export const selectRecentMediaFiles = (limit: number = 10) => (state: { media: MediaState }) =>
    [...state.media.mediaFiles]
        .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
        .slice(0, limit);

// Export reducer
export default mediaSlice.reducer;