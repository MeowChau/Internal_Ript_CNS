import React from "react";
import { Box, Text } from "zmp-ui";
import "../index.css";

interface LoginErrorProps {
  error: string;
}

export const LoginError: React.FC<LoginErrorProps> = ({ error }) => {
  return (
    <Box className="error-container">
      <Text size="small" className="error-text">
        ⚠️ {error}
      </Text>
    </Box>
  );
};