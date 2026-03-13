import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types";
import { AuthService } from "@/services/auth";
import { ROUTES } from "@/config";

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const loggedInUser = await AuthService.login();
      setUser(loggedInUser);

      setTimeout(() => {
        navigate(ROUTES.HOME, { replace: true });
      }, 500);
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.code === 4) {
        setError("Người dùng từ chối cấp quyền.");
      } else {
        setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      setUser(null);
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, [navigate]);

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      console.error("Load user error:", err);
      return null;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const isAuth = await AuthService.isAuthenticated();
      return isAuth;
    } catch (err) {
      console.error("Check auth error:", err);
      return false;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const freshUser = await AuthService.refreshUserFromAPI();
      if (freshUser) {
        setUser(freshUser);
      }
      return freshUser;
    } catch (err) {
      console.error("Refresh user error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    loadUser,
    checkAuth,
    refreshUser,
  };
};
