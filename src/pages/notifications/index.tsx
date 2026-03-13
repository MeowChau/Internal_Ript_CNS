import React, { useState } from "react";
import { Page, Box, Text } from "zmp-ui";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import "./index.css";

function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <Page className="notifications-page">
      <Header title="Thông báo" showLogo />

      {/* Tabs */}
      <Box className="notifications-tabs">
        <Box
          className={`notification-tab ${activeTab === "company" ? "active" : ""}`}
          onClick={() => setActiveTab("company")}
        >
          <Text className={`tab-text ${activeTab === "company" ? "active" : ""}`}>
            Công ty
          </Text>
        </Box>
        <Box
          className={`notification-tab ${activeTab === "other" ? "active" : ""}`}
          onClick={() => setActiveTab("other")}
        >
          <Text className={`tab-text ${activeTab === "other" ? "active" : ""}`}>
            Khác
          </Text>
        </Box>
      </Box>

      {/* Content */}
      <Box className="notifications-content">
        {activeTab === "company" && (
          <Box className="empty-notifications">
            <Text className="empty-text">Không có thông báo nào</Text>
          </Box>
        )}

        {activeTab === "other" && (
          <Box className="empty-notifications">
            <Text className="empty-text">Không có thông báo nào</Text>
          </Box>
        )}
      </Box>

      {/* Floating Action Buttons */}
      <Box className="floating-actions">
        <Box className="fab-button fab-up">
          <svg viewBox="0 0 225 225" fill="white" className="fab-icon">
            <path d="M71.1 17.8c-5.7 3.1-7.1 7-7.1 19.9V49H39c-20 0-25.7.3-27.9 1.4-4.1 2.2-8.8 8-10 12.3C.5 64.9 0 77.2 0 91.7V117h225.1l-.3-27.3c-.3-26.9-.3-27.3-2.8-31.5-1.4-2.6-4.2-5.4-6.6-6.8-4-2.4-4.5-2.4-29.2-2.4H161V37.2c0-10-.3-12.2-2-15-3.7-6-4.9-6.2-46.7-6.2-34.7 0-38.1.1-41.2 1.8zm73.4 22.7v8h-64l-.3-6.9c-.2-3.8-.1-7.5.2-8.3.5-1.1 6.2-1.3 32.3-1.1l31.8.3v8zM.2 162.2c.3 38.1.3 37.7 9.3 43.3l4.8 3 95.6.3c66.9.2 96.9-.1 100-.8 6.4-1.6 10-4.6 12.7-10.4 2.3-5 2.4-5.5 2.4-36.9V129h-84v11.1c0 10.9 0 11.1-2.9 14l-2.9 2.9H89.8l-2.9-2.9c-2.9-2.9-2.9-3.1-2.9-14V129H-.1l.3 33.2z"/>
            <path d="m96.2 136.7.3 7.8 15.8.3 15.7.3V129H95.9l.3 7.7z"/>
          </svg>
        </Box>
        <Box className="fab-button fab-message">
          <svg viewBox="0 0 20 19" fill="white" className="fab-icon">
            <path d="M10.912 12.85h3.877V9.944l4.847 4.362-4.846 4.362v-2.908h-3.878V12.85zM17.697.25H2.19A1.939 1.939 0 00.25 2.189V13.82a1.939 1.939 0 001.939 1.939h7.124a5.622 5.622 0 01-.34-1.939 5.816 5.816 0 0110.663-3.208V2.189A1.939 1.939 0 0017.697.25zm0 3.877L9.943 8.974 2.189 4.127V2.19l7.754 4.846 7.754-4.846v1.938z"/>
          </svg>
        </Box>
      </Box>

      <BottomNav activeTab="notifications" />
    </Page>
  );
}

export default NotificationsPage;