import { authorize, getUserInfo } from "zmp-sdk/apis";
import { getUserInfoNew } from "@/apis/user";
import type { User } from "@/types";
import { STORAGE_KEYS } from "@/config";
import { StorageService } from "./storage";

export const AuthService = {
  async login(): Promise<User> {
    try {
      // Request authorization
      await authorize({ scopes: ["scope.userInfo"] });

      // Get user info
      const result = await getUserInfo({});
      const userInfo = result.userInfo;

      if (!userInfo || !userInfo.id) {
        throw new Error("Không lấy được thông tin người dùng");
      }

      // Create user object
      const user: User = {
        id: userInfo.id,
        name: userInfo.name || "User",
        avatar: userInfo.avatar || "",
        role: "Nhân viên Parttime",
        team: "Chưa cập nhật",
      };

      // Save to storage
      await StorageService.setMultiple({
        [STORAGE_KEYS.USER_ID]: user.id,
        [STORAGE_KEYS.USER_NAME]: user.name,
        [STORAGE_KEYS.USER_AVATAR]: user.avatar,
        [STORAGE_KEYS.USER_ROLE]: user.role,
        [STORAGE_KEYS.USER_TEAM]: user.team,
        [STORAGE_KEYS.IS_LOGGED_IN]: true,
      });

      return user;
    } catch (error: any) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      // Clear all authentication data
      await StorageService.removeMultiple([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.USER_INFO,
        STORAGE_KEYS.USERNAME,
        STORAGE_KEYS.PASSWORD,
        STORAGE_KEYS.IS_LOGGED_IN,
        STORAGE_KEYS.USER_ID,
        STORAGE_KEYS.USER_NAME,
        STORAGE_KEYS.USER_AVATAR,
        STORAGE_KEYS.USER_ROLE,
        STORAGE_KEYS.USER_TEAM,
      ]);
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      // First try to get user info from login (postDangNhapNew)
      const userInfoStr = await StorageService.get<string>(
        STORAGE_KEYS.USER_INFO,
      );

      if (userInfoStr) {
        try {
          let parsedData = JSON.parse(userInfoStr);

          // If stored data has .user property, extract it
          let userInfo = parsedData;
          if (parsedData?.user) {
            userInfo = parsedData.user;
          }

          const user: User = {
            id:
              userInfo._id?.toString() ||
              userInfo.id ||
              userInfo.userId ||
              userInfo.tai_khoan_id ||
              userInfo.taiKhoanId,
            name:
              userInfo.profile?.name ||
              userInfo.name ||
              userInfo.ten ||
              userInfo.fullName ||
              userInfo.ten_dang_nhap,
            username:
              (await StorageService.get<string>(STORAGE_KEYS.USERNAME)) || "",
            avatar:
              userInfo.profile?.avatar ||
              userInfo.anh_dai_dien ||
              userInfo.avatar ||
              userInfo.anhDaiDien ||
              "",
            email: userInfo.email || "",
            phone:
              userInfo.so_dien_thoai ||
              userInfo.phone ||
              userInfo.soDienThoai ||
              "",
            accountId:
              userInfo.tai_khoan_id ||
              userInfo.accountId ||
              userInfo.taiKhoanId ||
              "",
            team:
              userInfo.profile?.team ||
              userInfo.doi ||
              userInfo.nhom ||
              userInfo.team ||
              "Chưa cập nhật",
            role:
              userInfo.profile?.role ||
              userInfo.vai_tro ||
              userInfo.chuc_vu ||
              userInfo.role ||
              userInfo.vaiTro ||
              userInfo.chucVu ||
              (userInfo.loai_nhan_vien === "part_time"
                ? "Nhân viên Parttime"
                : "Nhân viên Fulltime"),
          };

          return user;
        } catch (e) {
          // Parse error, continue to fallback
        }
      }

      // Fallback to old storage keys
      const data = await StorageService.getMultiple<Record<string, string>>([
        STORAGE_KEYS.USER_ID,
        STORAGE_KEYS.USER_NAME,
        STORAGE_KEYS.USERNAME,
        STORAGE_KEYS.USER_AVATAR,
        STORAGE_KEYS.USER_ROLE,
        STORAGE_KEYS.USER_TEAM,
      ]);

      if (!data[STORAGE_KEYS.USER_ID] && !data[STORAGE_KEYS.USERNAME]) {
        return null;
      }

      return {
        id: data[STORAGE_KEYS.USER_ID],
        name:
          data[STORAGE_KEYS.USER_NAME] || data[STORAGE_KEYS.USERNAME] || "User",
        username: data[STORAGE_KEYS.USERNAME] || "",
        avatar: data[STORAGE_KEYS.USER_AVATAR] || "",
        role: data[STORAGE_KEYS.USER_ROLE] || "Nhân viên Parttime",
        team: data[STORAGE_KEYS.USER_TEAM] || "Chưa cập nhật",
      };
    } catch (error) {
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const [isLoggedIn, accessToken] = await Promise.all([
        StorageService.get<boolean>(STORAGE_KEYS.IS_LOGGED_IN),
        StorageService.get<string>(STORAGE_KEYS.ACCESS_TOKEN),
      ]);

      // User is authenticated if both IS_LOGGED_IN flag is set and access token exists
      return isLoggedIn === true && !!accessToken;
    } catch (error) {
      return false;
    }
  },

  /**
   * Refresh user info from API
   * Call /user/me endpoint to get latest user data from server
   */
  async refreshUserFromAPI(): Promise<User | null> {
    try {
      const response = await getUserInfoNew();

      // Check if API returned error (404, etc.)
      if (
        !response ||
        !response.data ||
        response.data === 404 ||
        typeof response.data === "number"
      ) {
        console.warn(
          "⚠️ API /user/me returned error or 404, using storage data",
        );
        // Return existing user from storage - DO NOT UPDATE
        const existingUser = await this.getCurrentUser();
        return existingUser;
      }

      // Handle nested data structure
      // API returns: { data: { user: {...} }, statusCode: 201 }
      let userInfo =
        response?.data?.user || response?.data?.data?.user || response?.data;

      if (!userInfo || typeof userInfo !== "object") {
        console.warn("⚠️ Invalid userInfo from API, using storage data");
        const existingUser = await this.getCurrentUser();
        return existingUser;
      }

      // Create updated user object
      // Priority: _id (MongoDB) → tai_khoan_id → snake_case → camelCase → default
      const user: User = {
        id:
          userInfo._id?.toString() ||
          userInfo.tai_khoan_id ||
          userInfo.taiKhoanId ||
          userInfo.id ||
          userInfo.userId ||
          "",
        name:
          userInfo.profile?.name ||
          userInfo.ho_ten ||
          userInfo.hoTen ||
          userInfo.name ||
          userInfo.ten ||
          userInfo.ten_dang_nhap ||
          userInfo.fullName ||
          userInfo.tenDangNhap ||
          "User",
        username:
          userInfo.ten_dang_nhap ||
          userInfo.tenDangNhap ||
          userInfo.username ||
          "",
        avatar:
          userInfo.profile?.avatar ||
          userInfo.anh_dai_dien ||
          userInfo.anhDaiDien ||
          userInfo.avatar ||
          "",
        email: userInfo.email || "",
        phone:
          userInfo.so_dien_thoai ||
          userInfo.soDienThoai ||
          userInfo.phone ||
          "",
        accountId:
          userInfo.tai_khoan_id ||
          userInfo.taiKhoanId ||
          userInfo.accountId ||
          "",
        team:
          userInfo.profile?.team ||
          userInfo.doi ||
          userInfo.nhom ||
          userInfo.team ||
          "Chưa cập nhật",
        role:
          userInfo.profile?.role ||
          userInfo.vai_tro ||
          userInfo.chuc_vu ||
          userInfo.vaiTro ||
          userInfo.chucVu ||
          userInfo.role ||
          (userInfo.loai_nhan_vien === "part_time"
            ? "Nhân viên Parttime"
            : "Nhân viên Fulltime"),
      };

      // Update storage with fresh data
      await StorageService.set(
        STORAGE_KEYS.USER_INFO,
        JSON.stringify(userInfo),
      );
      await StorageService.setMultiple({
        [STORAGE_KEYS.USER_ID]: user.id || "",
        [STORAGE_KEYS.USER_NAME]: user.name,
        [STORAGE_KEYS.USER_AVATAR]: user.avatar,
        [STORAGE_KEYS.USER_ROLE]: user.role,
        [STORAGE_KEYS.USER_TEAM]: user.team,
      });

      return user;
    } catch (error: any) {
      console.error("❌ refreshUserFromAPI error:", error);
      // Return existing user from storage - DO NOT return null
      const existingUser = await this.getCurrentUser();
      return existingUser;
    }
  },
};
