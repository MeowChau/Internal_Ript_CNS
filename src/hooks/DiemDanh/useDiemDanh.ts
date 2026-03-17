import { useState, useCallback, useEffect } from "react";
import {
  postCheckInNew,
  postCheckOutNew,
  postWarningCheckInNew,
  postWarningCheckOutNew,
  getThietBiDinhDanh,
  postThietBiDinhDanh,
  getThoigianLamViec,
} from "@/apis/user";
import * as zmpApis from "zmp-sdk/apis";
import { openSnackbar } from "@/config/Function";

// Import zmp-sdk for storage
let getStorage: any;
let setStorage: any;
try {
  getStorage = zmpApis.getStorage;
  setStorage = zmpApis.setStorage;
} catch (e) {
  console.warn("ZMP SDK not available in this environment");
}

export const LOAI_DIEM_DANH = {
  CHECK_IN: "CHECK_IN",
  CHECK_OUT: "CHECK_OUT",
} as const;

export const TYPE_DIEM_DANH = {
  NORMAL: 0,
  OT: 1,
  XIN_LAM_THEM: 2,
  XIN_NGHI: 3,
  VE_SOM: 4,
} as const;

export const BUOI_TRONG_NGAY = {
  SANG: "sang",
  CHIEU: "chieu",
} as const;

const TEST_FALLBACK_LOCATION = {
  latitude: 10.762622,
  longitude: 106.660172,
};

export interface BuoiDiemDanh {
  thoi_gian_check_in?: string | false;
  thoi_gian_check_out?: string | false;
  trang_thai_check_in?: string;
  trang_thai_check_out?: string;
  thoiGianCheckIn?: string;
  thoiGianCheckOut?: string;
  trangThaiCheckIn?: boolean;
  trangThaiCheckOut?: boolean;
  danh_gia_thoi_gian_lam_viec?: number;
  // Other fields that might be in the API response
  thoiGianBatDau?: string;
  thoiGianKetThuc?: string;
  trang_thai_lam_viec?: string;
  buoi_lam_viec?: string;
  ngay?: number;
}

export interface ThongTinDiemDanh {
  sang: BuoiDiemDanh;
  chieu: BuoiDiemDanh;
  buoi_lam_viec: string;
}

export interface WarningResponse {
  value: number;
  message: string;
  warning?: string;
}

export interface DiemDanhResponse {
  thoiGianCheckIn?: string;
  thoiGianCheckOut?: string;
  trangThaiGioLamCheckIn?: string;
  trangThaiGioLamCheckOut?: string;
  buoiDiemDanh?: string;
  message?: string;
  thoi_gian_check_in?: string;
  thoi_gian_check_out?: string;
}

export interface DiemDanhResult {
  success: boolean;
  data?: DiemDanhResponse;
  error?: string;
  warningData?: WarningResponse;
}

const logAttendanceApiError = (context: string, error: any, body?: any) => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const message = String(data?.message || data?.detail || "").toLowerCase();
  const method = error?.config?.method;
  const url = error?.config?.url;

  console.error(`❌ [${context}] API error`, error);
  console.error(`   - Status: ${status || "unknown"}`);
  console.error(`   - Method: ${method || "unknown"}`);
  console.error(`   - URL: ${url || "unknown"}`);
  console.error("   - Response data:", data);
  if (body) {
    console.error("   - Request body:", body);
  }

  if (status === 403) {
    console.warn(
      "⚠️ 403 thường là do policy backend (vị trí/IP/network/quyền tài khoản)",
    );
  }
  if (status === 409) {
    if (message.includes("wifi") || message.includes("wi-fi")) {
      console.warn("⚠️ Backend yêu cầu dùng Wi-Fi công ty để điểm danh");
    } else {
      console.warn("⚠️ 409 là xung đột trạng thái check-in/check-out");
    }
  }
};

