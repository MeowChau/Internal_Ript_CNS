import React from "react";
import { Page, Box, Text, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";
// ĐÃ XÓA import { setNavigationBarColor } ở đây
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { CalendarIcon, ScheduleIcon, EnvelopeIcon } from "@/components/icons/UtilityIcons";
import "./index.css";

type IconComponent = React.FC<{ width?: number; height?: number; color?: string }>;

interface UtilityItem {
  id: string;
  title: string;
  IconComponent: IconComponent;
  iconBgColor: string;
  route: string;
}

function UtilitiesPage() {
  const navigate = useNavigate();

  // ĐÃ XÓA KHỐI useEffect GỌI HÀM setNavigationBarColor Ở ĐÂY

  const utilities: UtilityItem[] = [
    {
      id: "register-schedule",
      title: "Đăng ký lịch làm",
      IconComponent: CalendarIcon,
      iconBgColor: "transparent",
      route: "/utilities/register-schedule",
    },
    {
      id: "work-schedule",
      title: "Lịch làm việc",
      IconComponent: ScheduleIcon,
      iconBgColor: "transparent",
      route: "/utilities/work-schedule",
    },
    {
      id: "requests",
      title: "Đơn từ",
      IconComponent: EnvelopeIcon,
      iconBgColor: "transparent",
      route: "/utilities/requests",
    },
  ];

  const handleItemClick = (route: string) => {
    navigate(route);
  };

  return (
    <Page 
      className="utilities-page" 
      hideScrollbar
    >
      <Header title="Tiện ích" showLogo />

      <Box className="utilities-content">
        <Box className="utilities-list">
          {utilities.map((item) => {
            const IconComp = item.IconComponent;
            return (
              <Box
                key={item.id}
                className="utility-item"
                onClick={() => handleItemClick(item.route)}
              >
                <Box className="utility-icon-wrapper" style={{ backgroundColor: item.iconBgColor }}>
                  <IconComp width={24} height={24} />
                </Box>
                <Text className="utility-title">{item.title}</Text>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="utility-arrow">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Box>
            );
          })}
        </Box>
      </Box>

      <BottomNav activeTab="utilities" />
    </Page>
  );
}

export default UtilitiesPage;