/**
 * API Client utility
 * Centralized HTTP client with error handling and authentication
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ApiError } from '../types';
import { API_BASE_URL, REQUEST_TIMEOUT, STORAGE_KEYS } from './config';

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = REQUEST_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Get authentication token from storage
   */
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Build headers with authentication
   */
  private async buildHeaders(customHeaders?: Record<string, string>): Promise<Record<string, string>> {
    const token = await this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      const errorData = isJson ? await response.json() : await response.text();
      
      // Extract error message from different error formats
      let errorMessage = 'An error occurred';
      
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData?.message) {
        // If message is a string, use it directly
        if (typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        }
        // If message is an object (validation errors), format it
        else if (errorData.message?.errors) {
          const errors = errorData.message.errors;
          const errorMessages = Object.values(errors).join(', ');
          errorMessage = errorMessages || 'Validation error';
        }
      } else if (errorData?.errors) {
        // Handle errors object directly
        const errorMessages = Object.values(errorData.errors).join(', ');
        errorMessage = errorMessages || 'Validation error';
      }
      
      throw {
        message: errorMessage,
        status: response.status,
        details: errorData,
      } as ApiError;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (isJson ? await response.json() : await response.text()) as T;
  }

  /**
   * Make a request with timeout
   */
  private async requestWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          status: 408,
        } as ApiError;
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> {
    try {
      const headers = await this.buildHeaders(customHeaders);
      const response = await this.requestWithTimeout(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers,
      });

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('GET request error:', error);
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    try {
      const headers = await this.buildHeaders(customHeaders);
      const response = await this.requestWithTimeout(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('POST request error:', error);
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    try {
      const headers = await this.buildHeaders(customHeaders);
      const response = await this.requestWithTimeout(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('PUT request error:', error);
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    try {
      const headers = await this.buildHeaders(customHeaders);
      const response = await this.requestWithTimeout(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('PATCH request error:', error);
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> {
    try {
      const headers = await this.buildHeaders(customHeaders);
      const response = await this.requestWithTimeout(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('DELETE request error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
