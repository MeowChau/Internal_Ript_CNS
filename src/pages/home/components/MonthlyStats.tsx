import React from "react";
import { Box, Text } from "zmp-ui";
import type { MonthlyStats } from "@/types";
import "../index.css";

interface MonthlyStatsProps {
  stats: MonthlyStats;
}

export const MonthlyStatsView: React.FC<MonthlyStatsProps> = ({ stats }) => {
  return (
    <Box className="stats-card">
      <Box className="stats-header">
        <Text className="stats-title">Thống kê tháng</Text>
        <Text className="stats-icon">📊</Text>
      </Box>

      <Box className="stats-content">
        <Box className="stats-item">
          <Text className="stats-label">Số buổi làm việc cơ bản:</Text>
          <Text className="stats-value">{stats.workDays}</Text>
        </Box>
        <Box className="stats-item">
          <Text className="stats-label">Số buổi đăng ký làm:</Text>
          <Text className="stats-value">{stats.registeredDays}</Text>
        </Box>
        <Box className="stats-item">
          <Text className="stats-label">Số buổi xin nghỉ được duyệt:</Text>
          <Text className="stats-value">{stats.approvedLeaves}</Text>
        </Box>
        <Box className="stats-item">
          <Text className="stats-label">Số buổi xin đi muộn được duyệt:</Text>
          <Text className="stats-value">{stats.lateApprovals}</Text>
        </Box>
        <Box className="stats-item">
          <Text className="stats-label">Số buổi xin về sớm được duyệt:</Text>
          <Text className="stats-value">{stats.earlyLeaveApprovals}</Text>
        </Box>
        <Box className="stats-item-last">
          <Text className="stats-label">Số giờ OT dự kiến:</Text>
          <Text className="stats-value">{stats.overtimeHours}</Text>
        </Box>
      </Box>
    </Box>
  );
};