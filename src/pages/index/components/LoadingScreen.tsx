import React from "react";
import { Box, Text, Spinner } from "zmp-ui";
import "../index.css";

export const LoadingScreen: React.FC = () => {
  return (
    <Box className="loading-container">
      <Spinner />
      <Text className="loading-text">Đang tải...</Text>
    </Box>
  );
};