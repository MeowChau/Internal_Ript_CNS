import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { getThongKeThang } from '@/apis/user';
import type { MonthlyStats } from '@/types';

interface MonthlyStatsContextValue {
  monthlyStats: MonthlyStats;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

const MonthlyStatsContext = createContext<MonthlyStatsContextValue | undefined>(undefined);

interface MonthlyStatsProviderProps {
  children: React.ReactNode;
}

const CACHE_KEY = 'domixi_monthly_stats_cache';
const CACHE_TIMESTAMP_KEY = 'domixi_monthly_stats_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

/**
 * Provider để quản lý thống kê tháng tập trung
 * Sử dụng trong App.tsx để wrap toàn bộ app
 */
export const MonthlyStatsProvider: React.FC<MonthlyStatsProviderProps> = ({ children }) => {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    workDays: 0,
    registeredDays: 0,
    approvedLeaves: 0,
    lateApprovals: 0,
    earlyLeaveApprovals: 0,
    overtimeHours: 0,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load cached stats from localStorage
   */
  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < CACHE_DURATION) {
          const data = JSON.parse(cached);
          setMonthlyStats(data);
          return true;
        }
      }
    } catch (err) {
      console.warn('Failed to load cached stats:', err);
    }
    return false;
  }, []);

  /**
   * Save stats to cache
   */
  const saveToCache = useCallback((stats: MonthlyStats) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(stats));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      console.warn('Failed to save stats to cache:', err);
    }
  }, []);

  /**
   * Load monthly statistics from API
   */
  const loadMonthlyStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const response = await getThongKeThang(month, year);

      // Handle nested data structure: response.data.data or response.data
      const data = response?.data?.data || response?.data;

      if (data) {
        // API uses snake_case with underscores
        // Note: so_ngay_lam_viec_base is in DAYS, multiply by 2 for BUỔI (morning + afternoon)
        const newStats = {
          workDays: (data.so_ngay_lam_viec_base || 0) * 2,
          registeredDays: data.so_buoi_dang_ky_lam || 0,
          approvedLeaves: data.so_buoi_xin_nghi_duoc_duyet || 0,
          lateApprovals: data.so_don_xin_den_muon_duoc_duyet || 0,
          earlyLeaveApprovals: data.so_don_xin_ve_som_duoc_duyet || 0,
          overtimeHours: data.so_gio_ot_du_kien || 0,
        };
        setMonthlyStats(newStats);
        saveToCache(newStats);
      } else {
        setError('API không trả về dữ liệu');
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải thống kê tháng');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [saveToCache]);

  /**
   * Refresh statistics data
   */
  const refreshStats = useCallback(async () => {
    await loadMonthlyStats(true);
  }, [loadMonthlyStats]);

  // Load stats on mount: try cache first, then fetch
  useEffect(() => {
    const hasCached = loadFromCache();
    if (hasCached) {
      // Load từ cache trước, sau đó refresh ở background
      loadMonthlyStats(true);
    } else {
      // Không có cache, load bình thường
      loadMonthlyStats(false);
    }
  }, [loadFromCache, loadMonthlyStats]);

  // Memoize context value to prevent unnecessary re-renders
  const value: MonthlyStatsContextValue = useMemo(() => ({
    monthlyStats,
    loading,
    refreshing,
    error,
    refreshStats,
  }), [monthlyStats, loading, refreshing, error, refreshStats]);

  return (
    <MonthlyStatsContext.Provider value={value}>
      {children}
    </MonthlyStatsContext.Provider>
  );
};

export const useMonthlyStats = (): MonthlyStatsContextValue => {
  const context = useContext(MonthlyStatsContext);
  
  if (context === undefined) {
    throw new Error('useMonthlyStats must be used within MonthlyStatsProvider');
  }
  
  return context;
};
