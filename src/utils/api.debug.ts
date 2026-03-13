/**
 * API Debug Utility - Giúp debug vấn đề API
 */

import url from "@/apis/url";
import { NetworkSetting } from "@/config/Settting";

/**
 * Log tất cả endpoints liên quan đến điểm danh
 */
export function logAllAttendanceEndpoints() {
  console.log("📋 Tất cả endpoints điểm danh:");
  console.log("   1. CHECKIN_NEW:", url.CHECKIN_NEW);
  console.log("   2. CHECKOUT_NEW:", url.CHECKOUT_NEW);
  console.log("   3. CANH_BAO_CHECK_IN:", url.CANH_BAO_CHECK_IN);
  console.log("   4. CANH_BAO_CHECK_OUT:", url.CANH_BAO_CHECK_OUT);
  console.log("   5. ATTENDANCE_STATUS (old):", url.ATTENDANCE_STATUS);
  console.log("\n📍 Base URL:");
  console.log("   - NEWROOT_DEV:", NetworkSetting.NEWROOT_DEV);
  console.log("   - ROOT:", NetworkSetting.ROOT);
}

/**
 * Test API endpoint
 */
export async function testAttendanceAPI() {
  console.log("🧪 API /diem-danh-that/me đã bị loại bỏ khỏi project.");
  console.log(
    "   Dùng debugAPI.fetchDirect(url.CHECKIN_NEW) hoặc endpoint khác để kiểm tra.",
  );

  return null;
}

/**
 * Fetch endpoint URL trực tiếp
 */
export async function fetchEndpointDirect(endpoint: string) {
  console.log(`🔗 Fetching endpoint: ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("📊 Direct fetch response:");
    console.log("   - Status:", response.status);
    console.log("   - Status Text:", response.statusText);

    const data = await response.text();
    console.log("   - Data:", data);

    return {
      status: response.status,
      statusText: response.statusText,
      data,
    };
  } catch (error: any) {
    console.error("❌ Direct fetch error:", error);
    return null;
  }
}

/**
 * Inspector - Hiển thị tất cả endpoint info
 */
export function inspectEndpoints() {
  console.clear();
  console.log("🔍 API ENDPOINT INSPECTOR");
  console.log("========================\n");

  logAllAttendanceEndpoints();

  console.log("\n⚠️  Để test API, chạy:");
  console.log("   window.debugAPI.testAttendanceAPI()");
  console.log("\n📌 Để fetch endpoint trực tiếp, chạy:");
  console.log(
    '   window.debugAPI.fetchEndpointDirect("' + url.CHECKIN_NEW + '")',
  );
}

/**
 * Expose to window for easy access in console
 */
if (typeof window !== "undefined") {
  (window as any).debugAPI = {
    logEndpoints: logAllAttendanceEndpoints,
    testAPI: testAttendanceAPI,
    fetchDirect: fetchEndpointDirect,
    inspect: inspectEndpoints,
  };
}

export const apiDebug = {
  logEndpoints: logAllAttendanceEndpoints,
  testAPI: testAttendanceAPI,
  fetchDirect: fetchEndpointDirect,
  inspect: inspectEndpoints,
};
