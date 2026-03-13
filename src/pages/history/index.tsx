import React from "react";
import { Page, Box, Text, Select } from "zmp-ui";
import moment from "moment";
import { useLichSuGuiDon, LOAI_DON_OPTIONS, TRANG_THAI_OPTIONS, FILTER_PERIOD_OPTIONS } from "../../hooks/LichSuGuiDon";
import { TypeInfoDon } from "../../interfaces/TypeAPI";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "./index.css";

const { Option } = Select;

// Helper function to get request type label
const getRequestTypeLabel = (registerType: string, loaiDon?: string): string => {
  // If loaiDon is available, use it directly (already in Vietnamese)
  if (loaiDon) return loaiDon;
  
  // Otherwise, convert registerType to Vietnamese
  switch (registerType) {
    case "Absent":
      return "Đơn xin nghỉ";
    case "Late":
      return "Đơn xin đến muộn";
    case "Early":
      return "Đơn xin về sớm";
    case "OT":
      return "Đơn xin làm ngoài giờ";
    default:
      return registerType || "Đơn xin";
  }
};

// Helper function to get status label and color
const getStatusInfo = (trangThaiDon: string): { label: string; color: string } => {
  switch (trangThaiDon) {
    case "Processing":
    case "Chờ duyệt":
      return { label: "Chờ duyệt", color: "#FFA500" };
    case "Accepted":
    case "Duyệt":
      return { label: "Duyệt", color: "#10B981" };
    case "Rejected":
    case "Không duyệt":
      return { label: "Không duyệt", color: "#EF4444" };
    default:
      return { label: trangThaiDon, color: "#6B7280" };
  }
};

// Helper function to get Vietnamese day name
const getDayName = (dayNumber: number): string => {
  const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  return days[dayNumber];
};

// Request item component
const RequestItem: React.FC<{ item: TypeInfoDon }> = ({ item }) => {
  const statusInfo = getStatusInfo(item.trangThaiDon);
  const requestDate = moment(`${item.nam}-${item.thang}-${item.ngay}`, "YYYY-M-D");
  const dayName = getDayName(requestDate.day());

  return (
    <Box className="history-request-item">
      <Box className="history-request-header">
        <Text.Title className="history-request-title">
          {getRequestTypeLabel(item.registerType, item.loaiDon)}
        </Text.Title>
        <Box
          className="history-status-badge"
          style={{ backgroundColor: statusInfo.color }}
        >
          <Text className="history-status-text">{statusInfo.label}</Text>
        </Box>
      </Box>
      <Text className="history-request-date">
        {requestDate.format("DD/MM/YYYY")} ({dayName})
      </Text>
    </Box>
  );
};

function HistoryPage() {
  const hook = useLichSuGuiDon();

  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    hook.setSelectedMonth(value);
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    hook.setSelectedYear(value);
  };

  // Generate year options (current year ± 2 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  return (
    <Page className="history-page">
      <Box className="history-header">
        <Text.Title className="history-title">Lịch sử gửi đơn</Text.Title>
      </Box>

      <Box className="history-filters">
        {/* Filter Period */}
        <Box className="history-filter-row">
          <Select
            value={hook.filterPeriod}
            onChange={(value) => hook.setFilterPeriod(value as "month" | "day")}
            className="history-select"
          >
            {FILTER_PERIOD_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value} title={option.label} />
            ))}
          </Select>

          {/* Date/Month Selector */}
          {hook.filterPeriod === "month" ? (
            <Box className="history-month-selector">
              <select
                value={hook.selectedMonth}
                onChange={handleMonthChange}
                className="history-month-select"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    Tháng {month}
                  </option>
                ))}
              </select>
              <select
                value={hook.selectedYear}
                onChange={handleYearChange}
                className="history-year-select"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </Box>
          ) : (
            <input
              type="date"
              value={moment(hook.selectedDate).format("YYYY-MM-DD")}
              onChange={(e) => hook.setSelectedDate(new Date(e.target.value))}
              className="history-date-input"
            />
          )}
        </Box>

        {/* Request Type Filter */}
        <Select
          value={hook.loaiDon}
          onChange={(value) => hook.setLoaiDon(value as string)}
          className="history-select"
          placeholder="Loại đơn"
        >
          {LOAI_DON_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value} title={option.label} />
          ))}
        </Select>

        {/* Status Filter */}
        <Select
          value={hook.trangThai}
          onChange={(value) => hook.setTrangThai(value as string)}
          className="history-select"
          placeholder="Trạng thái"
        >
          {TRANG_THAI_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value} title={option.label} />
          ))}
        </Select>
      </Box>

      {/* Request List */}
      <Box className="history-content">
        {hook.loading ? (
          <Box className="history-loading">
            <LoadingSpinner />
          </Box>
        ) : hook.requests.length === 0 ? (
          <Box className="history-empty">
            <Text className="history-empty-text">Không có đơn nào</Text>
          </Box>
        ) : (
          <Box className="history-list">
            {hook.requests.map((item) => (
              <RequestItem key={item._id} item={item} />
            ))}
          </Box>
        )}
      </Box>
    </Page>
  );
}

export default HistoryPage;