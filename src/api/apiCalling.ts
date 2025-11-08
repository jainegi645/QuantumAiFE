// import axios, { AxiosRequestConfig } from 'axios';
// import { endpoints } from './endpoints';
// import type { Endpoints } from './endpoints';

// // Use VITE_BACKEND_URL when provided; otherwise use a relative base so dev proxy can route /api
// const BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL ?? "http://localhost:8081";

// const API = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// type EndpointKey = keyof Endpoints | string | ((...args: any[]) => string);

// function resolveEndpoint(e: EndpointKey, args: any[] = []): string {
//   // If a raw string URL is provided, use it as-is
//   if (typeof e === 'string') return e;

//   // If a function was passed directly, call it with args
//   if (typeof e === 'function') return e(...args);

//   // Otherwise it's a key of the endpoints object — lookup and resolve
//   const value = (endpoints as any)[e as keyof Endpoints];
//   if (typeof value === 'function') return value(...args);
//   return String(value);
// }


// export type ApiError = {
//   message: string;
//   status?: number;
//   data?: any;
//   endpoint?: string;
//   original?: any;
// };

// function toApiError(err: any, endpoint?: string): ApiError {
//   if (axios.isAxiosError(err)) {
//     return {
//       message: err.message || 'Request failed',
//       status: err.response?.status,
//       data: err.response?.data,
//       endpoint,
//       original: err,
//     };
//   }

//   return {
//     message: err?.message ? String(err.message) : String(err ?? 'Unknown error'),
//     endpoint,
//     original: err,
//   };
// }

// export const apiService = {
//   uploadFile: async <T = any>(
//     endpoint: EndpointKey,
//     file: File,
//     args: any[] = [],
//     config?: AxiosRequestConfig
//   ): Promise<T> => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       // Let the browser/axios set the Content-Type (including boundary) for FormData.
//       const finalConfig: AxiosRequestConfig = {
//         ...config,
//         headers: {
//           ...config?.headers,
//         },
//       };

//       const url = resolveEndpoint(endpoint, args);
//       const response = await API.post<T>(url, formData, finalConfig);
//       return response.data;
//     } catch (error) {
//       throw toApiError(error, String(endpoint));
//     }
//   },

//   get: async <T = any>(
//     endpoint: EndpointKey,
//     params?: Record<string, any> | null,
//     args: any[] = [],
//     config?: AxiosRequestConfig,
//   ): Promise<T> => {
//     try {
//       const url = resolveEndpoint(endpoint, args);
//       const response = await API.get<T>(url, { params, ...config });
//       return response.data;
//     } catch (error) {
//       const url = resolveEndpoint(endpoint, args);
//       throw toApiError(error, url);
//     }
//   },

//   post: async <T = any, B = any>(
//     endpoint: EndpointKey,
//     body?: B,
//     args: any[] = [],
//     config?: AxiosRequestConfig,
//   ): Promise<T> => {
//     try {
//       const url = resolveEndpoint(endpoint, args);
//       const response = await API.post<T>(url, body, config);
//       return response.data;
//     } catch (error) {
//       const url = resolveEndpoint(endpoint, args);
//       throw toApiError(error, url);
//     }
//   },

//   put: async <T = any, B = any>(
//     endpoint: EndpointKey,
//     body?: B,
//     args: any[] = [],
//     config?: AxiosRequestConfig,
//   ): Promise<T> => {
//     try {
//       const url = resolveEndpoint(endpoint, args);
//       const response = await API.put<T>(url, body, config);
//       return response.data;
//     } catch (error) {
//       const url = resolveEndpoint(endpoint, args);
//       throw toApiError(error, url);
//     }
//   },

//   patch: async <T = any, B = any>(
//     endpoint: EndpointKey,
//     body?: B,
//     args: any[] = [],
//     config?: AxiosRequestConfig,
//   ): Promise<T> => {
//     try {
//       const url = resolveEndpoint(endpoint, args);
//       const response = await API.patch<T>(url, body, config);
//       return response.data;
//     } catch (error) {
//       const url = resolveEndpoint(endpoint, args);
//       throw toApiError(error, url);
//     }
//   },

