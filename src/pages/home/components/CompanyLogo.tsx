import React from "react";
import { Box, Text } from "zmp-ui";
import "../index.css";

export const CompanyLogo: React.FC = () => {
  return (
    <Box className="company-logo">
      <Box className="logo-left">
        <Box className="logo-icon">
          <svg viewBox="0 0 100 100" className="logo-svg">
            <circle cx="50" cy="50" r="45" fill="#1e3a8a" />
            <path d="M 30 35 L 50 45 L 70 35 L 70 65 L 50 75 L 30 65 Z" fill="white" />
          </svg>
        </Box>
        <Text className="logo-text">RIPT</Text>
      </Box>
      <Box className="logo-illustration">
        <svg viewBox="0 0 200 150" className="working-illustration">
          <rect x="40" y="60" width="80" height="60" rx="5" fill="#3b82f6" opacity="0.2"/>
          <rect x="50" y="70" width="60" height="40" rx="3" fill="#3b82f6" opacity="0.3"/>
          <circle cx="100" cy="50" r="15" fill="#fbbf24"/>
          <rect x="140" y="80" width="30" height="40" rx="3" fill="#6b7280" opacity="0.3"/>
        </svg>
      </Box>
    </Box>
  );
};