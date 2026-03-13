import { useState, useCallback, useEffect } from "react";
import type { DailyAttendance } from "@/types";
import { AttendanceService } from "@/services/attendance";

export const useAttendance = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState<DailyAttendance>({
    date: new Date().toISOString(),
    morning: { checkIn: null, checkOut: null },
    afternoon: { checkIn: null, checkOut: null },
  });

  const loadAttendance = useCallback(async () => {
    try {
      const data = await AttendanceService.getTodayAttendance();
      setAttendance(data);
    } catch (error) {
      console.error("Load attendance error:", error);
    }
  }, []);

  const checkIn = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      await AttendanceService.checkIn(userId);
      await loadAttendance();
    } catch (error) {
      console.error("Check-in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId, loadAttendance]);

  const checkOut = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      await AttendanceService.checkOut(userId);
      await loadAttendance();
    } catch (error) {
      console.error("Check-out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId, loadAttendance]);

  useEffect(() => {
    if (userId) {
      loadAttendance();
    }
  }, [userId, loadAttendance]);

  return {
    loading,
    attendance,
    checkIn,
    checkOut,
    reload: loadAttendance,
  };
};
