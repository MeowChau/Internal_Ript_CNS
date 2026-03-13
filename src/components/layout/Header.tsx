import React from "react";
import { Box, Text } from "zmp-ui";
import images from "@/assets/images";
import "./Header.css";

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showLogo = false }) => {
  return (
    <Box className="page-header">
      {title && <Text className="page-header-title">{title}</Text>}
      {showLogo && (
        <Box className="page-header-logo">
          <img src={images.companyLogoWhite} alt="RIPT Logo" className="header-logo-img" />
        </Box>
      )}
    </Box>
  );
};