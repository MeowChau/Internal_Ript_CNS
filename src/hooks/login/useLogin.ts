import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// API
import { postDangNhapNew, getUserInfoNew } from "@/apis/user";

// Services
import { StorageService } from "@/services/storage";

// Validation
import { validateRequired } from "@/utils/validation.utils";

// Config
import { STORAGE_KEYS } from "@/config/Constants";

// Types
import { Account } from "@/interfaces";

interface LoginFormData {
  username: string;
  password: string;
}

interface ValidationErrors {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
    data: {
      accessToken: string;
      user: Account;
    };
  };
}

/**
 * Hook xử lý logic đăng nhập
 * Tách biệt logic khỏi UI component
 */
export const useLogin = () => {
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    username: "",
    password: "",
  });

  // Device info (placeholder - có thể mở rộng sau)
  const deviceId = useRef<string>("");
  const oneSignalId = useRef<string>("");

  /**
   * Kiểm tra ký tự đặc biệt
   * Dựa theo code React Native: checkSpecialCharacterExistence
   */
  const checkSpecialCharacter = (text: string): boolean => {
    // Regex: chỉ cho phép chữ cái, số, dấu chấm, gạch dưới
    const specialCharRegex = /[^a-zA-Z0-9._]/;
    return specialCharRegex.test(text);
  };

  /**
   * Validate form input
   * @returns true nếu valid, false nếu có lỗi
   */
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {
      username: "",
      password: "",
    };

    // Check empty
    if (!validateRequired(username)) {
      errors.username = "Vui lòng nhập tên đăng nhập";
    }
    if (!validateRequired(password)) {
      errors.password = "Vui lòng nhập mật khẩu";
    }

    // Check special characters (chỉ cho username)
    if (username && checkSpecialCharacter(username.trim())) {
      errors.username = "Tên đăng nhập không được chứa ký tự đặc biệt";
    }

    // Note: Theo code mẫu, password không check special character nữa
    // if (password && checkSpecialCharacter(password.trim())) {
    //   errors.password = "Mật khẩu không được chứa ký tự đặc biệt";
    // }

    setValidationErrors(errors);

    // Return true nếu không có lỗi
    return !errors.username && !errors.password;
  };

  /**
   * Clear validation errors
   */
  const clearValidationErrors = () => {
    setValidationErrors({
      username: "",
      password: "",
    });
  };

  /**
   * Clear all errors
   */
  const clearErrors = () => {
    setError("");
    clearValidationErrors();
  };

  /**
   * Xử lý đăng nhập
   */
  const handleLogin = async () => {
    // Clear previous errors
    clearErrors();

    // Validate form
    if (!validateForm()) {
      return;
    }

    const startTime = Date.now();
    setLoading(true);

    try {
      // Prepare request body
      const loginData = {
        username: username.toLowerCase().trim(),
        password: password,
        deviceId: deviceId.current || "",
        oneSignalId: oneSignalId.current || "",
      };

      // Call API
      const response = await postDangNhapNew(loginData);

      // Extract data từ response
      const accessToken = response?.data?.data?.accessToken;
      const userInfo = response?.data?.data?.user;

      if (!accessToken) {
        throw new Error("Tên đăng nhập hoặc mật khẩu chưa đúng");
      }

      // Set axios default header cho các request sau
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // Save token to storage FIRST before calling getUserInfoNew
      await StorageService.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      await StorageService.set(STORAGE_KEYS.IS_LOGGED_IN, true);

      // Nếu login response không có user info, gọi API /user/me
      let finalUserInfo = userInfo;
      if (!userInfo || (!userInfo.name && !userInfo.ten)) {
        try {
          const userResponse = await getUserInfoNew();

          // Extract user data - handle nested {user: {...}} structure
          let rawData = userResponse?.data?.data || userResponse?.data;

          // If data has .user property, extract it
          if (rawData?.user) {
            finalUserInfo = rawData.user;
          } else {
            finalUserInfo = rawData;
          }
        } catch (err: any) {
          // Continue with empty user info - will use defaults
        }
      }

      // Parse user info from API (snake_case fields)
      // API uses MongoDB _id and profile.name field
      const user = {
        id:
          finalUserInfo?._id?.toString() ||
          finalUserInfo?.tai_khoan_id ||
          finalUserInfo?.taiKhoanId ||
          finalUserInfo?.id ||
          "",
        name:
          finalUserInfo?.profile?.name ||
          finalUserInfo?.name ||
          finalUserInfo?.ten ||
          finalUserInfo?.ten_dang_nhap ||
          "User",
        username:
          finalUserInfo?.ten_dang_nhap ||
          finalUserInfo?.tenDangNhap ||
          username.trim(),
        role:
          finalUserInfo?.profile?.role ||
          finalUserInfo?.vai_tro ||
          finalUserInfo?.chuc_vu ||
          finalUserInfo?.role ||
          (finalUserInfo?.loai_nhan_vien === "part_time"
            ? "Nhân viên Parttime"
            : "Nhân viên Fulltime"),
        team:
          finalUserInfo?.profile?.team ||
          finalUserInfo?.doi ||
          finalUserInfo?.nhom ||
          finalUserInfo?.team ||
          "Chưa cập nhật",
        avatar:
          finalUserInfo?.profile?.avatar ||
          finalUserInfo?.anh_dai_dien ||
          finalUserInfo?.anhDaiDien ||
          finalUserInfo?.avatar ||
          "",
        phone:
          finalUserInfo?.so_dien_thoai ||
          finalUserInfo?.soDienThoai ||
          finalUserInfo?.phone ||
          "",
      };

      // Save to storage - BOTH raw data and parsed fields
      await StorageService.setMultiple({
        [STORAGE_KEYS.ACCESS_TOKEN]: accessToken,
        [STORAGE_KEYS.USER_INFO]: JSON.stringify(finalUserInfo || {}),
        [STORAGE_KEYS.USERNAME]: username.trim(),
        [STORAGE_KEYS.IS_LOGGED_IN]: true,
        [STORAGE_KEYS.USER_ID]: user.id,
        [STORAGE_KEYS.USER_NAME]: user.name,
        [STORAGE_KEYS.USER_AVATAR]: user.avatar,
        [STORAGE_KEYS.USER_ROLE]: user.role,
        [STORAGE_KEYS.USER_TEAM]: user.team,
      });

      // Spinner hiển thị tối thiểu 1s trước khi chuyển trang
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1000 - elapsed);
      setTimeout(() => {
        navigate("/home");
      }, remaining);
    } catch (err: any) {
      // Extract error message
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Tên đăng nhập hoặc mật khẩu chưa đúng";

      console.error("Login error:", err);

      // Spinner hiển thị tối thiểu 1s trước khi ẩn và hiện modal lỗi
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1000 - elapsed);
      setTimeout(() => {
        setLoading(false);
        setError(errorMessage);
      }, remaining);
    }
  };

  /**
   * Update username
   */
  const updateUsername = (value: string) => {
    setUsername(value);
    // Clear validation error when user types
    if (validationErrors.username) {
      setValidationErrors((prev) => ({ ...prev, username: "" }));
    }
  };

  /**
   * Update password
   */
  const updatePassword = (value: string) => {
    setPassword(value);
    // Clear validation error when user types
    if (validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  /**
   * Load saved username từ storage (khi component mount)
   */
  const loadSavedUsername = async () => {
    try {
      const savedUsername = await StorageService.get<string>(
        STORAGE_KEYS.USERNAME,
      );
      if (savedUsername) {
        setUsername(savedUsername);
      }
    } catch (error) {
      console.error("Error loading saved username:", error);
    }
  };

  return {
    // State
    username,
    password,
    loading,
    error,
    validationErrors,

    // Actions
    setUsername: updateUsername,
    setPassword: updatePassword,
    handleLogin,
    clearErrors,
    loadSavedUsername,
  };
};
