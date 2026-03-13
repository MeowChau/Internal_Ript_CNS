import React, { useState, useEffect, useRef } from "react";
import { Page, Box, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "./index.css";

// API
import { postLichDKMe, getThoigianLamViec } from "@/apis/user";

// Components
import LoadingSpinner from "@/components/common/LoadingSpinner";

// Types
interface BuoiDiemDanh {
  thoi_gian_check_in?: string;
  thoi_gian_check_out?: string;
  trang_thai_check_in?: string;
  trang_thai_check_out?: string;
  thoiGianBatDau?: string;
  thoiGianKetThuc?: string;
}

interface NgayLamViec {
  thoi_gian_check_in: string;
  thoi_gian_check_out: string;
  buoi_lam_viec?: string;
  ngay: number;
  trangThaiLamViec?: string;
  thoiGianBatDau?: string;
  thoiGianKetThuc?: string;
  trang_thai_lam_viec?: string;
  sang?: BuoiDiemDanh;
  chieu?: BuoiDiemDanh;
}

interface EventItem {
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  thoiGianCheckIn: string;
  thoiGianCheckOut: string;
  tieuDe: string;
  diaDiem: string;
  buoi_lam_viec: string;
  trangThaiCheckIn?: string;
  trangThaiCheckOut?: string;
}

// Simple groupBy function to replace lodash
function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, currentValue) => {
    const groupKey = String(currentValue[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentValue);
    return result;
  }, {} as Record<string, T[]>);
}

