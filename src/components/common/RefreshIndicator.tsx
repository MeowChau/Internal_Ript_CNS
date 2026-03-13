import React from "react";
import "./RefreshIndicator.css";

interface RefreshIndicatorProps {
  visible: boolean;
}

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="refresh-indicator">
      <div className="refresh-spinner"></div>
      <span className="refresh-text">Đang cập nhật...</span>
    </div>
  );
};

export default RefreshIndicator;
