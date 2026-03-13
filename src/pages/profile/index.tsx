import React, { useEffect } from "react";
import { Page, Box, Text, Avatar } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/login/useAuth";
import { BottomNav } from "@/components/layout/BottomNav";
import { LogoutIcon, LockIcon } from "@/components/icons/UtilityIcons";
import images from "@/assets/images";
import "./index.css";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, loadUser, refreshUser } = useAuth();

  // Load user data when component mounts
  useEffect(() => {
    const initUser = async () => {
      const currentUser = await loadUser();
      if (!currentUser) {
        // If no user in storage, try to refresh from API
        await refreshUser();
      }
    };
    initUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleChangePassword = () => {
    navigate("/profile/change-password");
  };

  return (
    <Page className="profile-page">
      {/* Background image - position absolute like React Native */}
      <Box 
        className="profile-background"
        style={{
          backgroundImage: `url(${images.profileBackground})`,
        }}
      />

      {/* Content */}
      <Box className="profile-content">
        {/* Avatar with 3 layers */}
        <Box className="profile-avatar-container">
          <Box className="profile-avatar-wrapper">
            <Avatar
              src={user?.avatar || images.ava}
              size={105}
              className="profile-avatar"
            />
          </Box>
        </Box>

        {/* User Info below avatar */}
        <Box className="profile-name-section">
          <Text className="profile-name">{user?.name || "Chưa cập nhật"}</Text>
          <Text className="profile-email">
            Email: <Text style={{ fontWeight: '400' }}>{user?.email || "Chưa cập nhật"}</Text>
          </Text>
        </Box>

        {/* Info Card */}
        <Box className="profile-info-card">
          <Box className="info-row">
            <Text className="info-label">Tài khoản</Text>
            <Text className="info-value" style={{ color: '#9ca3af' }}>{user?.username || "Chưa cập nhật"}</Text>
          </Box>
          <Box className="info-row">
            <Text className="info-label">Đội</Text>
            <Text className="info-value" style={{ color: '#9ca3af' }}>{user?.team || "Chưa cập nhật"}</Text>
          </Box>
          <Box className="info-row">
            <Text className="info-label">Số điện thoại</Text>
            <Text className="info-value" style={{ color: '#9ca3af' }}>{user?.phone || "Chưa cập nhật"}</Text>
          </Box>
          <Box className="info-row-last">
            <Text className="info-label">Vai trò</Text>
            <Text className="info-value" style={{ color: '#9ca3af' }}>{user?.role || "Nhân viên Parttime"}</Text>
          </Box>
        </Box>

        {/* Actions */}
        <Box className="profile-actions">
          <Box className="action-item" onClick={handleLogout}>
            <Box className="action-item-left">
              <Box className="action-icon-wrapper">
                <LogoutIcon width={20} height={20} color="#1F2937" />
              </Box>
              <Text className="action-text">Đăng xuất</Text>
            </Box>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="action-arrow">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          <Box className="action-item" onClick={handleChangePassword}>
            <Box className="action-item-left">
              <Box className="action-icon-wrapper">
                <LockIcon width={20} height={20} color="#1F2937" />
              </Box>
              <Text className="action-text">Đổi mật khẩu</Text>
            </Box>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="action-arrow">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
        </Box>
      </Box>

      <BottomNav activeTab="profile" />
    </Page>
  );
}

export default ProfilePage;