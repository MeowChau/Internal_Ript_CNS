import React from "react";
import { Box, Text, Button } from "zmp-ui";
import { BottomTabIcon } from "@/components/icons/BottomTabIcon";
import "../index.css";

interface BottomNavProps {
  onCheckIn: () => void;
  loading?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onCheckIn, loading }) => {
  return (
    <Box className="bottom-nav">
      <Box className="nav-container">
        {/* Trang chủ */}
        <Box className="nav-item">
          <BottomTabIcon name="home" size={24} color="#1e40af" className="nav-icon-active" />
          <Text className="nav-label-active">Trang chủ</Text>
        </Box>

        {/* Tiện ích */}
        <Box className="nav-item">
          <BottomTabIcon name="utilities" size={24} color="#9ca3af" className="nav-icon" />
          <Text className="nav-label">Tiện ích</Text>
        </Box>

        {/* Check-in Button */}
        <Box className="check-in-button-container">
          <Button
            onClick={onCheckIn}
            loading={loading}
            disabled={loading}
            className="check-in-button"
          >
            <BottomTabIcon name="check-in" size={44} color="#10b981" className="clock-check-icon" />
          </Button>
        </Box>

        {/* Thông báo */}
        <Box className="nav-item">
          <BottomTabIcon name="notifications" size={24} color="#9ca3af" className="nav-icon" />
          <Text className="nav-label">Thông báo</Text>
        </Box>

        {/* Cá nhân */}
        <Box className="nav-item">
          <BottomTabIcon name="profile" size={24} color="#9ca3af" className="nav-icon" />
          <Text className="nav-label">Cá nhân</Text>
        </Box>
      </Box>
    </Box>
  );
};