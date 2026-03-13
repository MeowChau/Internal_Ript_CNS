import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { postLamRemote } from "../../apis/user";
import { useMonthlyStats } from "@/contexts/MonthlyStatsContext";

interface SuccessModalData {
  visible: boolean;
  requestData: any;
}

interface ErrorModalData {
  visible: boolean;
  message: string;
}

interface UseDonLamRemoteReturn {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  session: string;
  setSession: (session: string) => void;
  reason: string;
  setReason: (reason: string) => void;
  loading: boolean;
  workDaysCount: number;
  approvedLeaveDays: number;
  handleSubmit: () => Promise<void>;
  successModal: SuccessModalData;
  errorModal: ErrorModalData;
  closeModals: () => void;
}

export const useDonLamRemote = (): UseDonLamRemoteReturn => {
  const navigate = useNavigate();

  // Lấy thống kê tháng từ context
  const { monthlyStats } = useMonthlyStats();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [session, setSession] = useState("Cả ngày");
  const [reason, setReason] = useState("");
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
   * Format date for API (YYYY-MM-DD)
   */
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);

      const submitBody = {
        ngay_remote: formatDateForAPI(selectedDate),
        ca_lam: getSessionCode(session),
        ly_do: reason,
      };

      const submitResponse = await postLamRemote(submitBody);

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
  }, [selectedDate, session, reason]);

  return {
    selectedDate,
    setSelectedDate,
    session,
    setSession,
    reason,
    setReason,
    loading,
    workDaysCount: monthlyStats.registeredDays,
    approvedLeaveDays: monthlyStats.approvedLeaves,
    handleSubmit,
    successModal,
    errorModal,
    closeModals,
  };
};
