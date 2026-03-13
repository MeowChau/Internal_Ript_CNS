import React, { useState } from "react";
import { Page, Box, Text, Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import images from "../../../../assets/images";
import { useDangKyLamThem } from "../../../../hooks/DangKyLamThem";
import BaseModal from "../../../../components/common/BaseModal";
import "./index.css";

interface DayInfo {
  date: number;
  status: "full" | "morning" | "afternoon" | "holiday" | "today" | "none";
  morningTime?: { from: string; to: string };
  afternoonTime?: { from: string; to: string };
}

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, value, onChange, disabled }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled && inputRef.current) {
      // Focus first
      inputRef.current.focus();
      
      // Try showPicker (modern browsers)
      try {
        if ('showPicker' in inputRef.current) {
          (inputRef.current as any).showPicker();
          return;
        }
      } catch (error) {
        // showPicker not supported
      }
      
      // Fallback: trigger click
      inputRef.current.click();
    }
  };

  const handleWrapperClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.click();
    }
  };

  return (
    <Box className="time-input-group">
      <Text className="time-label">{label}</Text>
      <Box className="time-input-wrapper" onClick={handleWrapperClick}>
        <input
          ref={inputRef}
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="time-input"
          disabled={disabled}
        />
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="time-icon"
          onClick={handleIconClick}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="#1e40af" strokeWidth="2"/>
          <path d="M16 2V6M8 2V6M3 10H21" stroke="#1e40af" strokeWidth="2"/>
        </svg>
      </Box>
    </Box>
  );
};

