/**
 * This is the main navigator for the Zalo Mini App.
 * It displays the routes and screens available in the application.
 * 
 * You'll likely spend most of your time in this file when adding new screens.
 */
import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

// Import screen components
import IndexPage from "@/pages/index";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import NotificationsPage from "@/pages/notifications";
import ProfilePage from "@/pages/profile";
import ChangePasswordPage from "@/pages/profile/components/ChangePassword";

/**
 * Utilities screens
 */
import UtilitiesPage from "@/pages/utilities";
import RequestsPage from "@/pages/requests";
import WorkSchedulePage from "@/pages/work-schedule";
import RegisterSchedulePage from "@/pages/register-schedule";
import DonXinNghiPage from "@/pages/requests/components/DonXinNghi";
import DonXinDenMuonPage from "@/pages/requests/components/DonXinDenMuon";
import DonXinVeSomPage from "@/pages/requests/components/DonXinVeSom";
import DangKyLamThemPage from "@/pages/requests/components/DangKyLamThem";
import DonLamRemotePage from "@/pages/requests/components/DonXinLamRemote";
import DonXinOTPage from "@/pages/requests/components/DonXinOT";

/**
 * Screen names from ScreenNames.ts
 */
import * as screenNames from "./ScreenNames";

/**
 * This defines the routes available in the Mini App.
 * Each route corresponds to a screen component.
 */
export function MainNavigator() {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle browser/phone back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Check if we're on an exit route
      if (canExit(location.pathname)) {
        // Allow the app to exit
        return;
      }
      
      // For other routes, stay within the miniapp
      event.preventDefault();
      navigate(-1);
    };

    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, navigate]);

  return (
    <Routes>
      {/* Index Screen - Check authentication and redirect */}
      <Route path="/" element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Landing/Index Screen (for backward compatibility) */}
      <Route path="/index" element={<IndexPage />} />
      
      {/* Main App Screens */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/change-password" element={<ChangePasswordPage />} />
      
      {/* Utilities Section */}
      <Route path="/utilities" element={<UtilitiesPage />} />
      <Route path="/utilities/requests" element={<RequestsPage />} />
      <Route path="/utilities/requests/leave" element={<DonXinNghiPage />} />
      <Route path="/requests/late" element={<DonXinDenMuonPage />} />
      <Route path="/requests/early" element={<DonXinVeSomPage />} />
      <Route path="/requests/overtime" element={<DonXinOTPage />} />
      <Route path="/utilities/requests/extra-work" element={<DangKyLamThemPage />} />
      <Route path="/requests/remote" element={<DonLamRemotePage />} />
      <Route path="/utilities/work-schedule" element={<WorkSchedulePage />} />
      <Route path="/utilities/register-schedule" element={<RegisterSchedulePage />} />
    </Routes>
  );
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button.
 * 
 * Anything not on this list will be a standard `back` action.
 */
const exitRoutes = ["/home"];
export const canExit = (routeName: string) => exitRoutes.includes(routeName);
