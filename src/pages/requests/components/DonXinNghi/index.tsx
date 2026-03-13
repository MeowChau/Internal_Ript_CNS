import React, { useState } from "react";
import { Page, Box, Text, Input, Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import images from "../../../../assets/images";
import { useDonXinNghi } from "../../../../hooks/DonXinNghiLam";
import BaseModal from "../../../../components/common/BaseModal";
import "./index.css";

interface SessionDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const SessionDropdown: React.FC<SessionDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Cả ngày", "Sáng", "Chiều"];

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

function DonXinNghiPage() {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Use custom hook for all logic
  const {
    selectedDate,
    setSelectedDate,
    session,
    setSession,
    isStudy,
    setIsStudy,
    reason,
    setReason,
    image,
    setImage,
    loading,
    workDaysCount,
    approvedLeaveDays,
    handleSubmit,
    successModal,
    errorModal,
    closeModals,
  } = useDonXinNghi();

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
      setSelectedDate(new Date(dateValue));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitClick = () => {
    // Validate before showing modal
    if (!isStudy && !reason.trim()) {
      alert("Vui lòng nhập lý do xin nghỉ");
      return;
    }
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    handleSubmit();
  };

  const handleViewRequest = () => {
    closeModals();
    // Navigate to request detail page with the created request data
    // navigate to detail page if needed
    navigate(-1);
  };

  const handleSuccessBack = () => {
    closeModals();
    navigate(-1);
  };

  return (
    <Page className="don-xin-nghi-page">
      {/* Header */}
      <Box className="don-header">
        <Box className="don-header-content">
          <Box className="back-button" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          <Text className="don-header-title">Đơn xin nghỉ</Text>
        </Box>
        <Box className="don-header-logo">
          <img src={images.companyLogoWhite} alt="RIPT Logo" className="logo-image" />
        </Box>
      </Box>

      {/* Content */}
      <Box className="don-content">
        <div className="stats-section">
          <div className="stats-text">
            Số buổi đi làm đăng ký trong tháng: <span className="stats-number">{workDaysCount}</span>
          </div>
          <div className="stats-text">
            Số buổi xin nghỉ được duyệt trong tháng: <span className="stats-number">{approvedLeaveDays}</span>
          </div>
        </div>

        <Box className="divider" />

        {/* Form */}
        <Box className="form-section">
          <Box className="form-field">
            <Text className="field-label">
              Ngày <span className="required">*</span>
            </Text>
            <div className="date-input-container">
              <input
                type="date"
                value={formatDateForInput(selectedDate)}
                onChange={handleDateChange}
                className="date-input-field"
              />
              <div className="date-display">
                <span className="date-text">{formatDate(selectedDate)}</span>
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
              Buổi nghỉ <span className="required">*</span>
            </Text>
            <SessionDropdown value={session} onChange={setSession} />
          </Box>

          {/* Study Checkbox */}
          <Box className="checkbox-field">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={isStudy}
                onChange={(e) => {
                  setIsStudy(e.target.checked);
                  if (e.target.checked) {
                    setReason(""); 
                  }
                }}
                className="study-checkbox-input"
              />
              <span className="checkbox-label">Đi học</span>
            </label>
          </Box>

          {/* Reason Field - Only show when NOT studying */}
          {!isStudy && (
            <Box className="form-field">
              <Text className="field-label">
                Lý do xin nghỉ <span className="required">*</span>
              </Text>
              <Input.TextArea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do xin nghỉ..."
                className="reason-textarea"
                rows={5}
              />
            </Box>
          )}

          {/* Image Upload */}
          <Box className="form-field">
            <Text className="field-label">Ảnh đính kèm</Text>
            <Box className="image-upload">
              {image ? (
                <img src={image} alt="Preview" className="image-preview" />
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
          <Button
            onClick={handleSubmitClick}
            loading={loading}
            disabled={loading}
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
        visible={successModal.visible}
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
        visible={errorModal.visible}
        config={{
          image: images.iconError,
          title: "Thông báo",
          description: errorModal.message,
          rightText: "Đồng ý",
        }}
        numberOfBtn="one-button"
        onRightText={closeModals}
        turnOffModal={closeModals}
      />
    </Page>
  );
}

export default DonXinNghiPage;
