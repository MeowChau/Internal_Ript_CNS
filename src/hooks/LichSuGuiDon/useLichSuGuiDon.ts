import { useState, useCallback, useEffect } from "react";
import moment from "moment";
import { postDonXinNew } from "../../apis/user";
import { TypeInfoDon } from "../../interfaces/TypeAPI";

// Request types matching the constants
export const LOAI_DON_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "Đơn xin nghỉ", label: "Đơn xin nghỉ" },
  { value: "Đơn xin đến muộn", label: "Đơn xin đến muộn" },
  { value: "Đơn xin về sớm", label: "Đơn xin về sớm" },
  { value: "Đơn xin làm ngoài giờ", label: "Đơn xin làm ngoài giờ" },
  { value: "Đơn xin đi công tác", label: "Đơn xin đi công tác" },
];

// Status options
export const TRANG_THAI_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "Chờ duyệt", label: "Chờ duyệt" },
  { value: "Duyệt", label: "Duyệt" },
  { value: "Không duyệt", label: "Không duyệt" },
];

// Filter period options
export const FILTER_PERIOD_OPTIONS = [
  { value: "month", label: "Theo tháng" },
  { value: "day", label: "Theo ngày" },
];

interface UseLichSuGuiDonReturn {
  // State
  requests: TypeInfoDon[];
  loading: boolean;
  selectedDate: Date;
  selectedMonth: number;
  selectedYear: number;
  loaiDon: string;
  trangThai: string;
  filterPeriod: "month" | "day";

  // Methods
  setSelectedDate: (date: Date) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  setLoaiDon: (loai: string) => void;
  setTrangThai: (status: string) => void;
  setFilterPeriod: (period: "month" | "day") => void;
  refreshData: () => Promise<void>;
}

export function useLichSuGuiDon(): UseLichSuGuiDonReturn {
  const [requests, setRequests] = useState<TypeInfoDon[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [loaiDon, setLoaiDon] = useState<string>("");
  const [trangThai, setTrangThai] = useState<string>("");
  const [filterPeriod, setFilterPeriod] = useState<"month" | "day">("month");

  // Build API request body
  const getRequestBody = useCallback(() => {
    let ngay_bat_dau = "";
    let ngay_ket_thuc = "";

    if (filterPeriod === "month") {
      // For month: start from day 1 of selected month to day 1 of next month
      ngay_bat_dau = `${selectedYear}-${selectedMonth}-1`;
      const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
      const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
      ngay_ket_thuc = `${nextYear}-${nextMonth}-1`;
    } else {
      // For day: both start and end are the same day
      const dayPick = `${selectedDate.getFullYear()}-${
        selectedDate.getMonth() + 1
      }-${selectedDate.getDate()}`;
      ngay_bat_dau = dayPick;
      ngay_ket_thuc = dayPick;
    }

    const body: {
      ngay_bat_dau: string;
      ngay_ket_thuc: string;
      trang_thai: string;
      loai_don: string;
    } = {
      ngay_bat_dau,
      ngay_ket_thuc,
      trang_thai: trangThai || "Tất cả",
      loai_don: loaiDon || "Tất cả",
    };

    return body;
  }, [
    loaiDon,
    trangThai,
    selectedDate,
    selectedMonth,
    selectedYear,
    filterPeriod,
  ]);

  // Fetch requests from API
  const refreshData = useCallback(async () => {
    setLoading(true);

    try {
      const body = getRequestBody();

      const response = await postDonXinNew(body);
      const allRequests = response?.data || [];

      setRequests(allRequests);
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [getRequestBody]);

  // Fetch data when filters change
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    requests,
    loading,
    selectedDate,
    selectedMonth,
    selectedYear,
    loaiDon,
    trangThai,
    filterPeriod,
    setSelectedDate,
    setSelectedMonth,
    setSelectedYear,
    setLoaiDon,
    setTrangThai,
    setFilterPeriod,
    refreshData,
  };
}
