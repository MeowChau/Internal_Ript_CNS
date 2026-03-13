import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postLichDKMe, putLichDK } from "../../apis/user";
import { useMonthlyStats } from "@/contexts/MonthlyStatsContext";

interface DayInfo {
  date: number;
  status: "full" | "morning" | "afternoon" | "holiday" | "today" | "none";
  morningTime?: { from: string; to: string };
  afternoonTime?: { from: string; to: string };
  changed?: boolean;
}

interface ScheduleUpdateItem {
  buoiLamViec: string;
  ngay: number;
  trang_thai_lam_viec: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
}

interface UseDangKyLichLamReturn {
  calendar: DayInfo[];
  originalCalendar: DayInfo[];
  selectedDate: number | null;
  setSelectedDate: (date: number | null) => void;
  morningChecked: boolean;
  setMorningChecked: (checked: boolean) => void;
  afternoonChecked: boolean;
  setAfternoonChecked: (checked: boolean) => void;
  morningFrom: string;
  setMorningFrom: (time: string) => void;
  morningTo: string;
  setMorningTo: (time: string) => void;
  afternoonFrom: string;
  setAfternoonFrom: (time: string) => void;
  afternoonTo: string;
  setAfternoonTo: (time: string) => void;
  registeredDays: number;
  loading: boolean;
  hasChanges: boolean;
  handleSave: () => Promise<void>;
  handleDayClick: (date: number) => void;
  isRegistrationPeriod: boolean;
  countdown: { days: number; hours: number; minutes: number; seconds: number };
}

