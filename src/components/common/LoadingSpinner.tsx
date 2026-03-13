import React from "react";
import { Box } from "zmp-ui";
import { LottieIcon } from "./LottieIcon";
import images from "@/assets/images";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  loading?: boolean;
  customStyle?: React.CSSProperties;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  loading,
  customStyle,
}) => {
  // If loading is undefined, show spinner (default behavior)
  // If loading is explicitly false, don't show
  if (loading === false) {
    return null;
  }

  return (
    <Box className="loading-spinner-overlay" style={customStyle}>
      <LottieIcon
        animationData={images.loading}
        width={35}
        height={35}
        loop={true}
      />
    </Box>
  );
};

export default LoadingSpinner;