function WorkSchedulePage() {
  const navigate = useNavigate();
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  const listAllEvent = useRef<Record<number, NgayLamViec[]>>({});
  const attendanceCache = useRef<Record<string, { sang?: BuoiDiemDanh; chieu?: BuoiDiemDanh }>>({});

  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [ngay, setNgay] = useState(todayDate);
  const [thang, setThang] = useState(todayMonth);
  const [nam, setNam] = useState(todayYear);
  const [schedulePersonal, setSchedulePersonal] = useState<NgayLamViec[]>([]);
  const [dataEvent, setDataEvent] = useState<EventItem[]>([]);
  const [textDate, setTextDate] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [attendancePreloaded, setAttendancePreloaded] = useState(false);

  useEffect(() => {
    getPersonalWorkingSchedule(nam, thang);
  }, []);

  useEffect(() => {
    // Preload attendance data for all days with work schedule
    const preloadAttendanceData = async () => {
      if (attendancePreloaded) return; // Prevent duplicate preloads
      
      const workDays = Object.keys(listAllEvent.current).map(Number);
      if (workDays.length === 0) return;
      
      for (const day of workDays) {
        await getAttendanceDetail(day, thang, nam);
      }
      
      setAttendancePreloaded(true);
    };

    if (schedulePersonal.length > 0 && !attendancePreloaded) {
      preloadAttendanceData();
    }
  }, [schedulePersonal.length, attendancePreloaded]);

  const getPersonalWorkingSchedule = async (year: number, month: number) => {
    setLoading(true);
    const body = {
      nam: year,
      thang: month,
    };

    try {
      const res = await postLichDKMe(body);
      const listSchedule = res?.data?.data?.danhSachNgayDangKy?.map((item: NgayLamViec) => ({
        ...item,
      })) || [];
      
      setSchedulePersonal(listSchedule);
      listAllEvent.current = groupBy(listSchedule, "ngay");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching work schedule:", error);
      setSchedulePersonal([]);
      setLoading(false);
    }
  };

  const getAttendanceDetail = async (day: number, month: number, year: number) => {
    const cacheKey = `${day}-${month}-${year}`;
    
    // Check cache first
    if (attendanceCache.current[cacheKey]) {
      return attendanceCache.current[cacheKey];
    }

    try {
      setLoadingAttendance(true);
      const res = await getThoigianLamViec(day, month, year);
      
      if (res?.status === 200 && res?.data?.data) {
        const data = res.data.data;
        const attendanceData = {
          sang: data.sang || {},
          chieu: data.chieu || {},
        };
        
        // Cache the result
        attendanceCache.current[cacheKey] = attendanceData;
        
        setLoadingAttendance(false);
        return attendanceData;
      }
    } catch (error) {
      console.error("❌ Error fetching attendance detail:", error);
      setLoadingAttendance(false);
    }
    
    return null;
  };

  const setDataArrayEvent = async (day: number) => {
    // Get attendance detail
    const attendanceData = await getAttendanceDetail(day, thang, nam);
    
    const dataEventResult = listAllEvent.current?.[day]
      ?.filter((item) => item?.trang_thai_lam_viec === "Đi làm")
      ?.map((item: NgayLamViec) => {
        // Determine which session (sang/chieu) based on buoi_lam_viec
        const buoi = item.buoi_lam_viec?.toLowerCase();
        const sessionData = buoi === 'sang' ? attendanceData?.sang : 
                           buoi === 'chieu' ? attendanceData?.chieu : 
                           null;
        
        return {
          thoiGianBatDau: item?.thoiGianBatDau ?? "Chưa cập nhật",
          thoiGianKetThuc: item?.thoiGianKetThuc ?? "Chưa cập nhật",
          thoiGianCheckIn: sessionData?.thoi_gian_check_in ?? item?.thoi_gian_check_in ?? "Chưa cập nhật",
          thoiGianCheckOut: sessionData?.thoi_gian_check_out ?? item?.thoi_gian_check_out ?? "Chưa cập nhật",
          trangThaiCheckIn: sessionData?.trang_thai_check_in,
          trangThaiCheckOut: sessionData?.trang_thai_check_out,
          tieuDe: "Làm việc",
          buoi_lam_viec: item.buoi_lam_viec ?? "Chưa rõ",
          diaDiem: "Domixi",
        };
      })
      ?.sort((a, b) => {
        if (a?.thoiGianBatDau < b?.thoiGianBatDau) {
          return -1;
        } else return 1;
      }) || [];

    setDataEvent(dataEventResult);
  };

  const onDayPress = (day: number) => {
    const dateString = `${String(day).padStart(2, "0")}/${String(thang).padStart(2, "0")}/${nam}`;

    if (day === todayDate && thang === todayMonth && nam === todayYear) {
      setTextDate(`Hôm nay (${dateString})`);
    } else {
      setTextDate(dateString);
    }

    setSelectedDay(day);
    setDataArrayEvent(day);
  };

  const onChangeMonth = (newMonth: Date) => {
    const monthValue = newMonth.getMonth() + 1;
    const yearValue = newMonth.getFullYear();

    if (monthValue !== todayMonth || yearValue !== todayYear) {
      setNgay(1);
    } else {
      setNgay(todayDate);
    }

    setThang(monthValue);
    setNam(yearValue);
    setCurrentMonth(newMonth);
    setSelectedDay(null);
    setTextDate("");
    setDataEvent([]);
    
    // Clear cache and reset preload flag for new month
    attendanceCache.current = {};
    setAttendancePreloaded(false);
    
    getPersonalWorkingSchedule(yearValue, monthValue);
  };

  const previousMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    onChangeMonth(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    onChangeMonth(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getDayStatus = (day: number) => {
    const events = listAllEvent.current?.[day] || [];
    if (events.length === 0) return null;

    // Filter work events only
    const workEvents = events.filter((e) => e.trang_thai_lam_viec === "Đi làm");
    if (workEvents.length === 0) return null;

    // Check if has multiple shifts
    const hasSang = workEvents.some(e => e.buoi_lam_viec?.toLowerCase()?.trim() === "sang");
    const hasChieu = workEvents.some(e => e.buoi_lam_viec?.toLowerCase()?.trim() === "chieu");

    // If both shifts, it's fullday
    if (hasSang && hasChieu) {
      return "fullday";
    }
    
    // Single shift
    if (hasSang) {
      return "morning";
    }
    if (hasChieu) {
      return "afternoon";
    }
    
    // Default to fullday if buoi_lam_viec not specified or unrecognized
    return "fullday";
  };
  
  const getAttendanceStatus = (day: number) => {
    const cacheKey = `${day}-${thang}-${nam}`;
    const cached = attendanceCache.current[cacheKey];
    
    if (!cached) return null;

    const events = listAllEvent.current?.[day] || [];
    const workEvents = events.filter((e) => e.trang_thai_lam_viec === "Đi làm");
    if (workEvents.length === 0) return null;

    let hasEarly = false;
    let hasLate = false;

    // Check all work sessions for this day
    for (const workEvent of workEvents) {
      const buoi = workEvent.buoi_lam_viec?.toLowerCase()?.trim();
      const sessionData = buoi === 'sang' ? cached.sang : 
                         buoi === 'chieu' ? cached.chieu : 
                         null;
      
      if (sessionData) {
        const checkInStatus = sessionData.trang_thai_check_in?.toLowerCase();
        const checkOutStatus = sessionData.trang_thai_check_out?.toLowerCase();
        
        if (checkInStatus === 'sớm') hasEarly = true;
        if (checkInStatus === 'muộn') hasLate = true;
      }
    }
    
    if (!hasEarly && !hasLate) return null;
    
    return {
      early: hasEarly,
      late: hasLate,
    };
  };
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const isCurrentMonth =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  const monthName = currentMonth.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  if (loading) {
    return (
      <Page className="work-schedule-page">
        <Box className="schedule-header">
          <Box className="back-button" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          <Text className="schedule-header-title">Lịch làm việc</Text>
        </Box>
        <LoadingSpinner />
      </Page>
    );
  }

  return (
    <Page className="work-schedule-page">
      {/* Header */}
      <Box className="schedule-header">
        <Box className="back-button" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Box>
        <Text className="schedule-header-title">Lịch làm việc</Text>
      </Box>

      <Box className="schedule-content">
        {/* Calendar */}
        <Box className="calendar-container">
          {/* Month Selector */}
          <Box className="month-selector">
            <Box className="month-arrow" onClick={previousMonth}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Box>
            <Text className="month-title">{monthName}</Text>
            <Box className="month-arrow" onClick={nextMonth}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Box>
          </Box>

          {/* Week Days */}
          <Box className="week-days">
            {weekDays.map((day) => (
              <Box key={day} className="week-day">
                <Text className="week-day-text">{day}</Text>
              </Box>
            ))}
          </Box>

          {/* Calendar Days */}
          <Box className="calendar-days">
            {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map(
              (_, index) => (
                <Box key={`empty-${index}`} className="calendar-day empty" />
              )
            )}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isToday = isCurrentMonth && day === today.getDate();
              const isSelected = selectedDay === day;
              const dayStatus = getDayStatus(day);
              const attendanceStatus = getAttendanceStatus(day);

              return (
                <Box
                  key={day}
                  className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${dayStatus ? `status-${dayStatus}` : ""}`}
                  onClick={() => onDayPress(day)}
                >
                  <Text className={`day-number ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}>
                    {day}
                  </Text>
                  
                  {/* Attendance Dots (Sớm/Muộn) - small dots at bottom */}
                  {attendanceStatus && (attendanceStatus.early || attendanceStatus.late) && (
                    <Box className="attendance-dots">
                      {attendanceStatus.early && <Box className="dot dot-early" />}
                      {attendanceStatus.late && <Box className="dot dot-late" />}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Legend */}
          <Box className="calendar-legend">
            <Box className="legend-column">
              <Box className="legend-item">
                <Box className="legend-dot" style={{ backgroundColor: "#93c5fd" }} />
                <Text className="legend-text">Cả ngày</Text>
              </Box>
              <Box className="legend-item">
                <Box className="legend-dot" style={{ backgroundColor: "#fbbf24" }} />
                <Text className="legend-text">Chiều</Text>
              </Box>
              <Box className="legend-item">
                <Box className="legend-dot legend-dot-small" style={{ backgroundColor: "#1e3a8a" }} />
                <Text className="legend-text">Sớm</Text>
              </Box>
            </Box>
            <Box className="legend-column">
              <Box className="legend-item">
                <Box className="legend-dot" style={{ backgroundColor: "#fde047" }} />
                <Text className="legend-text">Sáng</Text>
              </Box>
              <Box className="legend-item">
                <Box className="legend-dot" style={{ backgroundColor: "#c084fc" }} />
                <Text className="legend-text">Nghỉ lễ</Text>
              </Box>
              <Box className="legend-item">
                <Box className="legend-dot legend-dot-small" style={{ backgroundColor: "#ef4444" }} />
                <Text className="legend-text">Muộn</Text>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Event List */}
        {textDate && (
          <Box className="event-section">
            <Box className="event-date-header">
              <Text className="event-date-title">Ngày {textDate}</Text>
            </Box>
            
            {dataEvent.length > 0 && (
              <Box className="event-list">
                {dataEvent.map((event, index) => (
                  <Box key={index} className="event-card">
                    {/* Time Circle - Left Side */}
                    <Box className="event-time-circle">
                      <Text className="event-time-text">
                        {event.thoiGianBatDau || ""}
                      </Text>
                    </Box>

                    {/* Event Content - Right Side */}
                    <Box className="event-content">
                      <Text className="event-content-title">
                        Làm việc ở công ty
                      </Text>
                      <Text className="event-content-row">
                        Thời gian đăng kí: {event.thoiGianBatDau} - {event.thoiGianKetThuc}
                      </Text>
                      <Text className="event-content-row">
                        Thời gian điểm danh: {event.thoiGianCheckIn === "Chưa cập nhật" ? "Chưa có" : event.thoiGianCheckIn} - {event.thoiGianCheckOut === "Chưa cập nhật" ? "Chưa có" : event.thoiGianCheckOut}
                      </Text>
                      <Text className="event-content-row">
                        Phòng: Internal RIPT CNS
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Page>
  );
}

export default WorkSchedulePage;