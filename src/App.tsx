import React, { useEffect, useState } from "react";
import axios from "axios";
import { configAppView } from "zmp-sdk/apis";
import { getSystemInfo } from "zmp-sdk";
import { App, ZMPRouter } from "zmp-ui";
import { MainNavigator } from "@/navigation/MainNavigator";
import { MonthlyStatsProvider } from "@/contexts/MonthlyStatsContext";
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import BaseModal from "@/components/common/BaseModal";
import images from "@/assets/images";

function AppRoot() {
  const [showNoNetworkModal, setShowNoNetworkModal] = useState(false);
  useEffect(() => {
    configAppView({
      actionBar: {
        hide: true
      },
      statusBarType: "transparent",
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const updateConnectionState = () => {
      if (typeof navigator !== "undefined") {
        setShowNoNetworkModal(!navigator.onLine);
      }
    };

    const responseInterceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const isNetworkError =
          error?.code === "ERR_NETWORK" ||
          error?.message === "Network Error" ||
          (typeof navigator !== "undefined" && !navigator.onLine);
        if (isNetworkError) {
          setShowNoNetworkModal(true);
        }
        return Promise.reject(error);
      },
    );

    updateConnectionState();
    window.addEventListener("online", updateConnectionState);
    window.addEventListener("offline", updateConnectionState);

    return () => {
      window.removeEventListener("online", updateConnectionState);
      window.removeEventListener("offline", updateConnectionState);
      axios.interceptors.response.eject(responseInterceptorId);
    };
  }, []);

  const handleRetryConnection = () => {
    if (typeof navigator !== "undefined" && navigator.onLine) {
      setShowNoNetworkModal(false);
      window.location.reload();
    }
  };

  return (
    <App theme={getSystemInfo().zaloTheme as any}>
      <MonthlyStatsProvider>
        <AttendanceProvider>
          <ZMPRouter>
            <MainNavigator />
          </ZMPRouter>
        </AttendanceProvider>
      </MonthlyStatsProvider>

      <BaseModal
        visible={showNoNetworkModal}
        onRightText={handleRetryConnection}
        turnOffModal={() => {}}
        config={{
          image: images.noWifi,
          imageClassName: "base-modal-image-no-wifi",
          title: "Không có kết nối mạng",
          description: "Vui lòng kiểm tra lại kết nối mạng",
          rightText: "Thử lại",
        }}
        numberOfBtn="one-button"
      />
    </App>
  );
}

export default AppRoot;
