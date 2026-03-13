import React, { useState } from "react";
import { Page, Box, Text, Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import images from "@/assets/images";
import { useDangKyLichLam } from "@/hooks/DangKyLichLam";
import BaseModal from "@/components/common/BaseModal";
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
      inputRef.current.focus();
      try {
        if ('showPicker' in inputRef.current) {
          (inputRef.current as any).showPicker();
          return;
        }
      } catch (error) {
      }
      
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

function RegisterSchedulePage() {
  const navigate = useNavigate();
  
  const {
    calendar,
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
  } = useDangKyLichLam();

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showTimeWarningModal, setShowTimeWarningModal] = useState(false);
  const [showOutsideRegistrationModal, setShowOutsideRegistrationModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeWarningMessage, setTimeWarningMessage] = useState("");
  
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Check if outside registration period when page loads
  React.useEffect(() => {
    if (!isRegistrationPeriod) {
      setShowOutsideRegistrationModal(true);
    }
  }, [isRegistrationPeriod]);

  // Validate time duration (must be at least 2 hours)
  const validateTimeDuration = (startTime: string, endTime: string, session: string): boolean => {
    if (!startTime || !endTime) return true;
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const durationMinutes = endMinutes - startMinutes;
    
    if (durationMinutes < 120) {
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
      const minTime = 8 * 60;
      const maxTime = 12 * 60;
      
      if (timeMinutes < minTime || timeMinutes > maxTime) {
        setTimeWarningMessage(
          `Thời gian làm việc buổi sáng phải nằm trong khoảng 8:00 - 12:00 và phải nhiều hơn 2 tiếng`
        );
        setShowTimeWarningModal(true);
        return false;
      }
    } else if (session === 'afternoon') {
      const minTime = 13 * 60 + 30;
      const maxTime = 17 * 60 + 30;
      
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
    
    if (isSunday) {
      classes.push("day-sunday");
    }
    
    if (selectedDate === dayInfo.date) classes.push("day-selected");
    
    return classes.join(" ");
  };

  const handleSaveClick = () => {
    // Check if in registration period (day 1-3)
    if (!isRegistrationPeriod) {
      setShowOutsideRegistrationModal(true);
      return;
    }

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

  const isMorningCheckboxDisabled = () => {
    if (!selectedDate) return false;
    const selectedDateObj = new Date(currentYear, currentMonth - 1, selectedDate);
    const isSunday = selectedDateObj.getDay() === 0;
    if (isSunday) return true;
    
    const dayInfo = calendar.find(d => d.date === selectedDate);
    return dayInfo?.status === "morning" || dayInfo?.status === "full";
  };

  const isAfternoonCheckboxDisabled = () => {
    if (!selectedDate) return false;
    const selectedDateObj = new Date(currentYear, currentMonth - 1, selectedDate);
    const isSunday = selectedDateObj.getDay() === 0;
    if (isSunday) return true;
    
    const dayInfo = calendar.find(d => d.date === selectedDate);
    return dayInfo?.status === "afternoon" || dayInfo?.status === "full";
  };

  const minDays = 15;

  return (
    <Page className="register-schedule-page">
      {/* Header */}
      <Box className="register-header">
        <Box className="register-header-content">
          <Box className="back-button" onClick={handleBackClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          <Text className="register-header-title">Đăng ký lịch làm</Text>
        </Box>
        <Box className="register-header-logo">
          <img src={images.companyLogoWhite} alt="RIPT Logo" className="logo-image" />
        </Box>
      </Box>

      {/* Content */}
      <Box className="register-content">
        {/* Countdown Timer */}
        <Box className="countdown-timer">
          <Text className="countdown-label">Thời gian còn lại: </Text>
          <Text className="countdown-value">
            {String(countdown.days).padStart(2, "0")} : {String(countdown.hours).padStart(2, "0")} : {String(countdown.minutes).padStart(2, "0")} : {String(countdown.seconds).padStart(2, "0")}
          </Text>
        </Box>

        {/* Register Button */}
        <Box className="action-row">
          <Button 
            className="register-button" 
            onClick={handleSaveClick}
            loading={loading}
            disabled={!hasChanges || loading}
          >
            Lưu đăng ký
          </Button>
        </Box>

        {/* Info Stats */}
        <Box className="info-stats">
          <Text className="info-text">
            Số buổi đã đăng ký: <span className="info-value registered">{registeredDays}</span>
          </Text>
          <Text className="info-text">
            Số buổi làm tối thiểu: <span className="info-value">{minDays}</span>
          </Text>
        </Box>

        {/* Month Title */}
        <Text className="month-title-center">Tháng {currentMonth}/{currentYear}</Text>

        {/* Week Days Header */}
        <Box className="week-days">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
            <Box key={index} className="week-day">
              <Text className="week-day-text">{day}</Text>
            </Box>
          ))}
        </Box>

        {/* Calendar Days */}
        <Box className="calendar-days">
          {Array.from({ length: getFirstDayOfMonth() }).map((_, index) => (
            <Box key={`empty-${index}`} className="calendar-day empty" />
          ))}
          {calendar.map((dayInfo) => (
            <Box
              key={dayInfo.date}
              className={getDayClass(dayInfo)}
              onClick={() => handleDayClick(dayInfo.date)}
            >
              <Text className="day-number">{dayInfo.date}</Text>
            </Box>
          ))}
        </Box>

        {/* Legend */}
        <Box className="calendar-legend">
          <Box className="legend-row">
            <Box className="legend-item">
              <Box className="legend-dot" style={{ backgroundColor: "#bfdbfe" }} />
              <Text className="legend-text">Cả ngày</Text>
            </Box>
            <Box className="legend-item">
              <Box className="legend-dot" style={{ backgroundColor: "#fef08a" }} />
              <Text className="legend-text">Sáng</Text>
            </Box>
          </Box>
          <Box className="legend-row">
            <Box className="legend-item">
              <Box className="legend-dot" style={{ backgroundColor: "#fdba74" }} />
              <Text className="legend-text">Chiều</Text>
            </Box>
            <Box className="legend-item">
              <Box className="legend-dot" style={{ backgroundColor: "#d8b4fe" }} />
              <Text className="legend-text">Nghỉ lễ</Text>
            </Box>
          </Box>
        </Box>

        {/* Shift Selection */}
        {selectedDate && (
          <Box className="shift-selection">
            <Text className="shift-selection-title">Ngày {selectedDate} tháng {currentMonth}</Text>
            
            {/* Checkboxes Row */}
            <Box className="shift-checkboxes-row">
              <Box 
                className="shift-checkbox"
                onClick={() => !isMorningCheckboxDisabled() && setMorningChecked(!morningChecked)}
              >
                <Box className="checkbox-square">
                  {morningChecked && (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10L8 14L16 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </Box>
                <Text className="shift-text">Sáng</Text>
              </Box>

              <Box 
                className="shift-checkbox"
                onClick={() => !isAfternoonCheckboxDisabled() && setAfternoonChecked(!afternoonChecked)}
              >
                <Box className="checkbox-square">
                  {afternoonChecked && (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10L8 14L16 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </Box>
                <Text className="shift-text">Chiều</Text>
              </Box>
            </Box>

            {/* Time Inputs Grid */}
            <Box className="shift-time-grid">
              <Box className="shift-time-column">
                <TimeInput
                  label="Từ"
                  value={morningFrom}
                  onChange={handleMorningFromChange}
                  disabled={isMorningCheckboxDisabled() || !morningChecked}
                />

                <TimeInput
                  label="Đến"
                  value={morningTo}
                  onChange={handleMorningToChange}
                  disabled={isMorningCheckboxDisabled() || !morningChecked}
                />
              </Box>

              <Box className="shift-time-column">
                <TimeInput
                  label="Từ"
                  value={afternoonFrom}
                  onChange={handleAfternoonFromChange}
                  disabled={isAfternoonCheckboxDisabled() || !afternoonChecked}
                />

                <TimeInput
                  label="Đến"
                  value={afternoonTo}
                  onChange={handleAfternoonToChange}
                  disabled={isAfternoonCheckboxDisabled() || !afternoonChecked}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Modals */}
      
      {/* Outside Registration Period Modal */}
      <BaseModal
        visible={showOutsideRegistrationModal}
        config={{
          image: images.icDialog,
          title: "Thông báo",
          description: "Ngoài thời gian đăng ký. Bạn chỉ có thể đăng ký lịch làm từ ngày 1 đến ngày 3 hàng tháng.",
          rightText: "Đồng ý"
        }}
        numberOfBtn="one-button"
        onRightText={() => {
          setShowOutsideRegistrationModal(false);
          navigate(-1);
        }}
        turnOffModal={() => {
          setShowOutsideRegistrationModal(false);
          navigate(-1);
        }}
      />

      {/* Confirm Save Modal */}
      <BaseModal
        visible={showConfirmModal}
        config={{
          image: images.icDialog,
          title: "Xác nhận",
          description: "Bạn có chắc chắn muốn lưu đăng ký lịch làm này?",
          leftText: "Hủy",
          rightText: "Xác nhận",
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
          title: "Thành công",
          description: "Đăng ký lịch làm thành công!",
          rightText: "Đóng",
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
          title: "Lỗi",
          description: errorMessage,
          rightText: "Đóng",
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
          title: "Xác nhận",
          description: "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn thoát?",
          leftText: "Ở lại",
          rightText: "Thoát",
        }}
        numberOfBtn="two-button"
        onLeftText={() => setShowExitModal(false)}
        onRightText={handleConfirmExit}
        turnOffModal={() => setShowExitModal(false)}
      />

      {/* Time Warning Modal */}
      <BaseModal
        visible={showTimeWarningModal}
        config={{
          image: images.iconError,
          title: "Cảnh báo",
          description: timeWarningMessage,
          rightText: "Đóng",
        }}
        numberOfBtn="one-button"
        onRightText={() => setShowTimeWarningModal(false)}
        turnOffModal={() => setShowTimeWarningModal(false)}
      />
    </Page>
  );
}

export default RegisterSchedulePage;