function DangKyLamThemPage() {
  const navigate = useNavigate();
  
  const {
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
  } = useDangKyLamThem();

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showTimeWarningModal, setShowTimeWarningModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeWarningMessage, setTimeWarningMessage] = useState("");
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Validate time duration (must be at least 2 hours)
  const validateTimeDuration = (startTime: string, endTime: string, session: string): boolean => {
    if (!startTime || !endTime) return true; // Skip validation if times not set
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const durationMinutes = endMinutes - startMinutes;
    
    if (durationMinutes < 120) { // Less than 2 hours (120 minutes)
      const sessionName = session === 'morning' ? 'buổi sáng' : 'buổi chiều';
      const timeRange = session === 'morning' ? '8:00 - 12:00' : '13:30 - 17:30';
      setTimeWarningMessage(
        `Thời gian làm việc ${sessionName} phải nằm trong khoảng ${timeRange} và phải nhiều hơn 2 tiếng`
      );
      setShowTimeWarningModal(true);
      return false;
    }
    
    return true;
  };

  // Validate time range for sessions
  const validateTimeRange = (time: string, session: string, type: 'from' | 'to'): boolean => {
    if (!time) return true;
    
    const [hour, minute] = time.split(':').map(Number);
    const timeMinutes = hour * 60 + minute;
    
    if (session === 'morning') {
      const minTime = 8 * 60; // 8:00
      const maxTime = 12 * 60; // 12:00
      
      if (timeMinutes < minTime || timeMinutes > maxTime) {
        setTimeWarningMessage(
          `Thời gian làm việc buổi sáng phải nằm trong khoảng 8:00 - 12:00 và phải nhiều hơn 2 tiếng`
        );
        setShowTimeWarningModal(true);
        return false;
      }
    } else if (session === 'afternoon') {
      const minTime = 13 * 60 + 30; // 13:30
      const maxTime = 17 * 60 + 30; // 17:30
      
      if (timeMinutes < minTime || timeMinutes > maxTime) {
        setTimeWarningMessage(
          `Thời gian làm việc buổi chiều phải nằm trong khoảng 13:30 - 17:30 và phải nhiều hơn 2 tiếng`
        );
        setShowTimeWarningModal(true);
        return false;
      }
    }
    
    return true;
  };

  // Wrapped time setters with validation
  const handleMorningFromChange = (value: string) => {
    if (!validateTimeRange(value, 'morning', 'from')) {
      return;
    }
    setMorningFrom(value);
    if (morningTo) {
      validateTimeDuration(value, morningTo, 'morning');
    }
  };

  const handleMorningToChange = (value: string) => {
    if (!validateTimeRange(value, 'morning', 'to')) {
      return;
    }
    setMorningTo(value);
    if (morningFrom) {
      validateTimeDuration(morningFrom, value, 'morning');
    }
  };

  const handleAfternoonFromChange = (value: string) => {
    if (!validateTimeRange(value, 'afternoon', 'from')) {
      return;
    }
    setAfternoonFrom(value);
    if (afternoonTo) {
      validateTimeDuration(value, afternoonTo, 'afternoon');
    }
  };

  const handleAfternoonToChange = (value: string) => {
    if (!validateTimeRange(value, 'afternoon', 'to')) {
      return;
    }
    setAfternoonTo(value);
    if (afternoonFrom) {
      validateTimeDuration(afternoonFrom, value, 'afternoon');
    }
  };

  const getDayClass = (dayInfo: DayInfo) => {
    const classes = ["calendar-day"];
    const isPast = dayInfo.date < today.getDate() && currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear();
    
    // Check if Sunday
    const dayDate = new Date(currentYear, currentMonth - 1, dayInfo.date);
    const isSunday = dayDate.getDay() === 0;
    
    if (dayInfo.status === "full") classes.push("day-full");
    else if (dayInfo.status === "morning") classes.push("day-morning");
    else if (dayInfo.status === "afternoon") classes.push("day-afternoon");
    else if (dayInfo.status === "holiday") classes.push("day-holiday");
    else if (dayInfo.status === "today") classes.push("day-today");
    if (isPast && dayInfo.status !== "none" && dayInfo.status !== "today") {
      classes.push("day-past");
    }
    
    // Add Sunday styling
    if (isSunday) {
      classes.push("day-sunday");
    }
    
    if (selectedDate === dayInfo.date) classes.push("day-selected");
    
    return classes.join(" ");
  };

  const handleSaveClick = () => {
    if (!hasChanges) {
      setErrorMessage("Không có thay đổi nào để lưu");
      setShowErrorModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    try {
      await handleSave();
      setShowSuccessModal(true);
    } catch (error: any) {
      setErrorMessage(error.message || "Lưu đăng ký không thành công");
      setShowErrorModal(true);
    }
  };

  const handleSuccessBack = () => {
    setShowSuccessModal(false);
    navigate(-1);
  };

  const handleBackClick = () => {
    if (hasChanges) {
      setShowExitModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    navigate(-1);
  };

  const getFirstDayOfMonth = () => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  // Check if selected date's checkboxes should be disabled
  // Only disable checkboxes for sessions that are already registered
  const isMorningCheckboxDisabled = () => {
    if (!selectedDate) return false;
    
    // Check if Sunday (day 0) - completely disabled
    const selectedDateObj = new Date(currentYear, currentMonth - 1, selectedDate);
    const isSunday = selectedDateObj.getDay() === 0;
    if (isSunday) return true;
    
    // Check if morning session was already registered
    const originalDay = originalCalendar?.find((d) => d.date === selectedDate);
    if (!originalDay) return false;
    
    // If morning session already exists (full day or morning only), disable it
    const hasMorningSession = originalDay.status === 'full' || originalDay.status === 'morning';
    return hasMorningSession;
  };

  const isAfternoonCheckboxDisabled = () => {
    if (!selectedDate) return false;
    
    // Check if Sunday (day 0) - completely disabled
    const selectedDateObj = new Date(currentYear, currentMonth - 1, selectedDate);
    const isSunday = selectedDateObj.getDay() === 0;
    if (isSunday) return true;
    
    // Check if afternoon session was already registered
    const originalDay = originalCalendar?.find((d) => d.date === selectedDate);
    if (!originalDay) return false;
    
    // If afternoon session already exists (full day or afternoon only), disable it
    const hasAfternoonSession = originalDay.status === 'full' || originalDay.status === 'afternoon';
    return hasAfternoonSession;
  };

  return (
    <Page className="dang-ky-lam-them-page">
      {/* Header */}
      <Box className="dklt-header">
        <Box className="dklt-header-content">
          <Box className="back-button" onClick={handleBackClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          <Text className="dklt-header-title">Đăng ký làm thêm</Text>
        </Box>
        <Box className="dklt-header-logo">
          <img src={images.companyLogoWhite} alt="RIPT Logo" className="logo-image" />
        </Box>
      </Box>

      {/* Content */}
      <Box className="dklt-content">
        <div className="dklt-stats">
          Số buổi đã đăng kí: <span className="stats-value">{registeredDays}</span>
        </div>
        <Button
          className="btn-save-register"
          onClick={handleSaveClick}
          disabled={!hasChanges || loading}
        >
          {loading ? "Đang lưu..." : "Lưu đăng ký"}
        </Button>
        <Box className="calendar-container">
          <Text className="calendar-month">Tháng {currentMonth}/{currentYear}</Text>
          <Box className="calendar-weekdays">
            <Text className="weekday">T2</Text>
            <Text className="weekday">T3</Text>
            <Text className="weekday">T4</Text>
            <Text className="weekday">T5</Text>
            <Text className="weekday">T6</Text>
            <Text className="weekday">T7</Text>
            <Text className="weekday">CN</Text>
          </Box>

          <Box className="calendar-grid">
            {Array.from({ length: getFirstDayOfMonth() }).map((_, i) => (
              <Box key={`empty-${i}`} className="calendar-day empty" />
            ))}
            {calendar.map((dayInfo) => {
              // Only block Sunday clicks (allow past dates for viewing)
              const dayDate = new Date(currentYear, currentMonth - 1, dayInfo.date);
              const isSunday = dayDate.getDay() === 0;
              
              return (
                <Box
                  key={dayInfo.date}
                  className={getDayClass(dayInfo)}
                  onClick={() => !isSunday && handleDayClick(dayInfo.date)}
                >
                  <Text className="day-number">{dayInfo.date}</Text>
                </Box>
              );
            })}
          </Box>
          {/* Legend */}
          <Box className="calendar-legend">
            <Box className="legend-item">
              <span className="legend-color full"></span>
              <Text className="legend-text">Cả ngày</Text>
            </Box>
            <Box className="legend-item">
              <span className="legend-color morning"></span>
              <Text className="legend-text">Sáng</Text>
            </Box>
            <Box className="legend-item">
              <span className="legend-color afternoon"></span>
              <Text className="legend-text">Chiều</Text>
            </Box>
            <Box className="legend-item">
              <span className="legend-color holiday"></span>
              <Text className="legend-text">Nghỉ lễ</Text>
            </Box>
          </Box>
        </Box>

        {/* Session Selection */}
        {selectedDate && (
          <Box className="session-selection">
            <Box className="session-group">
              <Box className="session-checkbox-row">
                <label className="session-checkbox-container">
                  <input
                    type="checkbox"
                    checked={morningChecked}
                    onChange={(e) => setMorningChecked(e.target.checked)}
                    className="session-checkbox"
                    disabled={isMorningCheckboxDisabled()}
                  />
                  <span className="session-label">Sáng</span>
                </label>
                <label className="session-checkbox-container">
                  <input
                    type="checkbox"
                    checked={afternoonChecked}
                    onChange={(e) => setAfternoonChecked(e.target.checked)}
                    className="session-checkbox"
                    disabled={isAfternoonCheckboxDisabled()}
                  />
                  <span className="session-label">Chiều</span>
                </label>
              </Box>
            </Box>
            <Box className="time-selection">
              <Box className="time-group">
                <TimeInput
                  label="Từ"
                  value={morningFrom}
                  onChange={handleMorningFromChange}
                  disabled={!morningChecked || isMorningCheckboxDisabled()}
                />
                <TimeInput
                  label="Đến"
                  value={morningTo}
                  onChange={handleMorningToChange}
                  disabled={!morningChecked || isMorningCheckboxDisabled()}
                />
              </Box>
              <Box className="time-group">
                <TimeInput
                  label="Từ"
                  value={afternoonFrom}
                  onChange={handleAfternoonFromChange}
                  disabled={!afternoonChecked || isAfternoonCheckboxDisabled()}
                />
                <TimeInput
                  label="Đến"
                  value={afternoonTo}
                  onChange={handleAfternoonToChange}
                  disabled={!afternoonChecked || isAfternoonCheckboxDisabled()}
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* Confirmation Modal */}
        <BaseModal
          visible={showConfirmModal}
          config={{
            image: images.icDialog,
            title: "Thông báo",
            description: "Bạn có muốn lưu đăng ký?",
            leftText: "Hủy",
            rightText: "Đồng ý",
          }}
          numberOfBtn="two-button"
          onLeftText={() => setShowConfirmModal(false)}
          onRightText={handleConfirmSave}
          turnOffModal={() => setShowConfirmModal(false)}
        />

        {/* Success Modal */}
        <BaseModal
          visible={showSuccessModal}
          config={{
            image: images.iconCheck,
            title: "Lưu thành công",
            description: "",
            rightText: "Đồng ý",
          }}
          numberOfBtn="one-button"
          onRightText={handleSuccessBack}
          turnOffModal={handleSuccessBack}
        />

        {/* Error Modal */}
        <BaseModal
          visible={showErrorModal}
          config={{
            image: images.iconError,
            title: "Thông báo",
            description: errorMessage,
            rightText: "Đồng ý",
          }}
          numberOfBtn="one-button"
          onRightText={() => setShowErrorModal(false)}
          turnOffModal={() => setShowErrorModal(false)}
        />

        {/* Exit Confirmation Modal */}
        <BaseModal
          visible={showExitModal}
          config={{
            image: images.icDialog,
            title: "Thông báo",
            description: "Bạn chưa lưu đăng ký, bạn có chắc chắn muốn thoát không?",
            leftText: "Hủy",
            rightText: "Đồng ý",
          }}
          numberOfBtn="two-button"
          onLeftText={() => setShowExitModal(false)}
          onRightText={handleConfirmExit}
          turnOffModal={() => setShowExitModal(false)}
        />

        {/* Time Validation Warning Modal */}
        <BaseModal
          visible={showTimeWarningModal}
          config={{
            image: images.iconError,
            title: "Thông báo",
            description: timeWarningMessage,
            rightText: "OK",
          }}
          numberOfBtn="one-button"
          onRightText={() => setShowTimeWarningModal(false)}
          turnOffModal={() => setShowTimeWarningModal(false)}
        />
      </Box>
    </Page>
  );
}

export default DangKyLamThemPage;