export const useDangKyLichLam = (): UseDangKyLichLamReturn => {
  const navigate = useNavigate();
  const { monthlyStats, refreshStats } = useMonthlyStats();

  const today = new Date();
  const [currentMonth] = useState<number>(today.getMonth() + 1);
  const [currentYear] = useState<number>(today.getFullYear());

  const [calendar, setCalendar] = useState<DayInfo[]>([]);
  const [originalCalendar, setOriginalCalendar] = useState<DayInfo[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Session states
  const [morningChecked, setMorningChecked] = useState<boolean>(false);
  const [afternoonChecked, setAfternoonChecked] = useState<boolean>(false);
  const [morningFrom, setMorningFrom] = useState<string>("08:00");
  const [morningTo, setMorningTo] = useState<string>("12:00");
  const [afternoonFrom, setAfternoonFrom] = useState<string>("13:30");
  const [afternoonTo, setAfternoonTo] = useState<string>("17:30");

  // Check if current date is in registration period (day 1-3 of month)
  const isRegistrationPeriod = today.getDate() >= 1 && today.getDate() <= 3;

  /**
   * Countdown timer - Shows time remaining in registration period only
   * Registration period: 00:00:00 day 1 to 23:59:59 day 3 (exactly 3 days)
   * - If IN period (day 1-3): Count down from 03:00:00:00 (72 hours from 12:00 AM day 1)
   * - If OUT of period (day 4+): Show 00:00:00:00
   */
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentDay = now.getDate();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      if (currentDay >= 1 && currentDay <= 3) {
        // In registration period - count down to end of day 3
        const targetDate = new Date(currentYear, currentMonth, 3, 23, 59, 59);
        const diff = targetDate.getTime() - now.getTime();

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown({ days, hours, minutes, seconds });
        } else {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      } else {
        // Outside registration period - show 00:00:00:00
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  /**
   * Fetch calendar data from API
   */
  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    try {
      const body = {
        nam: currentYear,
        thang: currentMonth,
      };

      const response = await postLichDKMe(body);

      const calendarData: DayInfo[] = [];
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

      const apiData = response?.data?.data?.danhSachNgayDangKy || [];

      for (let i = 1; i <= daysInMonth; i++) {
        const isToday =
          i === today.getDate() &&
          currentMonth === today.getMonth() + 1 &&
          currentYear === today.getFullYear();

        const morningSessions = apiData.filter(
          (item: any) => item.ngay === i && item.buoi_lam_viec === "sang",
        );
        const afternoonSessions = apiData.filter(
          (item: any) => item.ngay === i && item.buoi_lam_viec === "chieu",
        );

        const morningWorking = morningSessions.some(
          (item: any) => item.trang_thai_lam_viec === "Đi làm",
        );
        const afternoonWorking = afternoonSessions.some(
          (item: any) => item.trang_thai_lam_viec === "Đi làm",
        );

        let status: DayInfo["status"] = "none";

        if (isToday) {
          status = "today";
        } else if (morningWorking && afternoonWorking) {
          status = "full";
        } else if (morningWorking) {
          status = "morning";
        } else if (afternoonWorking) {
          status = "afternoon";
        }

        const morningTime = morningSessions.find(
          (item: any) => item.trang_thai_lam_viec === "Đi làm",
        );
        const afternoonTime = afternoonSessions.find(
          (item: any) => item.trang_thai_lam_viec === "Đi làm",
        );

        calendarData.push({
          date: i,
          status,
          morningTime: morningTime
            ? {
                from: morningTime.thoiGianBatDau || "08:00",
                to: morningTime.thoiGianKetThuc || "12:00",
              }
            : { from: "08:00", to: "12:00" },
          afternoonTime: afternoonTime
            ? {
                from: afternoonTime.thoiGianBatDau || "13:30",
                to: afternoonTime.thoiGianKetThuc || "17:30",
              }
            : { from: "13:30", to: "17:30" },
          changed: false,
        });
      }

      setCalendar(calendarData);
      setOriginalCalendar(JSON.parse(JSON.stringify(calendarData)));

      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching calendar:", error);

      const calendarData: DayInfo[] = [];
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

      for (let i = 1; i <= daysInMonth; i++) {
        const isToday =
          i === today.getDate() &&
          currentMonth === today.getMonth() + 1 &&
          currentYear === today.getFullYear();

        calendarData.push({
          date: i,
          status: isToday ? "today" : "none",
          morningTime: { from: "08:00", to: "12:00" },
          afternoonTime: { from: "13:30", to: "17:30" },
          changed: false,
        });
      }

      setCalendar(calendarData);
      setOriginalCalendar(JSON.parse(JSON.stringify(calendarData)));

      setLoading(false);
    }
  }, [currentMonth, currentYear]);

  /**
   * Load calendar data on mount
   */
  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  /**
   * Handle day selection
   */
  const handleDayClick = useCallback(
    (date: number) => {
      setSelectedDate(date);

      const dayInfo = calendar.find((d) => d.date === date);
      if (dayInfo) {
        const isMorning =
          dayInfo.status === "full" || dayInfo.status === "morning";
        const isAfternoon =
          dayInfo.status === "full" || dayInfo.status === "afternoon";

        setMorningChecked(isMorning);
        setAfternoonChecked(isAfternoon);

        if (dayInfo.morningTime) {
          setMorningFrom(dayInfo.morningTime.from);
          setMorningTo(dayInfo.morningTime.to);
        }
        if (dayInfo.afternoonTime) {
          setAfternoonFrom(dayInfo.afternoonTime.from);
          setAfternoonTo(dayInfo.afternoonTime.to);
        }
      }
    },
    [calendar.length],
  );

  /**
   * Check if any changes have been made
   */
  const checkHasChanges = useCallback(() => {
    if (selectedDate === null) return false;

    const currentDay = calendar.find((d) => d.date === selectedDate);
    const originalDay = originalCalendar.find((d) => d.date === selectedDate);

    if (!currentDay || !originalDay) return false;

    const currentIsMorning = morningChecked;
    const currentIsAfternoon = afternoonChecked;
    const originalIsMorning =
      originalDay.status === "full" || originalDay.status === "morning";
    const originalIsAfternoon =
      originalDay.status === "full" || originalDay.status === "afternoon";

    if (
      currentIsMorning !== originalIsMorning ||
      currentIsAfternoon !== originalIsAfternoon
    ) {
      return true;
    }

    if (currentIsMorning && originalIsMorning) {
      if (
        morningFrom !== originalDay.morningTime?.from ||
        morningTo !== originalDay.morningTime?.to
      ) {
        return true;
      }
    }

    if (currentIsAfternoon && originalIsAfternoon) {
      if (
        afternoonFrom !== originalDay.afternoonTime?.from ||
        afternoonTo !== originalDay.afternoonTime?.to
      ) {
        return true;
      }
    }

    return false;
  }, [
    selectedDate,
    calendar,
    originalCalendar,
    morningChecked,
    afternoonChecked,
    morningFrom,
    morningTo,
    afternoonFrom,
    afternoonTo,
  ]);

  /**
   * Update hasChanges
   */
  useEffect(() => {
    const hasAnyChanges = checkHasChanges();
    setHasChanges(hasAnyChanges);
  }, [checkHasChanges]);

  /**
   * Update calendar display when session changes
   */
  useEffect(() => {
    if (selectedDate === null) return;

    const updatedCalendar = calendar.map((day) => {
      if (day.date === selectedDate) {
        let newStatus: DayInfo["status"] = "none";
        const isToday =
          day.date === today.getDate() &&
          currentMonth === today.getMonth() + 1 &&
          currentYear === today.getFullYear();

        if (isToday) {
          newStatus = "today";
        } else if (morningChecked && afternoonChecked) {
          newStatus = "full";
        } else if (morningChecked) {
          newStatus = "morning";
        } else if (afternoonChecked) {
          newStatus = "afternoon";
        }

        return {
          ...day,
          status: newStatus,
          morningTime: { from: morningFrom, to: morningTo },
          afternoonTime: { from: afternoonFrom, to: afternoonTo },
        };
      }
      return day;
    });

    setCalendar(updatedCalendar);
  }, [
    selectedDate,
    morningChecked,
    afternoonChecked,
    morningFrom,
    morningTo,
    afternoonFrom,
    afternoonTo,
  ]);

  /**
   * Handle save/submit
   */
  const handleSave = useCallback(async () => {
    if (selectedDate === null) {
      throw new Error("Vui lòng chọn ngày");
    }

    setLoading(true);

    try {
      const danhSachNgayDangKy: ScheduleUpdateItem[] = [];

      const originalDay = originalCalendar.find((d) => d.date === selectedDate);
      const hasMorningOriginal =
        originalDay &&
        (originalDay.status === "full" || originalDay.status === "morning");
      const hasAfternoonOriginal =
        originalDay &&
        (originalDay.status === "full" || originalDay.status === "afternoon");

      const hasMorning = morningChecked;
      const hasAfternoon = afternoonChecked;

      if (hasMorning && !hasMorningOriginal) {
        danhSachNgayDangKy.push({
          buoiLamViec: "sang",
          ngay: selectedDate,
          trang_thai_lam_viec: "Đi làm",
          thoiGianBatDau: morningFrom,
          thoiGianKetThuc: morningTo,
        });
      }

      if (hasAfternoon && !hasAfternoonOriginal) {
        danhSachNgayDangKy.push({
          buoiLamViec: "chieu",
          ngay: selectedDate,
          trang_thai_lam_viec: "Đi làm",
          thoiGianBatDau: afternoonFrom,
          thoiGianKetThuc: afternoonTo,
        });
      }

      if (!hasMorning && !hasAfternoon) {
        danhSachNgayDangKy.push({
          buoiLamViec: "sang",
          ngay: selectedDate,
          trang_thai_lam_viec: "Nghi",
          thoiGianBatDau: "08:00",
          thoiGianKetThuc: "12:00",
        });
        danhSachNgayDangKy.push({
          buoiLamViec: "chieu",
          ngay: selectedDate,
          trang_thai_lam_viec: "Nghi",
          thoiGianBatDau: "13:30",
          thoiGianKetThuc: "17:30",
        });
      }

      const body = {
        danhSachNgayDangKy,
        nam: currentYear,
        thang: currentMonth,
      };

      await putLichDK(body);

      setLoading(false);
      setHasChanges(false);

      await fetchCalendarData();
      await refreshStats();

      setSelectedDate(null);

      return Promise.resolve();
    } catch (error: any) {
      setLoading(false);
      throw new Error(
        error.response?.data?.message || "Lưu đăng ký không thành công",
      );
    }
  }, [
    selectedDate,
    morningChecked,
    afternoonChecked,
    morningFrom,
    morningTo,
    afternoonFrom,
    afternoonTo,
    currentMonth,
    currentYear,
    originalCalendar,
    fetchCalendarData,
    refreshStats,
  ]);

  // Calculate registered days count
  const registeredDays = calendar.filter(
    (day) =>
      day.status === "full" ||
      day.status === "morning" ||
      day.status === "afternoon",
  ).length;

  return {
    calendar,
    originalCalendar,
    selectedDate,
    setSelectedDate,
    morningChecked,
    setMorningChecked,
    afternoonChecked,
    setAfternoonChecked,
    morningFrom,
    setMorningFrom,
    morningTo,
    setMorningTo,
    afternoonFrom,
    setAfternoonFrom,
    afternoonTo,
    setAfternoonTo,
    registeredDays,
    loading,
    hasChanges,
    handleSave,
    handleDayClick,
    isRegistrationPeriod,
    countdown,
  };
};
