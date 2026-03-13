import React from "react";
import { Box, Text } from "zmp-ui";
import type { DailyAttendance as DailyAttendanceType } from "@/types";
import "../index.css";

interface DailyAttendanceProps {
  attendance: DailyAttendanceType;
}

export const DailyAttendance: React.FC<DailyAttendanceProps> = ({ attendance }) => {
  return (
    <Box className="daily-attendance">
      <Box className="daily-header">
        <Text className="daily-title">Kết quả trong ngày</Text>
        <Text className="daily-icon">🎯</Text>
      </Box>

      <Box className="sessions-grid">
        {/* Buổi sáng */}
        <Box className="session-card">
          <Box className="session-header">
            <Text className="session-title">Buổi sáng</Text>
            <Text className="session-icon">☀️</Text>
          </Box>
          <Box className="session-content">
            <Text className="session-time">
              Check-in: <span className="session-time-value">{attendance.morning.checkIn || "--:--"}</span>
            </Text>
            <Text className="session-time">
              Check-out: <span className="session-time-value">{attendance.morning.checkOut || "--:--"}</span>
            </Text>
            <Box className="session-rating">
              <Text className="session-rating-label">Đánh giá:</Text>
              <Text className="session-rating-value">0</Text>
            </Box>
          </Box>
        </Box>

        {/* Buổi chiều */}
        <Box className="session-card">
          <Box className="session-header">
            <Text className="session-title">Buổi chiều</Text>
            <Text className="session-icon">🌙</Text>
          </Box>
          <Box className="session-content">
            <Text className="session-time">
              Check-in: <span className="session-time-value">{attendance.afternoon.checkIn || "--:--"}</span>
            </Text>
            <Text className="session-time">
              Check-out: <span className="session-time-value">{attendance.afternoon.checkOut || "--:--"}</span>
            </Text>
            <Box className="session-rating">
              <Text className="session-rating-label">Đánh giá:</Text>
              <Text className="session-rating-value">0</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};