export const useDiemDanh = () => {
  const SKIP_ATTENDANCE_STATUS_API = true;
  // Temporary switch: skip device-id validation/registration before attendance.
  const SKIP_DEVICE_ID_VALIDATION = true;

  const [loading, setLoading] = useState(false);
  const [thongTinDiemDanh, setThongTinDiemDanh] =
    useState<ThongTinDiemDanh | null>(null);
  const [loaiDiemDanh, setLoaiDiemDanh] = useState<"CHECK_IN" | "CHECK_OUT">(
    "CHECK_IN",
  );
  const [response, setResponse] = useState<DiemDanhResponse | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const [warningData, setWarningData] = useState<WarningResponse | null>(null);

  // ============================================
  // LOAD INITIAL DATA
  // ============================================
  useEffect(() => {
    void initData();
  }, []);

  const initData = async () => {
    await Promise.all([getDeviceInfo(), loadThongTinDiemDanh()]);
  };

  const getDeviceInfo = async () => {
    try {
      if (!getStorage) {
        // Fallback: use localStorage
        const id = localStorage.getItem("deviceId");
        if (id) {
          setDeviceId(id);
        } else {
          const newId = `zalo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem("deviceId", newId);
          setDeviceId(newId);
        }
        return;
      }

      const result = await getStorage({ keys: ["deviceId"] });
      let id = result.deviceId;

      if (!id) {
        // Generate device ID from browser fingerprint
        id = `zalo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // Lưu lại
        if (setStorage) {
          await setStorage({ data: { deviceId: id } });
        } else {
          localStorage.setItem("deviceId", id);
        }
      }

      setDeviceId(id);
    } catch (error) {
      console.error("Get device ID error:", error);
      // Fallback to localStorage
      const id = `zalo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("deviceId", id);
      setDeviceId(id);
    }
  };

  // ============================================
  // GET THÔNG TIN ĐIỂM DANH TRONG NGÀY (call API mới /thoi-gian-lam-viec)
  // ============================================
  const getThongTinDiemDanhTrongNgay =
    useCallback(async (): Promise<ThongTinDiemDanh | null> => {
      try {
        // Get current date
        const now = new Date();
        const ngay = now.getDate();
        const thang = now.getMonth() + 1;
        const nam = now.getFullYear();

        const res = await getThoigianLamViec(ngay, thang, nam);

        if (res?.status === 200 && res?.data?.data) {
          const data = res.data.data;

          // Construct ThongTinDiemDanh from API response
          const thongTinDiemDanh: ThongTinDiemDanh = {
            sang: data.sang || {},
            chieu: data.chieu || {},
            buoi_lam_viec: now.getHours() < 12 ? "sang" : "chieu",
          };

          return thongTinDiemDanh;
        }

        return null;
      } catch (error: any) {
        console.error("❌ Lỗi khi call API getThoigianLamViec:", error);
        console.error("   - Message:", error?.message);
        console.error("   - Response status:", error?.response?.status);
        console.error("   - Response data:", error?.response?.data);
        return null;
      }
    }, []);

  // ============================================
  // LOAD THÔNG TIN ĐIỂM DANH (cập nhật state)
  // ============================================
  const loadThongTinDiemDanh = useCallback(async () => {
    const data = await getThongTinDiemDanhTrongNgay();

    if (data) {
      setThongTinDiemDanh(data);

      // Xác định loại điểm danh dựa trên thời gian hiện tại
      const now = new Date();
      const currentHour = now.getHours();
      const buoi =
        currentHour < 12 ? BUOI_TRONG_NGAY.SANG : BUOI_TRONG_NGAY.CHIEU;

      const thongTinBuoi =
        buoi === BUOI_TRONG_NGAY.SANG ? data.sang : data.chieu;

      const checkInStatus = thongTinBuoi?.trang_thai_check_in;
      const checkOutStatus = thongTinBuoi?.trang_thai_check_out;

      // Nếu đã check-in (không phải "Chưa Check-in") VÀ chưa check-out ("Chưa Check-out"), set loại là CHECK_OUT
      if (
        checkInStatus !== "Chưa Check-in" &&
        checkOutStatus === "Chưa Check-out"
      ) {
        setLoaiDiemDanh("CHECK_OUT");
      } else if (checkInStatus === "Chưa Check-in") {
        setLoaiDiemDanh("CHECK_IN");
      } else {
        setLoaiDiemDanh("CHECK_IN");
      }
    }
  }, [getThongTinDiemDanhTrongNgay]);

  // ============================================
  // LOAD ATTENDANCE DATA FROM STORAGE (khỏi API)
  // ============================================
  const loadAttendanceDataFromStorage = useCallback(async (): Promise<void> => {
    try {
      const { StorageService } = await import("@/services/storage");
      const { STORAGE_KEYS } = await import("@/config/Constants");

      // Get check-in/check-out times từ storage
      const [
        morningCheckIn,
        afternoonCheckIn,
        morningCheckOut,
        afternoonCheckOut,
      ] = await Promise.all([
        StorageService.get<string>(STORAGE_KEYS.MORNING_CHECK_IN),
        StorageService.get<string>(STORAGE_KEYS.AFTERNOON_CHECK_IN),
        StorageService.get<string>(STORAGE_KEYS.MORNING_CHECK_OUT),
        StorageService.get<string>(STORAGE_KEYS.AFTERNOON_CHECK_OUT),
      ]);

      // Reconstruct thongTinDiemDanh từ storage data
      const attendanceData: ThongTinDiemDanh = {
        sang: {
          thoi_gian_check_in: morningCheckIn || undefined,
          thoi_gian_check_out: morningCheckOut || undefined,
        },
        chieu: {
          thoi_gian_check_in: afternoonCheckIn || undefined,
          thoi_gian_check_out: afternoonCheckOut || undefined,
        },
        buoi_lam_viec: "sang", // Default
      };

      setThongTinDiemDanh(attendanceData);

      // Xác định loại điểm danh (CHECK_IN hay CHECK_OUT)
      const now = new Date();
      const currentHour = now.getHours();
      const isMorning = currentHour < 12;
      const currentBuoi = isMorning
        ? BUOI_TRONG_NGAY.SANG
        : BUOI_TRONG_NGAY.CHIEU;
      const currentBuoiData = isMorning
        ? attendanceData.sang
        : attendanceData.chieu;

      if (
        currentBuoiData?.thoi_gian_check_in &&
        !currentBuoiData?.thoi_gian_check_out
      ) {
        setLoaiDiemDanh("CHECK_OUT");
      } else {
        setLoaiDiemDanh("CHECK_IN");
      }
    } catch (error) {
      console.error("❌ Lỗi load attendance data từ storage:", error);
    }
  }, []);

  // ============================================
  // CHECK THIẾT BỊ (tách từ code React Native cũ)
  // ============================================
  const checkThietBi = useCallback(async (): Promise<{
    success: boolean;
    deviceId?: string;
    message?: string;
  }> => {
    try {
      const id = await getThietBiDinhDanh();

      if (id?.data?.data?.deviceId) {
        return { success: true, deviceId: id.data.data.deviceId };
      } else {
        return {
          success: false,
          message: "Bạn chưa có thiết bị định danh bạn có muốn đăng ký?",
        };
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi check thiết bị:", error);
      return {
        success: false,
        message: "Có lỗi xảy ra vui lòng thử lại",
      };
    }
  }, []);

  // ============================================
  // ĐĂNG KÝ THIẾT BỊ (tách từ code React Native cũ)
  // ============================================
  const dangKiThietBi = useCallback(async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      await postThietBiDinhDanh(deviceId);
      return { success: true };
    } catch (error: any) {
      console.error("❌ Lỗi đăng ký thiết bị:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Đăng ký thiết bị thất bại",
      };
    }
  }, [deviceId]);

  // ============================================
  // CHECK KHUNG GIỜ HỢP LỆ
  // ============================================
  const checkValidAttendanceTime = useCallback((): {
    valid: boolean;
    message?: string;
  } => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Khung giờ hợp lệ:
    // Sáng: 7:00 - 12:59
    // Chiều: 13:00 - 19:00
    const morningStart = 7 * 60; // 7:00
    const morningEnd = 12 * 60 + 59; // 12:59
    const afternoonStart = 13 * 60; // 13:00
    const afternoonEnd = 19 * 60; // 19:00

    const isInMorningWindow =
      currentTimeInMinutes >= morningStart &&
      currentTimeInMinutes <= morningEnd;
    const isInAfternoonWindow =
      currentTimeInMinutes >= afternoonStart &&
      currentTimeInMinutes <= afternoonEnd;

    if (!isInMorningWindow && !isInAfternoonWindow) {
      return {
        valid: false,
        message: "Ngoài thời gian điểm danh",
      };
    }

    return { valid: true };
  }, []);

  // ============================================
  // CHECK THỜI ĐIỂM ĐIỂM DANH (tách từ code React Native cũ)
  // ============================================
  const checkThoiDiemDiemDanh = useCallback(async (): Promise<{
    success: boolean;
    canCheckIn: boolean;
    message?: string;
  }> => {
    try {
      if (SKIP_ATTENDANCE_STATUS_API) {
        const canCheckIn = loaiDiemDanh === "CHECK_IN";
        return {
          success: true,
          canCheckIn,
          message: canCheckIn ? "Có thể check-in" : "Có thể check-out",
        };
      }

      // Refresh data trước
      await loadThongTinDiemDanh();

      const buoiDiemDanh = thongTinDiemDanh?.buoi_lam_viec ?? "";

      if (buoiDiemDanh === "") {
        return {
          success: false,
          canCheckIn: false,
          message: "Buổi làm chưa được tạo",
        };
      }

      const thongTinBuoi =
        buoiDiemDanh === BUOI_TRONG_NGAY.SANG
          ? thongTinDiemDanh?.sang
          : thongTinDiemDanh?.chieu;

      const checkInStatus = thongTinBuoi?.trang_thai_check_in;
      const checkOutStatus = thongTinBuoi?.trang_thai_check_out;

      // Kiểm tra đã hoàn thành điểm danh chưa (đã check-out)
      if (checkOutStatus !== "Chưa Check-out" && checkOutStatus) {
        return {
          success: false,
          canCheckIn: false,
          message: "Bạn đã hoàn thành điểm danh cho buổi này",
        };
      }

      // Nếu đã check-in VÀ chưa check-out → cho phép check-out
      // Nếu chưa check-in → cho phép check-in
      const canCheckIn = checkInStatus === "Chưa Check-in";

      return {
        success: true,
        canCheckIn,
        message: canCheckIn ? "Có thể check-in" : "Có thể check-out",
      };
    } catch (error: any) {
      console.error("❌ Lỗi check thời điểm điểm danh:", error);
      return {
        success: false,
        canCheckIn: false,
        message: "Có lỗi xảy ra khi kiểm tra thời điểm điểm danh",
      };
    }
  }, [
    SKIP_ATTENDANCE_STATUS_API,
    loaiDiemDanh,
    thongTinDiemDanh,
    loadThongTinDiemDanh,
  ]);

  // ============================================
  // ĐIỂM DANH (tách từ code React Native cũ)
  // ============================================
  const diemDanh = useCallback(
    async (body: any, isCheckIn: boolean): Promise<DiemDanhResult> => {
      try {
        const res = isCheckIn
          ? await postCheckInNew(body)
          : await postCheckOutNew(body);

        if (res && res.status === 200 && res.data) {
          const responseData = res.data.data || res.data;

          const targetBuoi =
            body?.buoi === BUOI_TRONG_NGAY.CHIEU
              ? BUOI_TRONG_NGAY.CHIEU
              : BUOI_TRONG_NGAY.SANG;

          // Update local thongTinDiemDanh immediately so UI reflects new time without refresh
          setThongTinDiemDanh((prev) => {
            const baseState: ThongTinDiemDanh =
              prev ||
              ({
                sang: {},
                chieu: {},
                buoi_lam_viec: targetBuoi,
              } as ThongTinDiemDanh);

            const currentBuoiData =
              targetBuoi === BUOI_TRONG_NGAY.SANG
                ? baseState.sang
                : baseState.chieu;

            return {
              ...baseState,
              buoi_lam_viec: targetBuoi,
              [targetBuoi]: {
                ...currentBuoiData,
                thoi_gian_check_in: isCheckIn
                  ? responseData.thoiGianCheckIn ||
                    responseData.thoi_gian_check_in ||
                    currentBuoiData?.thoi_gian_check_in
                  : currentBuoiData?.thoi_gian_check_in,
                thoi_gian_check_out: !isCheckIn
                  ? responseData.thoiGianCheckOut ||
                    responseData.thoi_gian_check_out ||
                    currentBuoiData?.thoi_gian_check_out
                  : currentBuoiData?.thoi_gian_check_out,
              },
            };
          });

          // Persist to storage for consistency with other attendance consumers
          try {
            const { StorageService } = await import("@/services/storage");
            const { STORAGE_KEYS } = await import("@/config/Constants");

            const key = isCheckIn
              ? targetBuoi === BUOI_TRONG_NGAY.SANG
                ? STORAGE_KEYS.MORNING_CHECK_IN
                : STORAGE_KEYS.AFTERNOON_CHECK_IN
              : targetBuoi === BUOI_TRONG_NGAY.SANG
                ? STORAGE_KEYS.MORNING_CHECK_OUT
                : STORAGE_KEYS.AFTERNOON_CHECK_OUT;

            const value = isCheckIn
              ? responseData.thoiGianCheckIn || responseData.thoi_gian_check_in
              : responseData.thoiGianCheckOut ||
                responseData.thoi_gian_check_out;

            if (value) {
              await StorageService.set(key, value);
            }
          } catch {
            // Ignore storage sync errors to avoid blocking UI update
          }

          // Toggle local mode so user can check-out after a successful check-in,
          // even when attendance status endpoint is unavailable.
          setLoaiDiemDanh(isCheckIn ? "CHECK_OUT" : "CHECK_IN");

          return {
            success: true,
            data: responseData,
          };
        }

        return { success: false, error: "Điểm danh thất bại" };
      } catch (error: any) {
        logAttendanceApiError(
          isCheckIn ? "CHECK_IN" : "CHECK_OUT",
          error,
          body,
        );

        if (error?.response?.status === 409) {
          const conflictMessage =
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            (isCheckIn
              ? "Bạn đã check-in trước đó, vui lòng thử check-out"
              : "Bạn chưa check-in, vui lòng thử check-in");

          const normalizedMessage = String(conflictMessage).toLowerCase();
          const isWifiPolicyError =
            normalizedMessage.includes("wifi") ||
            normalizedMessage.includes("wi-fi") ||
            normalizedMessage.includes("mạng công ty") ||
            normalizedMessage.includes("mang cong ty");

          // Only flip local mode for true state conflict.
          // If 409 is from Wi-Fi policy, keep current mode unchanged.
          if (!isWifiPolicyError) {
            setLoaiDiemDanh(isCheckIn ? "CHECK_OUT" : "CHECK_IN");
          }

          return { success: false, error: conflictMessage };
        }

        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          "Có lỗi xảy ra khi điểm danh";

        return { success: false, error: errorMessage };
      }
    },
    [],
  );

  // ============================================
  // HANDLE THÔNG BÁO (tách từ code React Native cũ)
  // ============================================
  const handleThongBao = useCallback(
    async (
      warningResponse: any,
      body: any,
      isCheckIn: boolean,
    ): Promise<DiemDanhResult> => {
      try {
        const warningData = warningResponse?.data?.data;
        if (!warningData) {
          // Không có warning, tiến hành điểm danh bình thường
          return await diemDanh(body, isCheckIn);
        }

        const warningValue = warningData.value;

        switch (warningValue) {
          case TYPE_DIEM_DANH.NORMAL:
            // Điểm danh bình thường
            return await diemDanh(body, isCheckIn);

          case TYPE_DIEM_DANH.OT:
            // Cần xác nhận OT
            return {
              success: true,
              warningData: {
                value: TYPE_DIEM_DANH.OT,
                message:
                  warningData.message ||
                  "Bạn đang điểm danh ngoài giờ. Có muốn gửi đơn OT không?",
              },
            };

          case TYPE_DIEM_DANH.XIN_LAM_THEM:
            // Cần xác nhận làm thêm
            return {
              success: true,
              warningData: {
                value: TYPE_DIEM_DANH.XIN_LAM_THEM,
                message: warningData.message || "Bạn cần đăng ký làm thêm giờ.",
              },
            };

          case TYPE_DIEM_DANH.XIN_NGHI:
            // Cần xác nhận xin nghỉ
            return {
              success: true,
              warningData: {
                value: TYPE_DIEM_DANH.XIN_NGHI,
                message:
                  warningData.message ||
                  "Bạn đang điểm danh muộn. Có muốn đăng ký nghỉ không?",
              },
            };

          case TYPE_DIEM_DANH.VE_SOM:
            // Cần xác nhận về sớm
            return {
              success: true,
              warningData: {
                value: TYPE_DIEM_DANH.VE_SOM,
                message:
                  warningData.message ||
                  "Bạn đang về sớm. Có muốn đăng ký về sớm không?",
              },
            };

          default:
            // Điểm danh bình thường
            return await diemDanh(body, isCheckIn);
        }
      } catch (error: any) {
        console.error("❌ Lỗi handle thông báo:", error);
        return {
          success: false,
          error: error?.response?.data?.message || "Có lỗi xảy ra",
        };
      }
    },
    [diemDanh],
  );

  // ============================================
  // STEP 2: GET LOCATION
  // ============================================
  const getCurrentLocation = useCallback((): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        if (SKIP_ATTENDANCE_STATUS_API) {
          console.warn(
            "Geolocation không khả dụng, dùng tọa độ fallback để test điểm danh",
          );
          openSnackbar({
            text: "Không lấy được GPS, đang dùng vị trí test",
            type: "warning",
          });
          resolve(TEST_FALLBACK_LOCATION);
          return;
        }

        reject(new Error("Trình duyệt không hỗ trợ geolocation"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          if (SKIP_ATTENDANCE_STATUS_API) {
            console.warn(
              "Geolocation bị chặn, dùng tọa độ fallback để test điểm danh:",
              error,
            );
            openSnackbar({
              text: "Không lấy được GPS, đang dùng vị trí test",
              type: "warning",
            });
            resolve(TEST_FALLBACK_LOCATION);
            return;
          }

          reject(new Error("Không thể lấy vị trí: " + error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
        },
      );
    });
  }, [SKIP_ATTENDANCE_STATUS_API]);

  // ============================================
  // MAIN: HANDLE ĐIỂM DANH (tách từ code React Native cũ)
  // ============================================
  const handleDiemDanh = useCallback(async (): Promise<DiemDanhResult> => {
    try {
      setLoading(true);

      // Step 0: Check khung giờ hợp lệ
      const timeValidation = checkValidAttendanceTime();
      if (!timeValidation.valid) {
        setLoading(false);
        return {
          success: false,
          error: timeValidation.message,
        };
      }

      // Step 1: Check thiết bị (tạm thời có thể bỏ qua bằng feature flag)
      if (!SKIP_DEVICE_ID_VALIDATION) {
        const deviceCheck = await checkThietBi();
        if (!deviceCheck.success) {
          if (deviceCheck.message?.includes("Bạn chưa có thiết bị định danh")) {
            // Tự động đăng ký thiết bị
            const registerResult = await dangKiThietBi();
            if (!registerResult.success) {
              setLoading(false);
              return { success: false, error: registerResult.message };
            }
          } else {
            setLoading(false);
            return { success: false, error: deviceCheck.message };
          }
        }
      }

      // Step 2: Check thời điểm điểm danh
      const timeCheck = await checkThoiDiemDiemDanh();
      if (!timeCheck.success) {
        setLoading(false);
        return { success: false, error: timeCheck.message };
      }

      const isCheckIn = timeCheck.canCheckIn;

      // Step 3: Get location
      const location = await getCurrentLocation();

      // Step 4: Chuẩn bị body request
      const buoiLamViec =
        thongTinDiemDanh?.buoi_lam_viec ||
        (new Date().getHours() < 12
          ? BUOI_TRONG_NGAY.SANG
          : BUOI_TRONG_NGAY.CHIEU);
      const body = {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now(),
        buoi: buoiLamViec, // Required field: "sang" hoặc "chieu"
      };

      // Step 5: Gọi API điểm danh với warning handling
      const result = await handleThongBao(null, body, isCheckIn);

      setLoading(false);

      if (result.success) {
        if (result.warningData) {
          // Có warning, trả về để UI xử lý
          setWarningData(result.warningData);
          return result;
        } else {
          // Điểm danh thành công
          setResponse(result.data || null);
          setShowResultModal(true);
          return { success: true, data: result.data };
        }
      } else {
        return result;
      }
    } catch (error: any) {
      logAttendanceApiError("HANDLE_DIEM_DANH", error);
      setLoading(false);
      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Có lỗi xảy ra khi điểm danh",
      };
    }
  }, [
    SKIP_DEVICE_ID_VALIDATION,
    checkThietBi,
    dangKiThietBi,
    checkThoiDiemDiemDanh,
    handleThongBao,
    thongTinDiemDanh,
    getCurrentLocation,
  ]);

  // ============================================
  // EXECUTE ĐIỂM DANH (sau khi xác nhận)
  // ============================================
  const executeDiemDanh = useCallback(async (): Promise<DiemDanhResult> => {
    try {
      setLoading(true);

      const location = await getCurrentLocation();

      // Xác định check-in hay check-out
      const currentHour = new Date().getHours();
      const isCheckIn = loaiDiemDanh === "CHECK_IN";

      const buoiLamViec =
        thongTinDiemDanh?.buoi_lam_viec ||
        (new Date().getHours() < 12
          ? BUOI_TRONG_NGAY.SANG
          : BUOI_TRONG_NGAY.CHIEU);
      const body = {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now(),
        buoi: buoiLamViec, // Required field
      };

      const res = isCheckIn
        ? await postCheckInNew(body)
        : await postCheckOutNew(body);

      setLoading(false);

      if (res && res.status === 200 && res.data) {
        const responseData = res.data.data || res.data;

        // Lưu vào localStorage
        try {
          const { StorageService } = await import("@/services/storage");
          const { STORAGE_KEYS } = await import("@/config/Constants");

          // Xác định buổi dựa trên giờ hiện tại
          const isMorning = currentHour < 12;

          if (isCheckIn && responseData.thoiGianCheckIn) {
            const key = isMorning
              ? STORAGE_KEYS.MORNING_CHECK_IN
              : STORAGE_KEYS.AFTERNOON_CHECK_IN;
            await StorageService.set(key, responseData.thoiGianCheckIn);
          } else if (!isCheckIn && responseData.thoiGianCheckOut) {
            const key = isMorning
              ? STORAGE_KEYS.MORNING_CHECK_OUT
              : STORAGE_KEYS.AFTERNOON_CHECK_OUT;
            await StorageService.set(key, responseData.thoiGianCheckOut);
          }
        } catch (storageError) {
          console.error("Failed to save to storage:", storageError);
        }

        // Cập nhật thongTinDiemDanh với dữ liệu mới từ response
        const isMorning = currentHour < 12;
        const buoi = isMorning ? BUOI_TRONG_NGAY.SANG : BUOI_TRONG_NGAY.CHIEU;
        setThongTinDiemDanh((prev) => {
          if (!prev) return prev;
          const newState = {
            ...prev,
            [buoi]: {
              ...prev[buoi],
              thoi_gian_check_in: isCheckIn
                ? responseData.thoiGianCheckIn ||
                  responseData.thoi_gian_check_in ||
                  prev[buoi].thoi_gian_check_in
                : prev[buoi].thoi_gian_check_in,
              thoi_gian_check_out: !isCheckIn
                ? responseData.thoiGianCheckOut ||
                  responseData.thoi_gian_check_out ||
                  prev[buoi].thoi_gian_check_out
                : prev[buoi].thoi_gian_check_out,
            },
          };
          return newState;
        });

        setLoaiDiemDanh(isCheckIn ? "CHECK_OUT" : "CHECK_IN");

        setResponse(responseData);
        setShowResultModal(true);

        return {
          success: true,
          data: responseData,
        };
      }

      return { success: false, error: "Điểm danh thất bại" };
    } catch (error: any) {
      setLoading(false);
      logAttendanceApiError(
        loaiDiemDanh === "CHECK_IN" ? "EXECUTE_CHECK_IN" : "EXECUTE_CHECK_OUT",
        error,
      );
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Có lỗi xảy ra khi điểm danh";
      openSnackbar({ text: errorMessage, type: "error" });
      return { success: false, error: errorMessage };
    }
  }, [loaiDiemDanh, getCurrentLocation, thongTinDiemDanh]);

  const closeResultModal = useCallback(() => {
    setShowResultModal(false);
    setResponse(null);
  }, []);

  return {
    loading,
    thongTinDiemDanh,
    loaiDiemDanh,
    response,
    showResultModal,
    warningData,
    handleDiemDanh,
    executeDiemDanh,
    closeResultModal,
    refreshData: loadThongTinDiemDanh,
    loadAttendanceDataFromStorage,
    getThongTinDiemDanhTrongNgay, // Hàm call API trực tiếp
  };
};
