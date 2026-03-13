import React, { useState, useEffect } from "react";
import { Page, Box, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import RequestIcon from "../../components/icons/RequestIcon";
import images from "../../assets/images";
import { postDonXinNew } from "../../apis/user";
import "./index.css";

interface RequestItem {
  id: string;
  title: string;
  icon: string;
  route: string;
}

interface RequestHistoryItem {
  _id: string;
  loaiDon: string;
  trangThaiDon: string;
  ngay: number;
  thang: number;
  nam: number;
  lyDo?: string;
  createdAt: string;
}

function RequestsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");

  // History tab states
  const [filterType, setFilterType] = useState("Theo tháng");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [requestType, setRequestType] = useState("Đơn xin nghỉ");
  const [status, setStatus] = useState("Tất cả");
  const [historyList, setHistoryList] = useState<RequestHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Dropdown states
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showRequestTypeDropdown, setShowRequestTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const filterOptions = ["Theo tháng", "Theo tuần", "Theo ngày"];
  const requestTypeOptions = [
    "Đơn xin nghỉ",
    "Đơn xin đến muộn",
    "Đơn xin về sớm",
    "Đơn xin làm ngoài giờ",
    "Đơn xin đi công tác"
  ];
  const statusOptions = ["Tất cả", "Chờ duyệt", "Duyệt", "Không duyệt"];

  const requestTypes: RequestItem[] = [
    {
      id: "leave",
      title: "Đơn xin nghỉ",
      icon: "zi-note-edit",
      route: "/utilities/requests/leave",
    },
    {
      id: "late",
      title: "Đơn xin đến muộn",
      icon: "zi-clock-2",
      route: "/requests/late",
    },
    {
      id: "early-leave",
      title: "Đơn xin về sớm",
      icon: "zi-clock-1",
      route: "/requests/early",
    },
    {
      id: "overtime",
      title: "Đơn xin làm ngoài giờ",
      icon: "zi-calendar-add",
      route: "/requests/overtime",
    },
    {
      id: "extra-work",
      title: "Đăng ký làm thêm",
      icon: "zi-calendar",
      route: "/utilities/requests/extra-work",
    },
    {
      id: "business-trip",
      title: "Đơn xin đi công tác",
      icon: "zi-location",
      route: "/requests/business-trip",
    },
    {
      id: "remote",
      title: "Đơn đăng ký làm Remote",
      icon: "zi-home",
      route: "/requests/remote",
    },
  ];

  const handleRequestClick = (route: string) => {
    // Chưa làm chức năng đơn xin đi công tác
    if (route === "/requests/business-trip") {
      return;
    }
    navigate(route);
  };

  // Fetch history data
  const fetchHistory = async () => {
    setLoading(true);
    try {
      let ngay_bat_dau = "";
      let ngay_ket_thuc = "";

      if (filterType === "Theo tháng") {
        // For month: start from day 1 of selected month to day 1 of next month
        ngay_bat_dau = `${year}-${month}-1`;
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        ngay_ket_thuc = `${nextYear}-${nextMonth}-1`;
      } else {
        // For day or week, would need additional logic
        const today = new Date();
        const dayPick = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        ngay_bat_dau = dayPick;
        ngay_ket_thuc = dayPick;
      }

      const body = {
        ngay_bat_dau,
        ngay_ket_thuc,
        trang_thai: status || "Tất cả",
        loai_don: requestType || "Tất cả",
      };

      const response = await postDonXinNew(body);
      setHistoryList(response?.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistoryList([]);
    } finally {
      setLoading(false);
    }
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filterType, month, year, requestType, status]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.custom-select-wrapper')) {
        setShowFilterDropdown(false);
        setShowRequestTypeDropdown(false);
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <Page className="requests-page">
      {/* Header */}
      <Box className="requests-header">
        <Box className="requests-header-content">
          <Box className="back-button" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
          <Text className="requests-header-title">Đơn từ</Text>
        </Box>
        <Box className="requests-header-logo">
          <img src={images.companyLogoWhite} alt="RIPT Logo" className="logo-image" />
        </Box>
      </Box>

      {/* Tabs */}
      <Box className="requests-tabs">
        <Box
          className={`tab-item ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          <Text className={`tab-text ${activeTab === "list" ? "active" : ""}`}>
            Danh sách đơn
          </Text>
        </Box>
        <Box
          className={`tab-item ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <Text className={`tab-text ${activeTab === "history" ? "active" : ""}`}>
            Lịch sử gửi đơn
          </Text>
        </Box>
      </Box>

      {/* Content */}
      <Box className="requests-content">
        {activeTab === "list" && (
          <Box className="requests-list">
            {requestTypes.map((item) => (
              <Box
                key={item.id}
                className="request-item"
                onClick={() => handleRequestClick(item.route)}
              >
                <Box className="request-icon-wrapper">
                  <RequestIcon title={item.title} color="#ffffff" width={20} height={20} />
                </Box>
                <Text className="request-title">{item.title}</Text>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="request-arrow">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Box>
            ))}
          </Box>
        )}

        {activeTab === "history" && (
          <Box className="history-content">
            {/* Filter Row 1: Time Filter + Month Picker */}
            <Box className="filter-row">
              <Box className="custom-select-wrapper">
                <Box 
                  className={`custom-select ${showFilterDropdown ? 'active' : ''}`}
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <Text className="select-text">{filterType}</Text>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="select-arrow">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Box>
                {showFilterDropdown && (
                  <Box className="dropdown-menu">
                    {filterOptions.map((option) => (
                      <Box
                        key={option}
                        className="dropdown-item"
                        onClick={() => {
                          setFilterType(option);
                          setShowFilterDropdown(false);
                        }}
                      >
                        <Text className="dropdown-item-text">{option}</Text>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Box className="month-picker">
                <Box className="month-nav-button" onClick={handlePrevMonth}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Box>
                <Text className="month-text">{month}/{year}</Text>
                <Box className="month-nav-button" onClick={handleNextMonth}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 5L12.5 10L7.5 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Box>
              </Box>
            </Box>

            {/* Filter Row 2: Request Type */}
            <Box className="custom-select-wrapper custom-select-wrapper-full">
              <Box 
                className={`custom-select custom-select-full ${showRequestTypeDropdown ? 'active' : ''}`}
                onClick={() => setShowRequestTypeDropdown(!showRequestTypeDropdown)}
              >
                <Text className="select-text">{requestType}</Text>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="select-arrow">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Box>
              {showRequestTypeDropdown && (
                <Box className="dropdown-menu">
                  {requestTypeOptions.map((option) => (
                    <Box
                      key={option}
                      className="dropdown-item"
                      onClick={() => {
                        setRequestType(option);
                        setShowRequestTypeDropdown(false);
                      }}
                    >
                      <Text className="dropdown-item-text">{option}</Text>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Filter Row 3: Status */}
            <Box className="custom-select-wrapper custom-select-wrapper-full">
              <Box 
                className={`custom-select custom-select-full ${showStatusDropdown ? 'active' : ''}`}
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <Text className="select-text">{status}</Text>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="select-arrow">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Box>
              {showStatusDropdown && (
                <Box className="dropdown-menu">
                  {statusOptions.map((option) => (
                    <Box
                      key={option}
                      className="dropdown-item"
                      onClick={() => {
                        setStatus(option);
                        setShowStatusDropdown(false);
                      }}
                    >
                      <Text className="dropdown-item-text">{option}</Text>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Request List */}
            <Box className="history-list">
              {loading ? (
                <Box className="empty-state">
                  <Text className="empty-text">Đang tải...</Text>
                </Box>
              ) : historyList.length === 0 ? (
                <Box className="empty-state">
                  <Text className="empty-text">Không có đơn nào</Text>
                </Box>
              ) : (
                historyList.map((item) => (
                  <Box key={item._id} className="history-item">
                    <Box className="history-item-header">
                      <Text className="history-item-type">{item.loaiDon || 'Đơn xin'}</Text>
                      <Box className={`history-item-status status-${item.trangThaiDon?.toLowerCase().replace(/ /g, '-') || 'unknown'}`}>
                        <Text className="status-text">{item.trangThaiDon || 'Không xác định'}</Text>
                      </Box>
                    </Box>
                    <Text className="history-item-date">
                      {item.ngay}{item.thang}{item.nam}
                    </Text>
                    {item.lyDo && (
                      <Text className="history-item-reason">{item.lyDo}</Text>
                    )}
                  </Box>
                ))
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Page>
  );
}

export default RequestsPage;