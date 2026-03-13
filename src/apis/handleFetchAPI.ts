/**
 * API Middleware - Tầng trung gian xử lý kết quả API
 *
 * Chức năng chính:
 * 1. Quản lý phiên đăng nhập (Session Management)
 * 2. Lưu trữ dữ liệu ngoại tuyến (Offline Caching)
 * 3. Xử lý token hết hạn (Token Expiration)
 */

import { AxiosResponse } from "axios";
import { StorageService } from "@/services/storage";
import { STORAGE_KEYS, TOKEN_EXPIRED } from "@/config/Constants";
import { openSnackbar } from "@/config/Function";
import { CODE_401 } from "./StatusCode";

// ==========================================
// TYPES
// ==========================================
interface CachedResponse<T> {
  data: T;
  cachedAt: number; // Timestamp
  url: string;
}

// ==========================================
// CONFIGURATION
// ==========================================
const CACHE_PREFIX = "api_cache_";
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 phút (milliseconds)

// ==========================================
// CACHE MANAGEMENT
// ==========================================

/**
 * Lưu response vào cache với timestamp
 */
async function saveToCache<T>(
  url: string,
  response: AxiosResponse<T>,
): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX}${url}`;
    const cachedData: CachedResponse<T> = {
      data: response.data,
      cachedAt: Date.now(),
      url: url,
    };
    await StorageService.set(cacheKey, JSON.stringify(cachedData));
  } catch (error) {
    console.error(`Failed to cache data for ${url}:`, error);
  }
}

/**
 * Lấy dữ liệu từ cache
 */
async function getFromCache<T>(url: string): Promise<AxiosResponse<T> | null> {
  try {
    const cacheKey = `${CACHE_PREFIX}${url}`;
    const cachedString = await StorageService.get<string>(cacheKey);

    if (!cachedString) {
      return null;
    }

    const cached: CachedResponse<T> = JSON.parse(cachedString);
    const now = Date.now();

    // Kiểm tra cache đã hết hạn chưa
    if (now - cached.cachedAt > CACHE_EXPIRY_TIME) {
      await StorageService.remove(cacheKey);
      return null;
    }

    // Trả về giả lập AxiosResponse
    return {
      data: cached.data,
      status: 200,
      statusText: "OK (from cache)",
      headers: {},
      config: {} as any,
    } as AxiosResponse<T>;
  } catch (error) {
    console.error(`Failed to get cached data for ${url}:`, error);
    return null;
  }
}

/**
 * Xóa cache cũ (có thể gọi định kỳ)
 */
export async function clearExpiredCache(): Promise<void> {
  try {
    // Note: Zalo Mini App storage không có listKeys,
    // nên cần track cache keys riêng hoặc clear all khi logout
  } catch (error) {
    console.error("Failed to clear expired cache:", error);
  }
}

// ==========================================
// SESSION MANAGEMENT
// ==========================================

/**
 * Xử lý khi token hết hạn
 */
export const handleTokenExpire = async (): Promise<void> => {
  try {
    // Xóa toàn bộ dữ liệu người dùng
    await StorageService.removeMultiple([
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.USER_NAME,
      STORAGE_KEYS.USER_AVATAR,
      STORAGE_KEYS.USER_ROLE,
      STORAGE_KEYS.USER_TEAM,
      STORAGE_KEYS.IS_LOGGED_IN,
      STORAGE_KEYS.MORNING_CHECK_IN,
      STORAGE_KEYS.MORNING_CHECK_OUT,
      STORAGE_KEYS.AFTERNOON_CHECK_IN,
      STORAGE_KEYS.AFTERNOON_CHECK_OUT,
    ]);

    // Hiển thị thông báo
    openSnackbar({
      text: "Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại",
      type: "error",
      duration: 3000,
    });

    // Chuyển về trang login sau 1 giây
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  } catch (error) {
    console.error("Error handling token expiration:", error);
  }
};

/**
 * Kiểm tra token đã hết hạn chưa
 */
export function checkTokenExpired<T>(
  response: AxiosResponse<T>,
  isAuth: boolean = true,
): AxiosResponse<T> | null {
  if (!response) {
    return null;
  }

  // Kiểm tra status code token expired
  const isExpired =
    response.status === TOKEN_EXPIRED || response.status === CODE_401;

  if (isAuth && isExpired) {
    console.warn("Token expired detected:", response.status);
    handleTokenExpire();
    return null;
  }

  return response;
}

// ==========================================
// GET API WITH CACHE
// ==========================================

/**
 * Xử lý GET API với cache fallback
 * - Nếu có response từ server: lưu cache và trả về
 * - Nếu lỗi: thử lấy từ cache
 * - Nếu token expired: xử lý logout
 */
export async function handleGetAPI<T>(
  response: AxiosResponse<T> | null,
  isAuth: boolean = true,
  url: string,
): Promise<AxiosResponse<T> | null> {
  // Kiểm tra token expired trước
  if (response && isAuth) {
    const checkedResponse = checkTokenExpired(response, isAuth);
    if (!checkedResponse) {
      return null; // Token expired, đã xử lý logout
    }
  }

  // Nếu có response hợp lệ
  if (response && response.data) {
    // Lưu vào cache
    await saveToCache(url, response);
    return response;
  }

  // Nếu không có response, thử lấy từ cache
  return await getFromCache<T>(url);
}

/**
 * Lấy dữ liệu từ cache local (public export)
 */
export async function getDataFromLocal<T>(
  url: string,
): Promise<AxiosResponse<T> | null> {
  return await getFromCache<T>(url);
}

// ==========================================
// POST/PUT/DELETE API
// ==========================================

/**
 * Xử lý POST/PUT/DELETE API
 * - Không cache
 * - Chỉ kiểm tra token expired
 */
export async function handleMutationAPI<T>(
  response: AxiosResponse<T> | null,
  isAuth: boolean = true,
): Promise<AxiosResponse<T> | null> {
  if (!response) {
    return null;
  }

  // Kiểm tra token expired
  return checkTokenExpired(response, isAuth);
}

// ==========================================
// UTILITIES
// ==========================================

/**
 * Xóa toàn bộ cache khi logout
 */
export async function clearAllCache(): Promise<void> {
  try {
    // Note: Cần implement cách track cache keys
    // hoặc clear storage khi logout
  } catch (error) {
    console.error("Failed to clear all cache:", error);
  }
}

/**
 * Kiểm tra connection status
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Log cache info (for debugging)
 */
export async function logCacheInfo(url: string): Promise<void> {
  const cached = await getFromCache(url);
  if (cached) {
    // Cache exists
  } else {
    // No cache
  }
}
