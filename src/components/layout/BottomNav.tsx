import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Box, Text, Button } from "zmp-ui";
import { useNavigate, useLocation } from "react-router-dom";
import { HiXCircle } from "react-icons/hi";
import { BottomTabIcon } from "@/components/icons/BottomTabIcon";
import { useAttendanceContext } from "@/contexts/AttendanceContext";
import images from "@/assets/images";
import "./BottomNav.css";

/**
 * BottomNav Component
 * 
 * Optimizations applied to prevent lag when switching tabs:
 * 1. React.memo with custom comparison to prevent unnecessary re-renders
 * 2. useCallback for all event handlers to maintain referential equality
 * 3. useMemo for navItems array to prevent recreation on every render
 * 4. Throttle navigation clicks (500ms) to prevent rapid tap issues
 * 5. Pending state to immediately disable during navigation
 * 6. CSS hardware acceleration (transform: translateZ(0), will-change)
 * 7. touch-action: manipulation to prevent touch delay
 * 8. Reduced transition duration (0.2s) for snappier feel
 */

interface BottomNavProps {
  activeTab?: string;
  onCheckIn?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = React.memo(({ activeTab, onCheckIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCheckOut, loading } = useAttendanceContext();

  // Navigation throttle state
  const lastNavigationTime = useRef(0);
  const isNavigatingRef = useRef(false);
  const NAVIGATION_THROTTLE = 180;

  const getCurrentTab = useCallback(() => {
    if (activeTab) return activeTab;

    const path = location.pathname;
    if (path === "/home") return "home";
    if (path.startsWith("/utilities")) return "utilities";
    if (path === "/notifications") return "notifications";
    if (path === "/profile") return "profile";
    return "home";
  }, [activeTab, location.pathname]);

  const currentTab = getCurrentTab();

  // Release navigation lock as soon as route changes
  useEffect(() => {
    isNavigatingRef.current = false;
  }, [location.pathname]);

  // Memoize navItems to prevent recreation on every render
  const navItems = useMemo(() => [
    { id: "home", icon: "home", label: "Trang chủ", route: "/home" },
    { id: "utilities", icon: "utilities", label: "Tiện ích", route: "/utilities" },
    { id: "notifications", icon: "notifications", label: "Thông báo", route: "/notifications" },
    { id: "profile", icon: "profile", label: "Cá nhân", route: "/profile" },
  ], []);

  // Throttled navigation handler
  const handleNavClick = useCallback((route: string, itemId: string) => {
    const now = Date.now();

    // Check if already navigating or too soon
    if (isNavigatingRef.current || now - lastNavigationTime.current < NAVIGATION_THROTTLE) {
      return; // Ignore rapid clicks
    }

    // Only navigate if different tab
    if (currentTab !== itemId) {
      isNavigatingRef.current = true;
      lastNavigationTime.current = now;

      try {
        navigate(route, { replace: false });
      } catch {
        isNavigatingRef.current = false;
      } finally {
        // Fallback unlock in case route change event is delayed
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, NAVIGATION_THROTTLE);
      }
    }
  }, [currentTab, navigate]);

  const handleCheckInClick = useCallback(() => {
    const now = Date.now();
    if (isNavigatingRef.current || now - lastNavigationTime.current < NAVIGATION_THROTTLE) {
      return;
    }

    lastNavigationTime.current = now;

    // Nếu không ở trang home, navigate về home trước
    if (currentTab !== "home") {
      isNavigatingRef.current = true;

      try {
        navigate("/home", { replace: false });
      } catch {
        isNavigatingRef.current = false;
      } finally {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, NAVIGATION_THROTTLE);
      }
    } else if (onCheckIn) {
      // Nếu đã ở home và có callback, gọi callback
      onCheckIn();
    }
  }, [currentTab, navigate, onCheckIn]);

  return (
    <Box className="bottom-nav">
      <Box className="nav-container">
        {/* First 2 nav items */}
        {navItems.slice(0, 2).map((item) => (
          <Box
            key={item.id}
            className="nav-item"
            onClick={() => handleNavClick(item.route, item.id)}
          >
            <BottomTabIcon
              name={item.icon}
              size={24}
              color={currentTab === item.id ? "#1e40af" : "#9ca3af"}
              className={currentTab === item.id ? "nav-icon-active" : "nav-icon"}
            />
            <Text className={currentTab === item.id ? "nav-label-active" : "nav-label"}>
              {item.label}
            </Text>
          </Box>
        ))}

        {/* Check-in Button - LUÔN HIỂN THỊ */}
        <Box className="check-in-button-container">
          <Button
            onClick={handleCheckInClick}
            loading={loading}
            disabled={loading}
            className="check-in-button"
          >
            {loading ? null : (
              <img
                src={isCheckOut ? images.checkout : images.checkin}
                alt={isCheckOut ? "check-out" : "check-in"}
                className="clock-check-icon"
                style={{ width: '44px', height: '44px', objectFit: 'contain' }}
              />
            )}
          </Button>
        </Box>

        {/* Last 2 nav items */}
        {navItems.slice(2).map((item) => (
          <Box
            key={item.id}
            className="nav-item"
            onClick={() => handleNavClick(item.route, item.id)}
          >
            <BottomTabIcon
              name={item.icon}
              size={24}
              color={currentTab === item.id ? "#1e40af" : "#9ca3af"}
              className={currentTab === item.id ? "nav-icon-active" : "nav-icon"}
            />
            <Text className={currentTab === item.id ? "nav-label-active" : "nav-label"}>
              {item.label}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo - only re-render if these props change
  return prevProps.activeTab === nextProps.activeTab &&
    prevProps.onCheckIn === nextProps.onCheckIn;
});