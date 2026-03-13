import React, { useEffect, useMemo, useState } from "react";
import { Page, Box, Text, Input, Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import BaseModal from "@/components/common/BaseModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import images from "@/assets/images";
import {
  getThongKeDenMuon,
  getThoigianLamViec,
  postCheckRegisterLateNew,
  postRegisterLateNew,
} from "@/apis/user";
import "./index.css";

type SessionValue = "sang" | "chieu";

type WorkTimeSession = {
  thoiGianBatDau?: string;
  thoiGianKetThuc?: string;
  trang_thai_lam_viec?: string;
};

type WorkTimeInfo = {
  sang: WorkTimeSession;
  chieu: WorkTimeSession;
};

type ModalState = {
  visible: boolean;
  title: string;
  message: string;
  type: "one-button" | "two-button";
  leftText?: string;
  rightText?: string;
  onLeft?: () => void;
  onRight?: () => void;
  image?: string;
};

const DEFAULT_WORK_TIME: WorkTimeInfo = {
  sang: {
    thoiGianBatDau: "08:00",
    thoiGianKetThuc: "12:00",
  },
  chieu: {
    thoiGianBatDau: "13:30",
    thoiGianKetThuc: "17:30",
  },
};

const SESSION_OPTIONS: Array<{ label: string; value: SessionValue }> = [
  { label: "Sáng", value: "sang" },
  { label: "Chiều", value: "chieu" },
];

function formatDisplayDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function formatDateForInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatTimeForInput(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function toMinutes(timeText?: string): number {
  if (!timeText || !timeText.includes(":")) {
    return 0;
  }
  const [h, m] = timeText.split(":").map((v) => Number(v));
  if (Number.isNaN(h) || Number.isNaN(m)) {
    return 0;
  }
  return h * 60 + m;
}

function getNestedNumber(input: any): number {
  if (typeof input === "number") {
    return input;
  }
  if (!input || typeof input !== "object") {
    return 0;
  }

  const priorityKeys = [
    "soNgayXinDenMuon",
    "soDonXinDenMuonDuocDuyet",
    "soDonDuocDuyet",
    "approved",
    "count",
    "total",
    "value",
  ];

  for (const key of priorityKeys) {
    if (typeof input[key] === "number") {
      return input[key];
    }
  }

  for (const value of Object.values(input)) {
    if (typeof value === "number") {
      return value;
    }
  }

  return 0;
}

const CalendarIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="late-calendar-icon">
    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#0a3e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 2V6" stroke="#0a3e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 2V6" stroke="#0a3e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" stroke="#0a3e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function DonXinDenMuonPage() {
  const navigate = useNavigate();
  const now = new Date();
  const [loading, setLoading] = useState(false);
  const [approvedLateCount, setApprovedLateCount] = useState(0);
  const [offDate, setOffDate] = useState<Date>(now);
  const [session, setSession] = useState<SessionValue>(now.getHours() >= 12 ? "chieu" : "sang");
  const [timeLate, setTimeLate] = useState<Date>(now);
  const [reason, setReason] = useState("");
  const [image, setImage] = useState("");
  const [workTimeInfo, setWorkTimeInfo] = useState<WorkTimeInfo>(DEFAULT_WORK_TIME);
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);
  const [pendingWarnings, setPendingWarnings] = useState<string[]>([]);

  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    title: "Thông báo",
    message: "",
    type: "one-button",
    rightText: "Đóng",
    image: images.icDialog,
  });

  const sessionLabel = useMemo(
    () => SESSION_OPTIONS.find((item) => item.value === session)?.label || "Sáng",
    [session],
  );

  const showModal = (config: Partial<ModalState>) => {
    setModalState((prev) => ({
      ...prev,
      visible: true,
      image: images.icDialog,
      title: "Thông báo",
      type: "one-button",
      rightText: "Đóng",
      ...config,
    }));
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, visible: false }));
  };

  const getWorkingStart = (): string => {
    return session === "sang"
      ? workTimeInfo.sang.thoiGianBatDau || "08:00"
      : workTimeInfo.chieu.thoiGianBatDau || "13:30";
  };

  const getWorkingEnd = (): string => {
    return session === "sang"
      ? workTimeInfo.sang.thoiGianKetThuc || "12:00"
      : workTimeInfo.chieu.thoiGianKetThuc || "17:30";
  };

  const getMinutesLate = (): number => {
    const start = toMinutes(getWorkingStart());
    const lateTime = toMinutes(formatTimeForInput(timeLate));
    return lateTime - start;
  };

  const loadStatistics = async () => {
    try {
      const year = offDate.getFullYear();
      const month = offDate.getMonth() + 1;
      const res = await getThongKeDenMuon(year, month);
      const data = res?.data?.data ?? res?.data ?? {};
      setApprovedLateCount(getNestedNumber(data));
    } catch (error) {
      console.error("Không thể lấy thống kê đơn đến muộn:", error);
      setApprovedLateCount(0);
    }
  };

  const loadWorkTime = async (date: Date) => {
    try {
      const res = await getThoigianLamViec(
        date.getDate(),
        date.getMonth() + 1,
        date.getFullYear(),
      );

      const raw = res?.data?.data || {};
      setWorkTimeInfo({
        sang: {
          thoiGianBatDau:
            raw?.sang?.thoiGianBatDau ||
            raw?.sang?.thoi_gian_bat_dau_buoi_sang ||
            DEFAULT_WORK_TIME.sang.thoiGianBatDau,
          thoiGianKetThuc:
            raw?.sang?.thoiGianKetThuc ||
            raw?.sang?.thoi_gian_ket_thuc_buoi_sang ||
            DEFAULT_WORK_TIME.sang.thoiGianKetThuc,
          trang_thai_lam_viec:
            raw?.sang?.trang_thai_lam_viec || raw?.sang?.trangThaiLamViec,
        },
        chieu: {
          thoiGianBatDau:
            raw?.chieu?.thoiGianBatDau ||
            raw?.chieu?.thoi_gian_bat_dau_buoi_chieu ||
            DEFAULT_WORK_TIME.chieu.thoiGianBatDau,
          thoiGianKetThuc:
            raw?.chieu?.thoiGianKetThuc ||
            raw?.chieu?.thoi_gian_ket_thuc_buoi_chieu ||
            DEFAULT_WORK_TIME.chieu.thoiGianKetThuc,
          trang_thai_lam_viec:
            raw?.chieu?.trang_thai_lam_viec || raw?.chieu?.trangThaiLamViec,
        },
      });
    } catch (error) {
      console.error("Không thể lấy thời gian làm việc:", error);
      setWorkTimeInfo(DEFAULT_WORK_TIME);
    }
  };

  useEffect(() => {
    loadStatistics();
    loadWorkTime(offDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offDate]);

  const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      return;
    }
    const newDate = new Date(event.target.value);
    setOffDate(newDate);
  };

  const onChangeTimeLate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      return;
    }

    const [h, m] = event.target.value.split(":").map((v) => Number(v));
    const next = new Date(timeLate);
    next.setHours(h || 0, m || 0, 0, 0);
    setTimeLate(next);
  };

  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateRequest = async () => {
    const body = {
      canhBao: pendingWarnings,
      ngay: offDate.getDate(),
      thang: offDate.getMonth() + 1,
      nam: offDate.getFullYear(),
      phutDenMuon: getMinutesLate(),
      caLam: session,
      lyDo: reason.trim(),
      anh_dinh_kem: image,
    };

    try {
      setLoading(true);
      await postRegisterLateNew(body);
      showModal({
        image: images.iconCheck,
        message: "Gửi đơn thành công",
        type: "two-button",
        leftText: "Quay lại",
        rightText: "Xem đơn",
        onLeft: () => {
          closeModal();
          navigate(-1);
        },
        onRight: () => {
          closeModal();
          navigate("/utilities/requests");
        },
      });
      loadStatistics();
    } catch (error: any) {
      showModal({
        image: images.iconError,
        message:
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Gửi đơn không thành công",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateAndSubmit = async () => {
    const lateMinutes = getMinutesLate();
    const startMinutes = toMinutes(getWorkingStart());
    const endMinutes = toMinutes(getWorkingEnd());
    const lateAt = toMinutes(formatTimeForInput(timeLate));

    if (lateMinutes < 0) {
      showModal({
        message: `Thời gian phải muộn hơn ${getWorkingStart()}`,
      });
      return;
    }

    if (lateAt >= endMinutes) {
      showModal({
        message: `Thời gian phải trong khoảng ${getWorkingStart()} - ${getWorkingEnd()}`,
      });
      return;
    }

    if (endMinutes - lateAt <= 120) {
      showModal({
        message: "Tổng thời gian làm việc nhỏ hơn 120 phút. Bạn có muốn chuyển sang đơn xin nghỉ không?",
        type: "two-button",
        leftText: "Vẫn nộp đơn muộn",
        rightText: "Đơn xin nghỉ",
        onLeft: () => {
          closeModal();
          setTimeout(() => handleCreateRequest(), 0);
        },
        onRight: () => {
          closeModal();
          navigate("/utilities/requests/leave");
        },
      });
      return;
    }

    if (!reason.trim()) {
      showModal({
        message: "Vui lòng nhập lý do đến muộn",
      });
      return;
    }

    if (image) {
      const imageSizeMB = new Blob([image]).size / 1000000;
      if (imageSizeMB > 5) {
        showModal({
          message: "Kích thước ảnh quá lớn (tối đa 5MB)",
        });
        return;
      }
    }

    const checkBody = {
      ngay: offDate.getDate(),
      thang: offDate.getMonth() + 1,
      nam: offDate.getFullYear(),
      phutDenMuon: lateMinutes,
      caLam: session,
    };

    try {
      setLoading(true);
      const checkRes = await postCheckRegisterLateNew(checkBody);
      const responseData = checkRes?.data?.data;
      setLoading(false);

      if (responseData?.value !== undefined) {
        showModal({
          message: responseData?.message || "Bạn có muốn tiếp tục gửi đơn không?",
          type: "two-button",
          leftText: "Tiếp tục gửi",
          rightText: "Đơn xin nghỉ",
          onLeft: () => {
            closeModal();
            setPendingWarnings([]);
            setTimeout(() => handleCreateRequest(), 0);
          },
          onRight: () => {
            closeModal();
            navigate("/utilities/requests/leave");
          },
        });
        return;
      }

      const warnings = Array.isArray(responseData)
        ? responseData.filter(Boolean)
        : [];

      if (warnings.length > 0) {
        const text = warnings.map((item: string) => `- ${item}`).join("\n");
        showModal({
          message: `Bạn có muốn gửi đơn không?\n${text}`,
          type: "two-button",
          leftText: "Hủy",
          rightText: "Nộp đơn",
          onLeft: closeModal,
          onRight: () => {
            closeModal();
            setPendingWarnings(warnings);
            setTimeout(() => handleCreateRequest(), 0);
          },
        });
        return;
      }

      setPendingWarnings([]);
      await handleCreateRequest();
    } catch (error: any) {
      setLoading(false);
      showModal({
        image: images.iconError,
        message:
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Không thể kiểm tra dữ liệu đơn",
      });
    }
  };

  return (
    <Page className="late-page">
      <Box className="late-header">
        <Box className="late-header-content">
          <Box className="late-back" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          <Text className="late-title">Đơn xin đến muộn</Text>
        </Box>
        <img src={images.companyLogoWhite} alt="RIPT" className="late-logo" />
      </Box>

      <Box className="late-stat-box">
        <Text className="late-stat-text">
          Số đơn xin đi muộn (được duyệt) tháng này: <span className="late-stat-number">{approvedLateCount}</span>
        </Text>
      </Box>

      <Box className="late-divider" />

      <Box className="late-form">
        <Box className="late-field">
          <Text className="late-label">Ngày <span className="late-required">*</span></Text>
          <Box className="late-date-wrap">
            <input
              type="date"
              className="late-hidden-date"
              value={formatDateForInput(offDate)}
              onChange={onChangeDate}
            />
            <Box className="late-input-shell late-date-display">
              <Text className="late-value-text">{formatDisplayDate(offDate)}</Text>
              <CalendarIcon />
            </Box>
          </Box>
        </Box>

        <Box className="late-field">
          <Text className="late-label">Ca muộn <span className="late-required">*</span></Text>
          <Box
            className={`late-select ${showSessionDropdown ? "active" : ""}`}
            onClick={() => setShowSessionDropdown((prev) => !prev)}
          >
            <Text className="late-value-text">{sessionLabel}</Text>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="late-chevron">
              <path d="M6 9L12 15L18 9" stroke="#94a3b8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          {showSessionDropdown && (
            <Box className="late-select-menu">
              {SESSION_OPTIONS.map((item) => (
                <Box
                  key={item.value}
                  className="late-select-item"
                  onClick={() => {
                    setSession(item.value);
                    setShowSessionDropdown(false);
                  }}
                >
                  <Text className="late-select-item-text">{item.label}</Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box className="late-field">
          <Text className="late-label">Thời gian đến muộn <span className="late-required">*</span></Text>
          <Box className="late-date-wrap">
            <input
              type="time"
              className="late-hidden-date"
              value={formatTimeForInput(timeLate)}
              onChange={onChangeTimeLate}
            />
            <Box className="late-input-shell late-date-display">
              <Text className="late-value-text">{formatTimeForInput(timeLate)}</Text>
              <CalendarIcon />
            </Box>
          </Box>
        </Box>

        <Box className="late-field">
          <Text className="late-label">Lý do đến muộn <span className="late-required">*</span></Text>
          <Input.TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="late-reason"
            rows={4}
          />
        </Box>

        <Box className="late-field">
          <Text className="late-label">Ảnh đính kèm</Text>
          <Box className="late-image-upload">
            {image ? (
              <img src={image} alt="preview" className="late-image-preview" />
            ) : (
              <label htmlFor="late-image-input" className="late-image-placeholder">
                <svg width="62" height="62" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#9aa4af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="#9aa4af"/>
                  <path d="M21 15L16 10L5 21" stroke="#9aa4af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </label>
            )}
            <input
              id="late-image-input"
              type="file"
              accept="image/*"
              className="late-hidden-file"
              onChange={onChangeImage}
            />
          </Box>
        </Box>

        <Button className="late-submit" onClick={validateAndSubmit} disabled={loading} loading={loading}>
          Nộp đơn
        </Button>
      </Box>

      <LoadingSpinner loading={loading} />

      <BaseModal
        visible={modalState.visible}
        turnOffModal={closeModal}
        onLeftText={modalState.onLeft}
        onRightText={modalState.onRight || closeModal}
        config={{
          image: modalState.image,
          title: modalState.title,
          description: modalState.message,
          leftText: modalState.leftText,
          rightText: modalState.rightText,
        }}
        numberOfBtn={modalState.type}
      />
    </Page>
  );
}

export default DonXinDenMuonPage;
