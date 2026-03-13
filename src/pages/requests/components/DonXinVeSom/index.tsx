import React, { useState, useEffect } from "react";
import { Page, Box, Text, Input, Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import images from "../../../../assets/images";
import BaseModal from "../../../../components/common/BaseModal";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import { getThongKeVeSom } from "../../../../apis/user";
import { useDonXinVeSom } from "../../../../hooks/DonXinVeSom";
import "./index.css";

interface SessionDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const SessionDropdown: React.FC<SessionDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Sáng", "Chiều"];

  return (
    <Box className="session-dropdown-wrapper">
      <Box 
        className={`session-dropdown ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Text className="session-text">{value}</Text>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="session-arrow">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Box>
      {isOpen && (
        <Box className="session-dropdown-menu">
          {options.map((option) => (
            <Box
              key={option}
              className="session-dropdown-item"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <Text className="session-dropdown-text">{option}</Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

function DonXinVeSomPage() {
  const navigate = useNavigate();
  const hook = useDonXinVeSom();
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showAbsentSuggestModal, setShowAbsentSuggestModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessages, setWarningMessages] = useState<string[]>([]);
  
  // Thêm state cho earlyTime hiển thị
  const [earlyTime, setEarlyTime] = useState("17:00");
  const [approvedEarlyRequests, setApprovedEarlyRequests] = useState(0);

  // Load thống kê và thời gian làm việc khi component mount
  useEffect(() => {
    loadStatistics();
    loadWorkTime(hook.selectedDate);
  }, []);

  // Load lại thời gian làm việc khi đổi ngày
  useEffect(() => {
    if (hook.selectedDate) {
      loadWorkTime(hook.selectedDate);
    }
  }, [hook.selectedDate]);

  const loadStatistics = async () => {
    try {
      const now = new Date();
      const response = await getThongKeVeSom(now.getFullYear(), now.getMonth() + 1);
      if (response?.data?.data) {
        setApprovedEarlyRequests(response.data.data.soDonDuocDuyet || 0);
      }
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  };

  const loadWorkTime = async (date: Date) => {
    await hook.fetchThoiGianLamViec(date);
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const newDate = new Date(dateValue);
      hook.setSelectedDate(newDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    if (timeValue) {
      setEarlyTime(timeValue);
      // Parse time và set vào selectedTime
      const [hours, minutes] = timeValue.split(':');
      const newTime = new Date(hook.selectedDate);
      newTime.setHours(parseInt(hours));
      newTime.setMinutes(parseInt(minutes));
      hook.setSelectedTime(newTime);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        hook.setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSessionChange = (value: string) => {
    const sessionValue = value === "Sáng" ? "sang" : "chieu";
    hook.setSession(sessionValue);
  };

  const handleSubmitClick = async () => {
    // Validate form
    const validation = hook.validateForm();
    if (!validation.valid) {
      if (validation.type === "warning_should_absent") {
        setErrorMessage(validation.message);
        setShowAbsentSuggestModal(true);
      } else {
        setErrorMessage(validation.message);
        setShowErrorModal(true);
      }
      return;
    }

    // Check warnings
    try {
      const warningCheck = await hook.checkEarlyWarning();
      
      if (warningCheck.hasWarning) {
        if (warningCheck.shouldAbsent) {
          setErrorMessage(warningCheck.warnings[0] || "Nên gửi đơn xin nghỉ thay vì về sớm");
          setShowAbsentSuggestModal(true);
        } else {
          setWarningMessages(warningCheck.warnings);
          setShowWarningModal(true);
        }
        return;
      }

      // Không có warning -> hiển thị modal xác nhận
      setShowConfirmModal(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Có lỗi xảy ra khi kiểm tra đơn");
      setShowErrorModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    
    try {
      const result = await hook.submitEarlyRequest();
      if (result.success) {
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Có lỗi xảy ra khi gửi đơn");
      setShowErrorModal(true);
    }
  };

  const handleWarningConfirm = async () => {
    setShowWarningModal(false);
    
    try {
      const result = await hook.submitEarlyRequest();
      if (result.success) {
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Có lỗi xảy ra khi gửi đơn");
      setShowErrorModal(true);
    }
  };

  const handleSuccessBack = () => {
    setShowSuccessModal(false);
    navigate(-1);
  };

  const handleViewRequest = () => {
    setShowSuccessModal(false);
    navigate(-1);
  };

  const handleAbsentSuggest = () => {
    setShowAbsentSuggestModal(false);
    // Navigate to leave request page
    navigate("/requests/leave");
  };

  const closeModals = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setShowWarningModal(false);
    setShowAbsentSuggestModal(false);
  };

  if (hook.loading) {
    return <LoadingSpinner />;
  }

  return (
    <Page className="don-xin-ve-som-page">
      {/* Header */}
      <Box className="don-header">
        <Box className="don-header-content">
          <Box className="back-button" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          <Text className="don-header-title">Đơn xin về sớm</Text>
        </Box>
        <Box className="don-header-logo">
          <img src={images.companyLogoWhite} alt="RIPT Logo" className="logo-image" />
        </Box>
      </Box>

      {/* Content */}
      <Box className="don-content">
        <div className="stats-section">
          <div className="stats-text">
            Số đơn xin về sớm (được duyệt) tháng này: <span className="stats-number">{approvedEarlyRequests}</span>
          </div>
        </div>

        <Box className="divider" />

        {/* Form */}
        <Box className="form-section">
          {/* Date Field */}
          <Box className="form-field">
            <Text className="field-label">
              Ngày <span className="required">*</span>
            </Text>
            <div className="date-input-container">
              <input
                type="date"
                value={formatDateForInput(hook.selectedDate)}
                onChange={handleDateChange}
                className="date-input-field"
              />
              <div className="date-display">
                <span className="date-text">{formatDate(hook.selectedDate)}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="calendar-icon">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V6" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 2V6" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Box>

          {/* Session Field */}
          <Box className="form-field">
            <Text className="field-label">
              Ca về sớm <span className="required">*</span>
            </Text>
            <SessionDropdown 
              value={hook.session === "sang" ? "Sáng" : "Chiều"} 
              onChange={handleSessionChange} 
            />
          </Box>

          {/* Time Field */}
          <Box className="form-field">
            <Text className="field-label">
              Thời gian về sớm <span className="required">*</span>
            </Text>
            <div className="time-input-container">
              <input
                type="time"
                value={earlyTime}
                onChange={handleTimeChange}
                className="time-input-field"
              />
              <div className="time-display">
                <span className="time-text">{earlyTime}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="time-icon">
                  <circle cx="12" cy="12" r="9" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Box>

          {/* Reason Field */}
          <Box className="form-field">
            <Text className="field-label">
              Lý do về sớm <span className="required">*</span>
            </Text>
            <Input.TextArea
              value={hook.reason}
              onChange={(e) => hook.setReason(e.target.value)}
              placeholder="Nhập lý do về sớm..."
              className="reason-textarea"
              rows={5}
            />
          </Box>

          {/* Image Upload */}
          <Box className="form-field">
            <Text className="field-label">Ảnh đính kèm</Text>
            <Box className="image-upload">
              {hook.image ? (
                <Box className="image-preview-container">
                  <img src={hook.image} alt="Preview" className="image-preview" />
                  <Box className="image-remove" onClick={() => hook.setImage("")}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </Box>
                </Box>
              ) : (
                <label htmlFor="image-upload" className="upload-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#9ca3af"/>
                    <path d="M21 15L16 10L5 21" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </label>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden-input"
              />
            </Box>
          </Box>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitClick}
            loading={hook.loading}
            disabled={hook.loading}
            className="submit-button"
          >
            Nộp đơn
          </Button>
        </Box>
      </Box>

      {/* Confirmation Modal */}
      <BaseModal
        visible={showConfirmModal}
        config={{
          image: images.icDialog,
          title: "Thông báo",
          description: "Bạn có muốn gửi đơn không?",
          leftText: "Hủy",
          rightText: "Đồng ý",
        }}
        numberOfBtn="two-button"
        onLeftText={() => setShowConfirmModal(false)}
        onRightText={handleConfirmSubmit}
        turnOffModal={() => setShowConfirmModal(false)}
      />

      {/* Success Modal */}
      <BaseModal
        visible={showSuccessModal}
        config={{
          image: images.iconCheck,
          title: "Thông báo",
          description: "Gửi đơn thành công",
          leftText: "Quay lại",
          rightText: "Xem đơn",
        }}
        numberOfBtn="two-button"
        onLeftText={handleSuccessBack}
        onRightText={handleViewRequest}
        turnOffModal={closeModals}
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

      {/* Warning Modal */}
      <BaseModal
        visible={showWarningModal}
        config={{
          image: images.icDialog,
          title: "Cảnh báo",
          description: warningMessages.join("\n"),
          leftText: "Hủy",
          rightText: "Tiếp tục",
        }}
        numberOfBtn="two-button"
        onLeftText={() => setShowWarningModal(false)}
        onRightText={handleWarningConfirm}
        turnOffModal={() => setShowWarningModal(false)}
      />

      {/* Absent Suggest Modal */}
      <BaseModal
        visible={showAbsentSuggestModal}
        config={{
          image: images.icDialog,
          title: "Thông báo",
          description: errorMessage,
          leftText: "Quay lại",
          rightText: "Gửi đơn nghỉ",
        }}
        numberOfBtn="two-button"
        onLeftText={() => setShowAbsentSuggestModal(false)}
        onRightText={handleAbsentSuggest}
        turnOffModal={() => setShowAbsentSuggestModal(false)}
      />
    </Page>
  );
}

export default DonXinVeSomPage;
