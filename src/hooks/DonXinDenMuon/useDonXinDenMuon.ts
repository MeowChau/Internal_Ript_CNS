import { useState, useRef, useCallback } from "react";
import {
  postCheckRegisterLateNew,
  postRegisterLateNew,
  getThoigianLamViec,
} from "../../apis/user";
import moment from "moment";

interface ThoiGianLamViec {
  sang: {
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    trang_thai_lam_viec: string;
  };
  chieu: {
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    trang_thai_lam_viec: string;
  };
}

// Tính khoảng cách theo phút giữa 2 thời gian (HH:mm)
const tinhKhoangCachTheoPhut = (time1: string, time2: string): number => {
  const [h1, m1] = time1.split(":").map(Number);
  const [h2, m2] = time2.split(":").map(Number);
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  return minutes2 - minutes1;
};

export const useDonXinDenMuon = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [session, setSession] = useState<"sang" | "chieu">("sang");
  const [reason, setReason] = useState("");
  const [image, setImage] = useState("");

  const thoiGianLam = useRef<ThoiGianLamViec>({
    sang: {
      thoiGianBatDau: "08:00",
      thoiGianKetThuc: "12:00",
      trang_thai_lam_viec: "",
    },
    chieu: {
      thoiGianBatDau: "13:30",
      thoiGianKetThuc: "17:30",
      trang_thai_lam_viec: "",
    },
  });

  // Lấy thời gian làm việc theo ngày
  const fetchThoiGianLamViec = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const response = await getThoigianLamViec(
        date.getDate(),
        date.getMonth() + 1,
        date.getFullYear(),
      );

      if (response?.data?.data) {
        thoiGianLam.current = response.data.data;
      }
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Lỗi khi lấy thời gian làm việc:", error);
      setLoading(false);
      return false;
    }
  }, []);

  // Validate form
  const validateForm = useCallback((): {
    valid: boolean;
    message: string;
    type?: string;
  } => {
    // Kiểm tra lý do
    if (reason.trim() === "") {
      return { valid: false, message: "Vui lòng nhập lý do đến muộn" };
    }

    // Kiểm tra kích thước ảnh
    if (image) {
      const byteSize = new Blob([image]).size / 1000000; // MB
      if (byteSize > 5) {
        return {
          valid: false,
          message: "Ảnh đính kèm không được vượt quá 5MB",
        };
      }
    }

    // Tính số phút đến muộn
    const thoiGianBatDau =
      session === "sang"
        ? thoiGianLam.current.sang.thoiGianBatDau
        : thoiGianLam.current.chieu.thoiGianBatDau;

    const thoiGianKetThuc =
      session === "sang"
        ? thoiGianLam.current.sang.thoiGianKetThuc
        : thoiGianLam.current.chieu.thoiGianKetThuc;

    const timeSelected = moment(selectedTime).format("HH:mm");
    const soPhutDenMuon = tinhKhoangCachTheoPhut(thoiGianBatDau, timeSelected);
    const soTongPhut = tinhKhoangCachTheoPhut(thoiGianBatDau, thoiGianKetThuc);

    // Kiểm tra thời gian đến muộn phải sau giờ bắt đầu
    if (soPhutDenMuon < 0) {
      return {
        valid: false,
        message: `Thời gian phải muộn hơn ${thoiGianBatDau}`,
      };
    }

    // Kiểm tra thời gian đến muộn phải trước giờ kết thúc
    if (soPhutDenMuon >= soTongPhut) {
      return {
        valid: false,
        message: `Thời gian phải trong khoảng ${thoiGianBatDau}-${thoiGianKetThuc}`,
      };
    }

    // Kiểm tra tổng thời gian làm việc >= 120 phút
    if (soTongPhut - soPhutDenMuon <= 120) {
      return {
        valid: false,
        message:
          "Tổng thời gian làm việc nhỏ hơn 120 phút. Bạn nên gửi đơn xin nghỉ thay vì đến muộn.",
        type: "warning_should_absent",
      };
    }

    return { valid: true, message: "" };
  }, [selectedTime, session, reason, image]);

  // Kiểm tra cảnh báo trùng đơn
  const checkLateWarning = useCallback(async (): Promise<{
    hasWarning: boolean;
    warnings: string[];
    shouldAbsent?: boolean;
  }> => {
    const thoiGianBatDau =
      session === "sang"
        ? thoiGianLam.current.sang.thoiGianBatDau
        : thoiGianLam.current.chieu.thoiGianBatDau;

    const timeSelected = moment(selectedTime).format("HH:mm");
    const soPhutDenMuon = tinhKhoangCachTheoPhut(thoiGianBatDau, timeSelected);

    const body = {
      ngay: selectedDate.getDate(),
      thang: selectedDate.getMonth() + 1,
      nam: selectedDate.getFullYear(),
      phutDenMuon: soPhutDenMuon,
      caLam: session,
    };

    try {
      const response = await postCheckRegisterLateNew(body);
      const data = response?.data?.data;

      // Trường hợp nên gửi đơn nghỉ thay vì đến muộn
      if (data?.value !== undefined) {
        return {
          hasWarning: true,
          warnings: [data?.message || "Nên gửi đơn xin nghỉ thay vì đến muộn"],
          shouldAbsent: true,
        };
      }

      // Trường hợp có cảnh báo khác (trùng đơn, v.v.)
      if (Array.isArray(data) && data.length > 0) {
        return {
          hasWarning: true,
          warnings: data,
          shouldAbsent: false,
        };
      }

      return { hasWarning: false, warnings: [] };
    } catch (error) {
      throw error;
    }
  }, [selectedDate, selectedTime, session]);

  // Gửi đơn xin đến muộn
  const submitLateRequest = useCallback(async () => {
    const thoiGianBatDau =
      session === "sang"
        ? thoiGianLam.current.sang.thoiGianBatDau
        : thoiGianLam.current.chieu.thoiGianBatDau;

    const timeSelected = moment(selectedTime).format("HH:mm");
    const soPhutDenMuon = tinhKhoangCachTheoPhut(thoiGianBatDau, timeSelected);

    const body = {
      ngay: selectedDate.getDate(),
      thang: selectedDate.getMonth() + 1,
      nam: selectedDate.getFullYear(),
      phutDenMuon: soPhutDenMuon,
      caLam: session,
      lyDo: reason,
      anh_dinh_kem: image || undefined,
    };

    setLoading(true);
    try {
      const response = await postRegisterLateNew(body);
      setLoading(false);
      return {
        success: true,
        data: response?.data?.data,
        message: "Gửi đơn thành công",
      };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [selectedDate, selectedTime, session, reason, image]);

  return {
    // States
    loading,
    selectedDate,
    selectedTime,
    session,
    reason,
    image,
    thoiGianLam: thoiGianLam.current,

    // Setters
    setSelectedDate,
    setSelectedTime,
    setSession,
    setReason,
    setImage,

    // Functions
    fetchThoiGianLamViec,
    validateForm,
    checkLateWarning,
    submitLateRequest,
  };
};
