/**
 * Formatting Utility Functions
 * 
 * Helper functions for data formatting and text manipulation.
 */

/**
 * Format ISO datetime string to readable format
 */
export const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        // Relative time for recent dates
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        // Absolute date for older entries
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch (error) {
        return dateString;
    }
};

/**
 * Capitalize category names
 */
export const formatCategory = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
};

/**
 * Format tags array to comma-separated string
 */
export const formatTags = (tags: string[]): string => {
    return tags.join(', ');
};

/**
 * Parse comma-separated tags string to array
 */
export const parseTags = (tagsString: string): string[] => {
    return tagsString
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
};
