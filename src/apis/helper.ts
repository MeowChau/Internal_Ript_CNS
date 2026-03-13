/**
 * API Helper - Reusable HTTP request functions
 *
 * Tích hợp với handleFetchAPI middleware để:
 * - Cache GET requests khi offline
 * - Tự động xử lý token expired
 * - Hỗ trợ JSON và FormData
 */

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  handleGetAPI,
  checkTokenExpired,
  getDataFromLocal,
  isOnline,
} from "./handleFetchAPI";
import { StorageService } from "@/services/storage";
import { STORAGE_KEYS } from "@/config/Constants";

// ==========================================
// GET REQUEST - WITH CACHE SUPPORT
// ==========================================

/**
 * GET request với offline cache fallback
 * @param url - API endpoint
 * @param data - Query parameters
 * @param isAuth - Có cần check authentication không (mặc định: true)
 */
export async function getData<P = any, R = any>(
  url: string,
  data?: P,
  isAuth: boolean = true,
): Promise<AxiosResponse<R> | null> {
  const myRequest: AxiosRequestConfig = {
    method: "get",
    params: {
      ...data,
    },
    url,
  };

  // Kiểm tra online/offline
  if (isOnline()) {
    try {
      // Gọi API khi online
      const response = await axios(myRequest);
      return await handleGetAPI<R>(response, isAuth, url);
    } catch (err: any) {
      // Nếu lỗi, vẫn thử xử lý response (có thể có error data)
      const errorResponse = err?.response;
      return await handleGetAPI<R>(errorResponse, isAuth, url);
    }
  } else {
    // Offline - lấy từ cache
    return await getDataFromLocal<R>(url);
  }
}

// ==========================================
// POST REQUEST - JSON
// ==========================================

/**
 * POST request với JSON body
 * @param url - API endpoint
 * @param json - Request body
 * @param isAuth - Có cần check authentication không (mặc định: true)
 */
export async function postData<P = any, R = any>(
  url: string,
  json: P,
  isAuth: boolean = true,
): Promise<AxiosResponse<R> | null> {
  const myRequest: AxiosRequestConfig = {
    method: "post",
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(json),
  };

  const response = await axios(myRequest);
  return checkTokenExpired<R>(response, isAuth);
}

// ==========================================
// PUT REQUEST - JSON
// ==========================================

/**
 * PUT request với JSON body
 * @param url - API endpoint
 * @param json - Request body
 * @param isAuth - Có cần check authentication không (mặc định: true)
 */
export async function putData<T = any, R = any>(
  url: string,
  json: T,
  isAuth: boolean = true,
): Promise<AxiosResponse<R> | null> {
  const myRequest: AxiosRequestConfig = {
    method: "put",
    url,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: JSON.stringify(json),
  };

  const response = await axios(myRequest);
  return checkTokenExpired<R>(response, isAuth);
}

// ==========================================
// DELETE REQUEST
// ==========================================

/**
 * DELETE request
 * @param url - API endpoint
 * @param json - Request body (optional)
 * @param isAuth - Có cần check authentication không (mặc định: true)
 */
export async function deleteData<T = any, R = any>(
  url: string,
  json?: T,
  isAuth: boolean = true,
): Promise<AxiosResponse<R> | null> {
  const myRequest: AxiosRequestConfig = {
    method: "delete",
    url,
    headers: {
      "Content-Type": "application/json",
    },
    data: json ? JSON.stringify(json) : undefined,
  };

  const response = await axios(myRequest);
  return checkTokenExpired<R>(response, isAuth);
}

// ==========================================
// POST REQUEST - FORM DATA
// ==========================================

/**
 * POST request với multipart/form-data
 * @param url - API endpoint
 * @param formData - FormData object
 * @param isAuth - Có cần check authentication không (mặc định: true)
 */
export async function postFormData<T = any, R = any>(
  url: string,
  formData: T,
  isAuth: boolean = true,
): Promise<AxiosResponse<R> | null> {
  const myRequest: AxiosRequestConfig = {
    method: "post",
    url,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  };

  const response = await axios(myRequest);
  return checkTokenExpired<R>(response, isAuth);
}

// ==========================================
// PUT REQUEST - FORM DATA
// ==========================================

/**
 * PUT request với multipart/form-data
 * @param url - API endpoint
 * @param formData - FormData object
 * @param isAuth - Có cần check authentication không (mặc định: true)
 */
export async function putFormData<T = any, R = any>(
  url: string,
  formData: T,
  isAuth: boolean = true,
): Promise<AxiosResponse<R> | null> {
  const myRequest: AxiosRequestConfig = {
    method: "put",
    url,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  };

  const response = await axios(myRequest);
  return checkTokenExpired<R>(response, isAuth);
}

// ==========================================
// UTILITIES
// ==========================================

/**
 * Kiểm tra network status
 */
export function checkNetworkStatus(): boolean {
  const status = isOnline();
  return status;
}

/**
 * Tạo FormData từ object (helper function)
 */
export function createFormData(data: Record<string, any>): FormData {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Xử lý file objects
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    }
    // Xử lý arrays
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    }
    // Xử lý objects
    else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
    }
    // Xử lý primitive values
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

// ==========================================
// AXIOS INSTANCE WITH INTERCEPTORS
// ==========================================

// Request interceptor để tự động thêm token vào headers
axios.interceptors.request.use(
  async (config) => {
    try {
      // Check if Authorization header already exists (e.g., set by login)
      if (config.headers?.Authorization) {
        return config;
      }

      // Get token from storage
      const token = await StorageService.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (!token) {
        console.warn("⚠️ [ACCESS TOKEN] No token found in storage");
      }
    } catch (error) {
      console.error("❌ [ACCESS TOKEN] Error retrieving token:", error);
      // Silent error - don't block request
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor để log errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling
    return Promise.reject(error);
  },
);
