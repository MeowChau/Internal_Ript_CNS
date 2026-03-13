import React from "react";
import Lottie from "lottie-react";

interface LottieIconProps {
  animationData: object;
  className?: string;
  style?: React.CSSProperties;
  loop?: boolean;
  width?: number | string;
  height?: number | string;
}

export const LottieIcon: React.FC<LottieIconProps> = ({
  animationData,
  className,
  style,
  loop = true,
  width,
  height,
}) => {
  const containerStyle: React.CSSProperties = {
    width: width ?? "100%",
    height: height ?? "100%",
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      <Lottie animationData={animationData} loop={loop} style={containerStyle} />
    </div>
  );
};
