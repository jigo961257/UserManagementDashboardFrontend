import axios from "axios";
// import { toast } from 'react-toastify';
import type { AxiosInstance ,AxiosRequestConfig,AxiosResponse} from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// const PORT =process.env.PORT || 8001;


// Define types for API response
interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: number;
}

// Define custom error structure
interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

// Define the structure for makeRequest options
interface RequestOptions extends Omit<AxiosRequestConfig, "url" | "baseURL"> {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  isToken?: boolean;
}

// Custom config to include isToken
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    isToken?: boolean;
}

// Mock data configuration
interface MockConfig {
    enabled: boolean;
    delay?: number; // Simulate network delay
}

interface MockResponse<T = any> {
    data: T;
    status: number;
    message?: string;
}

// Mock data store
const mockDataStore = new Map<string, (config: CustomAxiosRequestConfig) => MockResponse>();

// Mock configuration
const mockConfig: MockConfig = {
    enabled: import.meta.env.REACT_APP_ENABLE_MOCKS === 'true',
    delay: 500, // Default delay in ms
};

// Register mock responses
const registerMock = <T>(
  endpoint: string,
  mockResponse: (config: CustomAxiosRequestConfig) => MockResponse<T>
) => {
  mockDataStore.set(endpoint, mockResponse);
  return mockDataStore.get(endpoint);
};

// Create base axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.REACT_APP_API_URL ||
    `http://localhost:${import.meta.env.VITE_API_BASE_URL || 8001}`,
  timeout: 10000,
});

// Mock interceptor
axiosInstance.interceptors.request.use(
  // @ts-ignore
  async (config: CustomAxiosRequestConfig) => {
    if (!mockConfig.enabled) {
      return config;
    }

    // Find matching mock
    const mock = Array.from(mockDataStore.entries()).find(([endpoint]) => {
      // Convert endpoint pattern to regex
      const pattern = endpoint
        .replace(/:\w+/g, "[^/]+") // Replace :param with regex pattern
        .replace(/\//g, "\\/"); // Escape forward slashes
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(config.url || "");
    });

    if (mock) {
      const [, mockFn] = mock;
      const mockResponse = mockFn(config);

      // Simulate network delay
      if (mockConfig.delay) {
        await new Promise((resolve) => setTimeout(resolve, mockConfig.delay));
      }

      // Throw error for non-200 responses
      if (mockResponse.status >= 400) {
        throw {
          response: {
            status: mockResponse.status,
            data: { message: mockResponse.message },
          },
        };
      }
      // Return mock response
      return Promise.reject({
        config,
        response: {
          status: mockResponse.status,
          data: mockResponse.data,
          config,
          headers: {},
          statusText: "OK",
        },
      });
    }

    return config;
  }
);

// Request interceptor
axiosInstance.interceptors.request.use(
  // @ts-ignore
  (config: CustomAxiosRequestConfig): CustomAxiosRequestConfig => {
    // Get token if isToken is true (passed in config)
    const isToken = config.isToken !== false; // If not explicitly false, consider it true

    if (isToken) {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Always include these default headers
    config.headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    return config;
  },
  (error: any) => {
    // Handle request errors
    // toast.error('Request configuration error');
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  <T>(response: AxiosResponse<ApiResponse<T>>): T | ApiResponse<T> => {
    // return response.data.data || response.data;
    // @ts-ignore
    return {
      status: 200,
      message: response.data.message,
      data: response.data || response,
    };
  },
  (error: any) => {
    let errorMessage = "An error occurred";

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const apiError: ApiError = error.response.data;

      switch (status) {
        case 400:
          errorMessage = apiError.message || "Bad Request";
          break;
        case 401:
          errorMessage = "Unauthorized - Please login again";
          localStorage.removeItem("token");
          // You might want to use a more sophisticated auth management system
          window.location.href = "/";
          break;
        case 403:
          errorMessage = "Forbidden - You don't have permission";
          break;
        case 404:
          errorMessage = "Resource not found";
          break;
        case 500:
          errorMessage = "Internal Server Error";
          break;
        default:
          errorMessage = apiError.message || "Server Error";
      }
    } else if (error.request) {
      // Request made but no response received
      errorMessage = "No response from server";
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || "Error setting up the request";
    }
    return Promise.reject({ message: errorMessage, ...error });

  }
);

/**
 * Makes an HTTP request using axios with error handling
 * @template T - The expected type of the response data
 * @param {RequestOptions} options - Request configuration options
 * @returns {Promise<T>} - Response data
 */
const makeRequest = async <T = any>({
  endpoint,
  method = "GET",
  data = null,
  headers = {},
  isToken = true,
  params = {},
  ...rest
}: RequestOptions): Promise<T> => {
  // @ts-ignore
  return axiosInstance({
    url: endpoint,
    method,
    data,
    headers,
    params,
    isToken,
    ...rest,
  }) as Promise<T>;
};

export default makeRequest;

export { registerMock, mockConfig };
export type { RequestOptions, ApiResponse, ApiError, MockResponse };
