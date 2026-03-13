import { useMonthlyStats } from "@/contexts/MonthlyStatsContext";
import type { MonthlyStats } from "@/types";

interface UseHomeReturn {
  monthlyStats: MonthlyStats;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

/**
 * Hook to manage home page data
 * - Load monthly statistics for current month from context
 * - Refresh data on demand
 */
export const useHome = (): UseHomeReturn => {
  // Lấy thống kê tháng từ context thay vì fetch riêng
  return useMonthlyStats();
};
