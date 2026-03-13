import React, { useState, useEffect } from "react";
import { Page, Box, Text, Input, Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import images from "../../../../assets/images";
import BaseModal from "../../../../components/common/BaseModal";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import { useDonXinOT } from "../../../../hooks/DonXinOT";
import "./index.css";

const DonXinOTPage: React.FC = () => {
  const navigate = useNavigate();
  const hook = useDonXinOT();
  
  // UI states
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedManagerName, setSelectedManagerName] = useState("");

  // Load managers on mount
  useEffect(() => {
    hook.fetchManagers();
  }, []);

  const handleFromDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hook.setFromDateTime(e.target.value);
  };

  const handleToDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hook.setToDateTime(e.target.value);
  };

  const handleManagerSelect = (manager: { id: number; ten: string }) => {
    setSelectedManagerName(manager.ten);
    hook.setSelectedManagerId(manager.id);
    setShowManagerDropdown(false);
  };

  const handleSubmit = () => {
    const validation = hook.validateForm();
    if (!validation.valid) {
      setErrorMessage(validation.message);
      setShowErrorModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);

    try {
      const result = await hook.submitOTRequest();
      if (result.success) {
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại!");
      setShowErrorModal(true);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigate(-1);
  };

  const formatDateTime = (datetime: string) => {
    if (!datetime) return "";
    return moment(datetime).format("DD/MM/YYYY HH:mm");
  };

  if (hook.loading) {
    return <LoadingSpinner />;
  }

  return (
    <Page className="don-ot-page">
      {/* Header */}
      <Box className="don-header">
        <Box className="don-header-content">
          <Box className="back-button" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          <Text className="don-header-title">Đơn xin làm ngoài giờ</Text>
        </Box>
        <Box className="don-header-logo">
          <img src={images.companyLogoWhite} alt="RIPT Logo" className="logo-image" />
        </Box>
      </Box>

      {/* Content */}
      <Box className="don-content">
        <div className="stats-section">
          <div className="stats-text">
            Số đơn xin làm ngoài giờ (được duyệt) tháng này: <span className="stats-number">0</span>
          </div>
        </div>

        <Box className="divider" />

        {/* Form */}
        <Box className="form-section">
          {/* From DateTime */}
          <Box className="form-field">
            <Text className="field-label">
              Từ <span className="required">*</span>
            </Text>
            <Box className="datetime-input-container">
            <input
              type="datetime-local"
              value={hook.fromDateTime}
              onChange={handleFromDateTimeChange}
              className="datetime-input-hidden"
            />
            <Box
              className="datetime-input-display"
              onClick={() => {
                const input = document.querySelector(
                  ".datetime-input-container input"
                ) as HTMLInputElement;
                input?.showPicker?.();
              }}
            >
              <Text className="datetime-text">
                {hook.fromDateTime ? formatDateTime(hook.fromDateTime) : "Chọn thời gian"}
              </Text>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="15"
                  rx="2"
                  stroke="#0066CC"
                  strokeWidth="2"
                />
                <path d="M3 10H21" stroke="#0066CC" strokeWidth="2" />
                <path d="M7 3V6" stroke="#0066CC" strokeWidth="2" strokeLinecap="round" />
                <path d="M17 3V6" stroke="#0066CC" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Box>
          </Box>
        </Box>

        {/* To DateTime */}
        <Box className="form-field">
          <Text className="field-label">
            Đến <span className="required">*</span>
          </Text>
          <Box className="datetime-input-container">
            <input
              type="datetime-local"
              value={hook.toDateTime}
              onChange={handleToDateTimeChange}
              className="datetime-input-hidden"
              style={{ position: "absolute", zIndex: 10 }}
            />
            <Box
              className="datetime-input-display"
              onClick={() => {
                const inputs = document.querySelectorAll(
                  ".datetime-input-container input"
                ) as NodeListOf<HTMLInputElement>;
                inputs[1]?.showPicker?.();
              }}
            >
              <Text className="datetime-text">
                {hook.toDateTime ? formatDateTime(hook.toDateTime) : "Chọn thời gian"}
              </Text>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="15"
                  rx="2"
                  stroke="#0066CC"
                  strokeWidth="2"
                />
                <path d="M3 10H21" stroke="#0066CC" strokeWidth="2" />
                <path d="M7 3V6" stroke="#0066CC" strokeWidth="2" strokeLinecap="round" />
                <path d="M17 3V6" stroke="#0066CC" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Box>
          </Box>
        </Box>

        {/* Work Description */}
        <Box className="form-field">
          <Text className="field-label">
            Công việc làm thêm <span className="required">*</span>
          </Text>
          <Input.TextArea
            value={hook.workDescription}
            onChange={(e) => hook.setWorkDescription(e.target.value)}
            placeholder="Nhập mô tả công việc"
            className="textarea-input"
            maxLength={500}
            showCount
            rows={4}
          />
        </Box>

        {/* Project */}
        <Box className="form-field">
          <Text className="field-label">
            Dự án <span className="required">*</span>
          </Text>
          <Input.TextArea
            value={hook.project}
            onChange={(e) => hook.setProject(e.target.value)}
            placeholder="Nhập tên dự án"
            className="textarea-input"
            maxLength={200}
            showCount
            rows={3}
          />
        </Box>

        {/* Manager Dropdown */}
        <Box className="form-field">
          <Text className="field-label">Người quản lý</Text>
          <Box className="dropdown-container">
            <Box
              className="dropdown-display"
              onClick={() => setShowManagerDropdown(!showManagerDropdown)}
            >
              <Text className={`dropdown-text ${!selectedManagerName ? "placeholder" : ""}`}>
                {selectedManagerName || "Chọn Người quản lý"}
              </Text>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className={`dropdown-arrow ${showManagerDropdown ? "open" : ""}`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
            {showManagerDropdown && (
              <Box className="dropdown-menu">
                {hook.managers.map((manager) => (
                  <Box
                    key={manager.id}
                    className="dropdown-item"
                    onClick={() => handleManagerSelect(manager)}
                  >
                    <Text>{manager.ten}</Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Submit Button */}
        <Button
          className="submit-button"
          onClick={handleSubmit}
          loading={hook.loading}
          disabled={hook.loading}
        >
          Nộp đơn
        </Button>
        </Box>
      </Box>

      {/* Confirm Modal */}
      <BaseModal
        visible={showConfirmModal}
        config={{
          image: images.icDialog,
          title: "Xác nhận",
          description: "Bạn có chắc chắn muốn gửi đơn xin làm thêm giờ này không?",
          leftText: "Hủy",
          rightText: "Xác nhận",
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
          title: "Thành công",
          description: "Đơn xin làm thêm giờ đã được gửi thành công!",
          rightText: "Đóng",
        }}
        numberOfBtn="one-button"
        onRightText={handleSuccessConfirm}
        turnOffModal={handleSuccessConfirm}
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
    </Page>
  );
};

export default DonXinOTPage;