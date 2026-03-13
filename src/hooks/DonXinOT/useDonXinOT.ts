import { useState, useCallback } from "react";
import moment from "moment";
import { postRegisterOTNew, getListQuanLy } from "../../apis/user";

interface Manager {
  id: number;
  ten: string;
  email?: string;
}

export const useDonXinOT = () => {
  const [loading, setLoading] = useState(false);
  const [fromDateTime, setFromDateTime] = useState("");
  const [toDateTime, setToDateTime] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [project, setProject] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(
    null,
  );
  const [managers, setManagers] = useState<Manager[]>([]);

  // Fetch danh sách quản lý
  const fetchManagers = useCallback(async () => {
    try {
      const response = await getListQuanLy();
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setManagers(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách quản lý:", error);
    }
  }, []);

  // Validate form
  const validateForm = useCallback((): {
    valid: boolean;
    message: string;
  } => {
    // Kiểm tra thời gian bắt đầu
    if (!fromDateTime) {
      return { valid: false, message: "Vui lòng chọn thời gian bắt đầu" };
    }

    // Kiểm tra thời gian kết thúc
    if (!toDateTime) {
      return { valid: false, message: "Vui lòng chọn thời gian kết thúc" };
    }

    // Kiểm tra công việc
    if (workDescription.trim() === "") {
      return { valid: false, message: "Vui lòng nhập công việc làm thêm" };
    }

    // Kiểm tra dự án
    if (project.trim() === "") {
      return { valid: false, message: "Vui lòng nhập dự án" };
    }

    // Kiểm tra thời gian hợp lệ
    const from = moment(fromDateTime);
    const to = moment(toDateTime);

    if (!from.isValid() || !to.isValid()) {
      return { valid: false, message: "Thời gian không hợp lệ" };
    }

    if (to.isSameOrBefore(from)) {
      return {
        valid: false,
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      };
    }

    // Kiểm tra thời gian làm thêm hợp lý (tối thiểu 30 phút)
    const durationMinutes = to.diff(from, "minutes");
    if (durationMinutes < 30) {
      return {
        valid: false,
        message: "Thời gian làm thêm phải ít nhất 30 phút",
      };
    }

    return { valid: true, message: "" };
  }, [fromDateTime, toDateTime, workDescription, project]);

  // Gửi đơn xin làm ngoài giờ
  const submitOTRequest = useCallback(async () => {
    const from = moment(fromDateTime);
    const to = moment(toDateTime);

    // APP CŨ dùng .toISOString() - format: "2026-03-16T18:30:00.000Z" (UTC với Z suffix)
    const fromFormatted = from.toDate().toISOString();
    const toFormatted = to.toDate().toISOString();

    const body: any = {
      ngay: from.date(),
      thang: from.month() + 1,
      nam: from.year(),
      thoiGianBatDauLamNgoaiGio: fromFormatted,
      thoiGianKetThucLamNgoaiGio: toFormatted,
      congViecLamNgoaiGio: workDescription.trim(),
      du_an: project.trim(),
    };

    // Thêm người quản lý nếu có
    if (selectedManagerId) {
      body.nguoiQuanLyId = selectedManagerId;
    }

    setLoading(true);
    try {
      const response = await postRegisterOTNew(body);
      setLoading(false);
      return {
        success: true,
        data: response?.data?.data,
        message: "Gửi đơn thành công",
      };
    } catch (error: any) {
      console.error("❌ Lỗi gửi đơn OT:", error);
      console.error("❌ Error response:", error?.response?.data);
      console.error("❌ Error message:", error?.message);
      setLoading(false);
      throw error;
    }
  }, [fromDateTime, toDateTime, workDescription, project, selectedManagerId]);

  return {
    // States
    loading,
    fromDateTime,
    toDateTime,
    workDescription,
    project,
    selectedManagerId,
    managers,

    // Setters
    setFromDateTime,
    setToDateTime,
    setWorkDescription,
    setProject,
    setSelectedManagerId,

    // Methods
    fetchManagers,
    validateForm,
    submitOTRequest,
  };
};