//   delete: async <T = any>(endpoint: EndpointKey, args: any[] = [], config?: AxiosRequestConfig): Promise<T> => {
//     try {
//       const url = resolveEndpoint(endpoint, args);
//       const response = await API.delete<T>(url, config);
//       return response.data;
//     } catch (error) {
//       const url = resolveEndpoint(endpoint, args);
//       throw toApiError(error, url);
//     }
//   },

//   // Helper to build a full URL string without making a request
//   buildUrl: (endpoint: EndpointKey, args: any[] = []) => resolveEndpoint(endpoint, args),
// };

import axios, { AxiosRequestConfig } from 'axios';
import { endpoints } from './endpoints';
import type { Endpoints } from './endpoints';

// Use VITE_BACKEND_URL when provided; default to port 8081 where the backend listens
const BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:8081';

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

type EndpointKey = keyof Endpoints | string | ((...args: any[]) => string);

function resolveEndpoint(e: EndpointKey, args: any[] = []): string {
  // If a raw string URL is provided, use it as-is
  if (typeof e === 'string') return e;

  // If a function was passed directly, call it with args
  if (typeof e === 'function') return e(...args);

  // Otherwise it's a key of the endpoints object — lookup and resolve
  const value = (endpoints as any)[e as keyof Endpoints];
  if (typeof value === 'function') return value(...args);
  return String(value);
}

export type ApiError = {
  message: string;
  status?: number;
  data?: any;
  endpoint?: string;
  original?: any;
};

function toApiError(err: any, endpoint?: string): ApiError {
  if (axios.isAxiosError(err)) {
    return {
      message: err.message || 'Request failed',
      status: err.response?.status,
      data: err.response?.data,
      endpoint,
      original: err,
    };
  }

  return {
    message: err?.message ? String(err.message) : String(err ?? 'Unknown error'),
    endpoint,
    original: err,
  };
}

export const apiService = {
  uploadFile: async <T = any>(
    endpoint: EndpointKey,
    file: File,
    args: any[] = [],
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const finalConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      };

      const url = resolveEndpoint(endpoint, args);
      const response = await API.post<T>(url, formData, finalConfig);
      return response.data;
    } catch (error) {
      throw toApiError(error, String(endpoint));
    }
  },
  get: async <T = any>(
    endpoint: EndpointKey,
    params?: Record<string, any> | null,
    args: any[] = [],
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    try {
      const url = resolveEndpoint(endpoint, args);
      const response = await API.get<T>(url, { params, ...config });
      return response.data;
    } catch (error) {
      const url = resolveEndpoint(endpoint, args);
      throw toApiError(error, url);
    }
  },

  post: async <T = any, B = any>(
    endpoint: EndpointKey,
    body?: B,
    args: any[] = [],
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    try {
      const url = resolveEndpoint(endpoint, args);
      const response = await API.post<T>(url, body, config);
      return response.data;
    } catch (error) {
      const url = resolveEndpoint(endpoint, args);
      throw toApiError(error, url);
    }
  },

  put: async <T = any, B = any>(
    endpoint: EndpointKey,
    body?: B,
    args: any[] = [],
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    try {
      const url = resolveEndpoint(endpoint, args);
      const response = await API.put<T>(url, body, config);
      return response.data;
    } catch (error) {
      const url = resolveEndpoint(endpoint, args);
      throw toApiError(error, url);
    }
  },
  patch: async <T = any, B = any>(
    endpoint: EndpointKey,
    body?: B,
    args: any[] = [],
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    try {
      const url = resolveEndpoint(endpoint, args);
      const response = await API.patch<T>(url, body, config);
      return response.data;
    } catch (error) {
      const url = resolveEndpoint(endpoint, args);
      throw toApiError(error, url);
    }
  },

  delete: async <T = any>(endpoint: EndpointKey, args: any[] = [], config?: AxiosRequestConfig): Promise<T> => {
    try {
      const url = resolveEndpoint(endpoint, args);
      const response = await API.delete<T>(url, config);
      return response.data;
    } catch (error) {
      const url = resolveEndpoint(endpoint, args);
      throw toApiError(error, url);
    }
  },

  // Helper to build a full URL string without making a request
  buildUrl: (endpoint: EndpointKey, args: any[] = []) => resolveEndpoint(endpoint, args),
};