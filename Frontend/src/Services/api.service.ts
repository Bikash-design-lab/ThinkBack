/**
 * Core API Service
 * 
 * Base HTTP service with fetch wrapper for handling API requests.
 * Provides centralized error handling, logging, and response parsing.
 */

import { API_BASE_URL } from '../config/constants';
import logger from '../utils/logger';

interface ApiRequestOptions extends RequestInit {
    timeout?: number;
}

interface ApiError {
    message: string;
    status?: number;
    details?: any;
}

class ApiService {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    /**
     * Generic fetch wrapper with error handling
     */
    async request<T>(
        endpoint: string,
        options: ApiRequestOptions = {}
    ): Promise<T> {
        const { timeout = 30000, ...fetchOptions } = options;

        const url = `${this.baseURL}${endpoint}`;
        logger.info(`API Request: ${fetchOptions.method || 'GET'} ${url}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...fetchOptions.headers,
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error: ApiError = {
                    message: errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
                    status: response.status,
                    details: errorData,
                };
                logger.error('API Error:', error);
                throw error;
            }

            const data = await response.json();
            logger.info('API Success:', data);
            return data as T;
        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                logger.error('API Timeout:', endpoint);
                throw {
                    message: 'Request timeout. Please try again.',
                    status: 408,
                } as ApiError;
            }

            if (error.message && error.status) {
                throw error as ApiError;
            }

            logger.error('Network Error:', error);
            throw {
                message: 'Network error. Please check your connection.',
                details: error,
            } as ApiError;
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        body?: any,
        options?: ApiRequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    /**
     * PUT request
     */
    async put<T>(
        endpoint: string,
        body?: any,
        options?: ApiRequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
