import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Page, Text, Avatar, Icon, Button, Modal } from "zmp-ui";
import moment from "moment";
import { useAuth } from "@/hooks/login/useAuth";
import { useAttendance } from "@/hooks/DiemDanh/useAttendance";
import { useHome } from "@/hooks/home";
import { useDiemDanh, TYPE_DIEM_DANH } from "@/hooks/DiemDanh";
import { useAttendanceContext } from "@/contexts/AttendanceContext";
import { postLichDKMe } from "@/apis/user";
import { BottomNav } from "@/components/layout/BottomNav";
import { LottieIcon } from "@/components/common/LottieIcon";
import BaseModal from "@/components/common/BaseModal";
import KetQuaDiemDanh from "./components/KetQuaDiemDanh";
import images from "@/assets/images";
import "./index.css";

interface SessionRegisteredTime {
  from: string;
  to: string;
}

interface RegisteredTodaySchedule {
  sang: SessionRegisteredTime | null;
  chieu: SessionRegisteredTime | null;
}

function HomePage() {
  const navigate = useNavigate();
  const { user, loadUser, refreshUser, checkAuth } = useAuth();
  const { attendance, loading: attendanceLoading, reload: reloadAttendance } = useAttendance(user?.id || "");
  const { monthlyStats, loading: statsLoading, refreshing: statsRefreshing, error: statsError, refreshStats } = useHome();
  const { setIsCheckOut, setLoading: setGlobalLoading, hasInitialized, setHasInitialized } = useAttendanceContext();
  const { 
    loading: diemDanhLoading, 
    response: diemDanhResponse, 
    showResultModal, 
    loaiDiemDanh,
    thongTinDiemDanh,
    warningData,
    handleDiemDanh,
    executeDiemDanh,
    closeResultModal,
    refreshData: refreshDiemDanh,
    loadAttendanceDataFromStorage,
  } = useDiemDanh();

  const getAttendanceStatusClass = (trangThai: string | undefined) => {
    if (!trangThai) return "attendance-time-neutral";
    
    const status = trangThai.toLowerCase();
    if (status === "sớm" || status === "đúng giờ") {
      return "attendance-time-success";
    }
    if (status === "muộn") {
      return "attendance-time-danger";
    }
    return "attendance-time-neutral";
  };

  const formatTime = (timeString: string | false | undefined) => {
    if (!timeString || typeof timeString === 'boolean') return "-:-";
    if (timeString === "-:-" || timeString === "--:--") return timeString;
    
    try {
      if (!isNaN(Number(timeString))) {
        return moment(Number(timeString)).format("HH:mm");
      }
      
      if (timeString.includes(":")) {
        return timeString;
      }
      
      const parsed = moment(timeString);
      if (parsed.isValid()) {
        return parsed.format("HH:mm");
      }
      
      return timeString;
    } catch (e) {
      console.warn("⚠️ Failed to format time:", timeString, e);
      return timeString;
    }
  };

  useEffect(() => {
    setIsCheckOut(loaiDiemDanh === "CHECK_OUT");
  }, [loaiDiemDanh, setIsCheckOut]);

  useEffect(() => {
    setGlobalLoading(diemDanhLoading);
  }, [diemDanhLoading, setGlobalLoading]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmCheckoutModal, setShowConfirmCheckoutModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmCheckoutMessage, setConfirmCheckoutMessage] = useState("");
  const [registeredScheduleToday, setRegisteredScheduleToday] =
    useState<RegisteredTodaySchedule>({
      sang: null,
      chieu: null,
    });

  const loadRegisteredScheduleToday = async () => {
    try {
      const now = new Date();
      const body = {
        nam: now.getFullYear(),
        thang: now.getMonth() + 1,
      };

      const res = await postLichDKMe(body);
      const list = res?.data?.data?.danhSachNgayDangKy || [];
      const today = now.getDate();

      const morningRecord = list.find(
        (item: any) =>
          item?.ngay === today &&
          item?.buoi_lam_viec === "sang" &&
          item?.trang_thai_lam_viec === "Đi làm",
      );
      const afternoonRecord = list.find(
        (item: any) =>
          item?.ngay === today &&
          item?.buoi_lam_viec === "chieu" &&
          item?.trang_thai_lam_viec === "Đi làm",
      );

      setRegisteredScheduleToday({
        sang: morningRecord
          ? {
              from: morningRecord?.thoiGianBatDau || "08:00",
              to: morningRecord?.thoiGianKetThuc || "12:00",
            }
          : null,
        chieu: afternoonRecord
          ? {
              from: afternoonRecord?.thoiGianBatDau || "13:30",
              to: afternoonRecord?.thoiGianKetThuc || "17:30",
            }
          : null,
      });
    } catch (error) {
      console.error("Không thể tải lịch đăng ký hôm nay:", error);
      setRegisteredScheduleToday({ sang: null, chieu: null });
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const isAuth = await checkAuth();
        
        if (!isAuth) {
          navigate("/login", { replace: true });
          return;
        }

        if (hasInitialized) {
          setInitialLoading(false);
          return;
        }
        
        const currentUser = await loadUser();
        
        if (currentUser && currentUser.name && currentUser.name !== "User") {
        } else {
          await refreshUser();
        }

        await Promise.all([
          refreshDiemDanh(),
          loadRegisteredScheduleToday(),
        ]);

        setHasInitialized(true);

      } catch (error) {
        console.error("❌ Error in HomePage init:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, [hasInitialized]);

  const handleCheckInOut = async () => {
    if (loaiDiemDanh === "CHECK_OUT") {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      const isMorning = currentHour < 13;
      
      const buoiLamViec = isMorning ? thongTinDiemDanh?.sang : thongTinDiemDanh?.chieu;
      const thoiGianKetThuc = buoiLamViec?.thoiGianKetThuc;
      
      if (!buoiLamViec || !thoiGianKetThuc) {
        setConfirmCheckoutMessage("Buổi làm chưa được tạo. Bạn có chắc chắn muốn checkout không?");
        setShowConfirmCheckoutModal(true);
        return;
      }
      
      const [endHour, endMinute] = String(thoiGianKetThuc).split(':').map(Number);
      const scheduledEndInMinutes = endHour * 60 + endMinute;
      
      if (currentTimeInMinutes < scheduledEndInMinutes) {
        const timeRemaining = scheduledEndInMinutes - currentTimeInMinutes;
        const hours = Math.floor(timeRemaining / 60);
        const mins = timeRemaining % 60;
        let timeStr = "";
        if (hours > 0) timeStr += `${hours} giờ `;
        if (mins > 0) timeStr += `${mins} phút`;
        
        setConfirmCheckoutMessage(`Bạn sắp checkout sớm hơn giờ kết thúc ca làm (còn ${timeStr}). Bạn có chắc chắn muốn checkout không?`);
        setShowConfirmCheckoutModal(true);
        return;
      }
    }
    
    const result = await handleDiemDanh();
    
    if (!result.success && result.error) {
      setErrorMessage(result.error);
      setShowErrorModal(true);
      return;
    }
    
    if (result.success && result.warningData) {
      setShowWarningModal(true);
    }
  };

  const handleConfirmCheckout = async () => {
    setShowConfirmCheckoutModal(false);
    const result = await handleDiemDanh();
    
    if (!result.success && result.error) {
      setErrorMessage(result.error);
      setShowErrorModal(true);
      return;
    }
    
    if (result.success && result.warningData) {
      setShowWarningModal(true);
    }
  };

  const handleCancelCheckout = () => {
    setShowConfirmCheckoutModal(false);
  };

  const handleWarningConfirm = async () => {
    setShowWarningModal(false);
    
    if (!warningData) return;

    switch (warningData.value) {
      case TYPE_DIEM_DANH.NORMAL:
      case TYPE_DIEM_DANH.XIN_LAM_THEM:
        const result = await executeDiemDanh();
        if (result.success) {
          await reloadAttendance();
          await refreshDiemDanh();
        }
        break;

      case TYPE_DIEM_DANH.OT:
        if (loaiDiemDanh === "CHECK_OUT") {
          await executeDiemDanh();
          await reloadAttendance();
          await refreshDiemDanh();
        }
        navigate("/utilities");
        break;

      case TYPE_DIEM_DANH.XIN_NGHI:
        await executeDiemDanh();
        await reloadAttendance();
        await refreshDiemDanh();
        navigate("/requests");
        break;

      case TYPE_DIEM_DANH.VE_SOM:
        if (loaiDiemDanh === "CHECK_OUT") {
          await executeDiemDanh();
          await reloadAttendance();
          await refreshDiemDanh();
        }
        navigate("/requests");
        break;
    }
  };

  const handleWarningCancel = () => {
    setShowWarningModal(false);
  };

  const getWarningModalContent = () => {
    if (!warningData) return { title: "", message: "", buttons: [] };

    const isCheckIn = loaiDiemDanh === "CHECK_IN";

    switch (warningData.value) {
      case TYPE_DIEM_DANH.NORMAL:
        return {
          title: "Xác nhận điểm danh",
          message: warningData.message || "Bạn có chắc chắn muốn điểm danh không?",
          buttons: [
            { text: "Hủy", onClick: handleWarningCancel },
            { text: "Xác nhận", onClick: handleWarningConfirm },
          ],
        };

      case TYPE_DIEM_DANH.OT:
        return {
          title: "Thông báo",
          message: warningData.message,
          buttons: [
            { 
              text: "Không gửi đơn", 
              onClick: async () => {
                setShowWarningModal(false);
                if (!isCheckIn) {
                  await executeDiemDanh();
                  await reloadAttendance();
                  await refreshDiemDanh();
                }
              }
            },
            { text: "Gửi đơn OT", onClick: handleWarningConfirm },
          ],
        };

      case TYPE_DIEM_DANH.XIN_LAM_THEM:
        return {
          title: "Đăng ký làm thêm",
          message: warningData.message,
          buttons: [
            { text: "Hủy", onClick: handleWarningCancel },
            { text: "Xác nhận", onClick: handleWarningConfirm },
          ],
        };

      case TYPE_DIEM_DANH.XIN_NGHI:
        return {
          title: "Thông báo",
          message: warningData.message,
          buttons: [
            { 
              text: "Điểm danh bình thường", 
              onClick: async () => {
                setShowWarningModal(false);
                const result = await executeDiemDanh();
                if (result.success) {
                  await reloadAttendance();
                  await refreshDiemDanh();
                }
              }
            },
            { text: "Đăng ký nghỉ", onClick: handleWarningConfirm },
          ],
        };

      case TYPE_DIEM_DANH.VE_SOM:
        return {
          title: "Thông báo",
          message: warningData.message,
          buttons: [
            { 
              text: "Điểm danh bình thường", 
              onClick: async () => {
                setShowWarningModal(false);
                const result = await executeDiemDanh();
                if (result.success) {
                  await reloadAttendance();
                  await refreshDiemDanh();
                }
              }
            },
            { text: "Đăng ký về sớm", onClick: handleWarningConfirm },
          ],
        };

      default:
        return {
          title: "Thông báo",
          message: warningData.message,
          buttons: [{ text: "OK", onClick: handleWarningCancel }],
        };
    }
  };

  if (initialLoading) {
    return (
      <Page className="home-page-root">
        <Box className="loading-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(30, 58, 138, 0.2)',
            borderTop: '4px solid #1e3a8a',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <Text style={{ color: '#1e3a8a', fontSize: '14px' }}>Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  const warningModalContent = getWarningModalContent();

  return (
    <Page className="home-page-root">
      <BaseModal
        visible={showErrorModal}
        onRightText={() => setShowErrorModal(false)}
        turnOffModal={() => setShowErrorModal(false)}
        config={{
          image: images.icDialog,
          title: "Thông báo",
          description: errorMessage,
          rightText: "Đóng",
        }}
        numberOfBtn="one-button"
      />

      <BaseModal
        visible={showConfirmCheckoutModal}
        config={{
          image: images.icDialog,
          title: "Thông báo",
          description: confirmCheckoutMessage,
          leftText: "Hủy",
          rightText: "Đồng ý",
        }}
        onLeftText={handleCancelCheckout}
        onRightText={handleConfirmCheckout}
        turnOffModal={handleCancelCheckout}
        numberOfBtn="two-button"
      />

      <Modal
        visible={showWarningModal}
        title={warningModalContent.title}
        onClose={handleWarningCancel}
        actions={warningModalContent.buttons.map((btn) => ({
          text: btn.text,
          close: false,
          onClick: btn.onClick,
        }))}
      >
        <Box p={4}>
          <Text>{warningModalContent.message}</Text>
        </Box>
      </Modal>

      <KetQuaDiemDanh
        visible={showResultModal}
        onShowModal={closeResultModal}
        response={diemDanhResponse}
        loaiDiemDanh={loaiDiemDanh}
      />

      <Box
        className="home-header-top"
        style={{ 
          backgroundImage: `url(${images.homeLayout})`, 
          backgroundSize: "100% 100%",
          backgroundPosition: "center center", 
          backgroundColor: "#1e3a8a" 
        }}
      >
        <span className="decoration decoration-1">✦</span>
        <span className="decoration decoration-2">✧</span>
        <span className="decoration decoration-3">✦</span>
        <span className="decoration decoration-4">✿</span>
        <span className="decoration decoration-5">✦</span>
        <span className="decoration decoration-6">✧</span>

        <Box className="user-info-top">
          <Box className="user-details">
            <Text className="user-name">{user?.name || "Chưa cập nhật"}</Text>
            <Text className="user-team">Đội: {user?.team || "Chưa cập nhật"}</Text>
            <Text className="user-role">Vai trò: {user?.role || "Nhân viên Parttime"}</Text>
          </Box>
          <Box className="avatar-wrapper">
            <span className="avatar-deco avatar-deco-1">◆</span>
            <span className="avatar-deco avatar-deco-2">◆</span>
            <Avatar
              src={user?.avatar || images.ava}
              size={70}
              className="user-avatar"
            />
          </Box>
        </Box>
      </Box>

      <Box className="home-content-scroll">
        <Box className="logo-illustration-section">
          <Box className="company-logo-block">
            <img src={images.companyLogo} alt="" className="company-logo-img" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </Box>
          <Box className="desk-illustration">
            <LottieIcon animationData={images.workingMan} width={140} height={105} />
          </Box>
        </Box>

        <Box className="monthly-stats-section">
          <Text className="section-title">
            Thống kê tháng{" "}
            <span className="title-icon title-lottie">
              <LottieIcon animationData={images.statistic} width={24} height={24} />
            </span>
          </Text>
          
          {statsLoading && (
            <Box className="stats-loading">
              <Text className="loading-text">Đang tải thống kê...</Text>
            </Box>
          )}
          {statsError && (
            <Box className="stats-error">
              <Text className="error-text">{statsError}</Text>
            </Box>
          )}
          {!statsLoading && !statsError && (
            <Box className="stats-card">
              <Box className="stat-line">
                <Text className="stat-label">Số buổi làm việc cơ bản: <span className="stat-value">{monthlyStats.workDays}</span></Text>
              </Box>
              <Box className="stat-line">
                <Text className="stat-label">Số buổi đăng ký làm: <span className="stat-value">{monthlyStats.registeredDays}</span></Text>
              </Box>
              <Box className="stat-line">
                <Text className="stat-label">Số buổi xin nghỉ được duyệt: <span className="stat-value">{monthlyStats.approvedLeaves}</span></Text>
              </Box>
              <Box className="stat-line">
                <Text className="stat-label">Số buổi xin đi muộn được duyệt: <span className="stat-value">{monthlyStats.lateApprovals}</span></Text>
              </Box>
              <Box className="stat-line">
                <Text className="stat-label">Số buổi xin về sớm được duyệt: <span className="stat-value">{monthlyStats.earlyLeaveApprovals}</span></Text>
              </Box>
              <Box className="stat-line stat-line-last">
                <Text className="stat-label">Số giờ OT dự kiến: <span className="stat-value">{monthlyStats.overtimeHours}</span></Text>
              </Box>
            </Box>
          )}
        </Box>

        <Box className="daily-attendance-section">
          <Text className="section-title">
            Kết quả trong ngày{" "}
            <span className="title-icon title-lottie">
              <LottieIcon animationData={images.aim} width={28} height={28} />
            </span>
          </Text>
          <Box className="attendance-cards">
            <Box className="attendance-card">
              <Box className="session-title-row">
                <Text className="session-title">Buổi sáng</Text>
                <img src={images.morning} alt="" className="session-icon-img" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </Box>
              {(() => {
                const buoiSang = thongTinDiemDanh?.sang;
                const checkInTime = buoiSang?.thoi_gian_check_in;
                const checkOutTime = buoiSang?.thoi_gian_check_out;
                const checkInStatus = typeof buoiSang?.trang_thai_check_in === 'string' 
                  ? buoiSang.trang_thai_check_in 
                  : undefined;
                const checkOutStatus = typeof buoiSang?.trang_thai_check_out === 'string' 
                  ? buoiSang.trang_thai_check_out 
                  : undefined;
                const evaluation = buoiSang?.danh_gia_thoi_gian_lam_viec ?? 0;

                const checkInFormatted = formatTime(checkInTime);
                const checkOutFormatted = formatTime(checkOutTime);
                const checkInClass = getAttendanceStatusClass(checkInStatus);
                const checkOutClass = getAttendanceStatusClass(checkOutStatus);

                return (
                  <>
                    <Text className="attendance-time">
                      Check-in: <span className={checkInClass}>{checkInFormatted}</span>
                    </Text>
                    <Text className="attendance-time">
                      Check-out: <span className={checkOutClass}>{checkOutFormatted}</span>
                    </Text>
                    <Text className="attendance-eval">Đánh giá: {evaluation}</Text>
                  </>
                );
              })()}
            </Box>
            <Box className="attendance-card">
              <Box className="session-title-row">
                <Text className="session-title">Buổi chiều</Text>
                <img src={images.afternoon} alt="" className="session-icon-img" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </Box>
              {(() => {
                const buoiChieu = thongTinDiemDanh?.chieu;
                const checkInTime = buoiChieu?.thoi_gian_check_in;
                const checkOutTime = buoiChieu?.thoi_gian_check_out;
                const checkInStatus = typeof buoiChieu?.trang_thai_check_in === 'string' 
                  ? buoiChieu.trang_thai_check_in 
                  : undefined;
                const checkOutStatus = typeof buoiChieu?.trang_thai_check_out === 'string' 
                  ? buoiChieu.trang_thai_check_out 
                  : undefined;
                const evaluation = buoiChieu?.danh_gia_thoi_gian_lam_viec ?? 0;

                const checkInFormatted = formatTime(checkInTime);
                const checkOutFormatted = formatTime(checkOutTime);
                const checkInClass = getAttendanceStatusClass(checkInStatus);
                const checkOutClass = getAttendanceStatusClass(checkOutStatus);

                return (
                  <>
                    <Text className="attendance-time">
                      Check-in: <span className={checkInClass}>{checkInFormatted}</span>
                    </Text>
                    <Text className="attendance-time">
                      Check-out: <span className={checkOutClass}>{checkOutFormatted}</span>
                    </Text>
                    <Text className="attendance-eval">Đánh giá: {evaluation}</Text>
                  </>
                );
              })()}
            </Box>
          </Box>
        </Box>
      </Box>

      <BottomNav 
        activeTab="home" 
        onCheckIn={handleCheckInOut}
      />
    </Page>
  );
}

export default HomePage;