import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  postRegisterAbsentNew,
  postCheckRegisterAbsentNew,
} from "../../apis/user";
import { useMonthlyStats } from "@/contexts/MonthlyStatsContext";

interface SuccessModalData {
  visible: boolean;
  requestData: any; // Data của đơn vừa tạo
}

interface ErrorModalData {
  visible: boolean;
  message: string;
}

interface UseDonXinNghiReturn {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  session: string;
  setSession: (session: string) => void;
  isStudy: boolean;
  setIsStudy: (isStudy: boolean) => void;
  reason: string;
  setReason: (reason: string) => void;
  image: string;
  setImage: (image: string) => void;
  loading: boolean;
  workDaysCount: number;
  approvedLeaveDays: number;
  handleSubmit: () => Promise<void>;
  successModal: SuccessModalData;
  errorModal: ErrorModalData;
  closeModals: () => void;
}

export const useDonXinNghi = (): UseDonXinNghiReturn => {
  const navigate = useNavigate();

  // Lấy thống kê tháng từ context
  const { monthlyStats } = useMonthlyStats();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [session, setSession] = useState("Cả ngày");
  const [isStudy, setIsStudy] = useState(false);
  const [reason, setReason] = useState("");
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Modal states
  const [successModal, setSuccessModal] = useState<SuccessModalData>({
    visible: false,
    requestData: null,
  });
  const [errorModal, setErrorModal] = useState<ErrorModalData>({
    visible: false,
    message: "",
  });

  /**
   * Close all modals
   */
  const closeModals = useCallback(() => {
    setSuccessModal({ visible: false, requestData: null });
    setErrorModal({ visible: false, message: "" });
  }, []);

  /**
   * Validate image size (max 5MB)
   */
  const validateImageSize = (imageBase64: string): boolean => {
    if (!imageBase64) return true;
    const sizeInMB = new Blob([imageBase64]).size / 1000000;
    return sizeInMB <= 5;
  };

  /**
   * Validate form inputs
   */
  const validateForm = (): { valid: boolean; message?: string } => {
    // Check if reason is provided when not studying
    if (!isStudy && !reason.trim()) {
      return {
        valid: false,
        message: "Vui lòng nhập lý do xin nghỉ",
      };
    }

    // Check image size
    if (image && !validateImageSize(image)) {
      return {
        valid: false,
        message: "Kích thước ảnh quá lớn (tối đa 5MB)",
      };
    }

    return { valid: true };
  };

  /**
   * Convert session display text to API format
   */
  const getSessionCode = (sessionText: string): string => {
    switch (sessionText) {
      case "Cả ngày":
        return "ca_ngay";
      case "Sáng":
        return "sang";
      case "Chiều":
        return "chieu";
      default:
        return "ca_ngay";
    }
  };

  /**
   * Handle form submission with two-step process:
   * 1. Check for warnings
   * 2. Submit if confirmed
   */
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);

      // Step 1: Check for warnings
      const checkBody = {
        ngay: selectedDate.getDate(),
        thang: selectedDate.getMonth() + 1,
        nam: selectedDate.getFullYear(),
        buoi: getSessionCode(session),
        is_di_hoc: isStudy,
      };

      const checkResponse = await postCheckRegisterAbsentNew(checkBody);
      const warnings = checkResponse?.data?.data || [];

      // Show warnings and ask for confirmation
      let confirmed = true;
      if (warnings.length > 0) {
        const warningText = warnings.join("\n- ");
        confirmed = window.confirm(
          `Bạn có muốn gửi đơn không?\n- ${warningText}`,
        );
      }

      if (!confirmed) {
        setLoading(false);
        return;
      }

      // Step 2: Submit the request
      const submitBody = {
        canhBao: warnings,
        ngay: selectedDate.getDate(),
        thang: selectedDate.getMonth() + 1,
        nam: selectedDate.getFullYear(),
        buoi: getSessionCode(session),
        is_di_hoc: isStudy,
        lyDo: isStudy ? "Đi học" : reason,
        anh_dinh_kem: image,
      };

      const submitResponse = await postRegisterAbsentNew(submitBody);

      // Success - Show success modal
      setSuccessModal({
        visible: true,
        requestData: submitResponse?.data?.data || null,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Gửi đơn không thành công";

      // Show error modal
      setErrorModal({
        visible: true,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedDate, session, isStudy, reason, image]);

  return {
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
    workDaysCount: monthlyStats.registeredDays,
    approvedLeaveDays: monthlyStats.approvedLeaves,
    handleSubmit,
    successModal,
    errorModal,
    closeModals,
  };
};
