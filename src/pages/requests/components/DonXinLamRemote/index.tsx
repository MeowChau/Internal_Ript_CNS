import React, { useState } from "react";
import { Page, Box, Text, Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import images from "../../../../assets/images";
import { useDonLamRemote } from "../../../../hooks/DonLamRemote";
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

function DonLamRemotePage() {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Use custom hook for all logic
  const {
    selectedDate,
    setSelectedDate,
    session,
    setSession,
    reason,
    setReason,
    loading,
    handleSubmit,
    successModal,
    errorModal,
    closeModals,
  } = useDonLamRemote();

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

  const handleSubmitClick = () => {
    // Validate before showing modal
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do làm Remote");
      return;
    }
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    handleSubmit();
  };

  const handleSuccessBack = () => {
    closeModals();
    navigate(-1);
  };

  return (
    <Page className="don-lam-remote-page">
      {/* Header */}
      <Box className="don-header">
        <Box className="don-header-content">
          <Box className="back-button" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          <Text className="don-header-title">Đơn đăng ký làm Remote</Text>
        </Box>
        <Box className="don-header-logo">
          <img src={images.companyLogoWhite} alt="RIPT Logo" className="logo-image" />
        </Box>
      </Box>

      {/* Content */}
      <Box className="don-content">
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
                min={formatDateForInput(new Date())}
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
              Buổi làm Remote <span className="required">*</span>
            </Text>
            <SessionDropdown value={session} onChange={setSession} />
          </Box>

          {/* Reason Field */}
          <Box className="form-field">
            <Text className="field-label">
              Lý do làm Remote <span className="required">*</span>
            </Text>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do làm Remote"
              className="reason-textarea"
              rows={5}
            />
          </Box>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitClick}
            className="submit-button"
            loading={loading}
            disabled={loading}
          >
            Nộp đơn
          </Button>
        </Box>
      </Box>

      {/* Confirm Modal */}
      {showConfirmModal && (
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
        />
      )}

      {/* Success Modal */}
      {successModal.visible && (
        <BaseModal
          visible={successModal.visible}
          config={{
            image: images.iconCheck,
            title: "Thành công",
            description: "Gửi đơn thành công",
            rightText: "Đóng",
          }}
          numberOfBtn="one-button"
          onRightText={handleSuccessBack}
        />
      )}

      {/* Error Modal */}
      {errorModal.visible && (
        <BaseModal
          visible={errorModal.visible}
          config={{
            image: images.iconError,
            title: "Thông báo",
            description: errorModal.message,
            rightText: "Đóng",
          }}
          numberOfBtn="one-button"
          onRightText={closeModals}
        />
      )}
    </Page>
  );
}

export default DonLamRemotePage;
