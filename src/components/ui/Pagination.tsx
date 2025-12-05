import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { solarTheme } from '@/theme/theme';

// Skeleton for pagination loading state
export function PaginationSkeleton() {
    return (
        <div className="flex flex-col items-center gap-4 mt-6">
            {/* Items info skeleton */}
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48" />
            </div>

            {/* Pagination controls skeleton */}
            <div className="flex items-center gap-2">
                {/* First page button - desktop only */}
                <div className="hidden sm:block w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />

                {/* Previous button */}
                <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />

                {/* Page numbers */}
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
                </div>

                {/* Next button */}
                <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />

                {/* Last page button - desktop only */}
                <div className="hidden sm:block w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
            </div>
        </div>
    );
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    showItemsInfo?: boolean;
    maxPageButtons?: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    showItemsInfo = true,
    maxPageButtons = 5,
}: PaginationProps) {
    // Calculate displayed items range
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers array with smart truncation
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxPageButtons) {
            // Show all pages if total is less than max
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate range around current page
            const leftSiblingIndex = Math.max(currentPage - 1, 2);
            const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

            const showLeftDots = leftSiblingIndex > 2;
            const showRightDots = rightSiblingIndex < totalPages - 1;

            if (!showLeftDots && showRightDots) {
                // Show pages from start
                for (let i = 2; i < maxPageButtons; i++) {
                    pages.push(i);
                }
                pages.push('...');
            } else if (showLeftDots && !showRightDots) {
                // Show pages from end
                pages.push('...');
                for (let i = totalPages - maxPageButtons + 2; i < totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Show pages around current
                pages.push('...');
                for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                    pages.push(i);
                }
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    // Handlers
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handleFirst = () => {
        onPageChange(1);
    };

    const handleLast = () => {
        onPageChange(totalPages);
    };

    const handlePageClick = (page: number | string) => {
        if (typeof page === 'number') {
            onPageChange(page);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-6">
            {/* Items info */}
            {showItemsInfo && (
                <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
                    <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
                    <span className="font-semibold text-gray-900">{totalItems}</span> results
                </div>
            )}

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* First page button - desktop only */}
                <button
                    onClick={handleFirst}
                    disabled={currentPage === 1}
                    className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg border-2 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    style={{
                        borderColor: currentPage === 1 ? solarTheme.primary[200] : solarTheme.primary[300],
                        color: solarTheme.primary[600],
                    }}
                    aria-label="First page"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous button */}
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-9 h-9 rounded-lg border-2 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    style={{
                        borderColor: currentPage === 1 ? solarTheme.primary[200] : solarTheme.primary[300],
                        color: solarTheme.primary[600],
                    }}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {pageNumbers.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span
                                    key={`dots-${index}`}
                                    className="hidden sm:flex items-center justify-center w-9 h-9 text-gray-400"
                                >
                                    ...
                                </span>
                            );
                        }

                        const pageNum = page as number;
                        const isCurrentPage = pageNum === currentPage;

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageClick(pageNum)}
                                className={`flex items-center justify-center w-9 h-9 rounded-lg font-semibold transition-all duration-200 ${
                                    isCurrentPage
                                        ? 'text-white shadow-md hover:shadow-lg'
                                        : 'border-2 hover:shadow-md'
                                }`}
                                style={
                                    isCurrentPage
                                        ? {
                                            background: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.primary[500]})`,
                                        }
                                        : {
                                            borderColor: solarTheme.primary[300],
                                            color: solarTheme.primary[600],
                                        }
                                }
                                aria-label={`Page ${pageNum}`}
                                aria-current={isCurrentPage ? 'page' : undefined}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                {/* Next button */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-9 h-9 rounded-lg border-2 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    style={{
                        borderColor: currentPage === totalPages ? solarTheme.primary[200] : solarTheme.primary[300],
                        color: solarTheme.primary[600],
                    }}
                    aria-label="Next page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last page button - desktop only */}
                <button
                    onClick={handleLast}
                    disabled={currentPage === totalPages}
                    className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg border-2 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    style={{
                        borderColor: currentPage === totalPages ? solarTheme.primary[200] : solarTheme.primary[300],
                        color: solarTheme.primary[600],
                    }}
                    aria-label="Last page"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Compact version for mobile/limited space
export function PaginationCompact({
    currentPage,
    totalPages,
    onPageChange,
}: Pick<PaginationProps, 'currentPage' | 'totalPages' | 'onPageChange'>) {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-between gap-4">
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                style={{
                    borderColor: solarTheme.primary[300],
                    color: solarTheme.primary[600],
                }}
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="text-sm font-medium text-gray-700">
                Page <span className="font-bold">{currentPage}</span> of{' '}
                <span className="font-bold">{totalPages}</span>
            </span>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                style={{
                    borderColor: solarTheme.primary[300],
                    color: solarTheme.primary[600],
                }}
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
