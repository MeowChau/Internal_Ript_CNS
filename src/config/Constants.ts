import moment from "moment";
import R from "../assets/R";
import * as screenNames from "../navigation/ScreenNames";

const getFont = (size: number): number => size;

// ==========================================
// APP CONFIGURATION
// ==========================================
export const APP_CONFIG = {
  NAME: "Domixi",
  COMPANY_NAME: "DOMIXI",
  VERSION: "1.0.0",
};

export const COMPANY_NAME = "AI-Soft";

// ==========================================
// STORAGE KEYS
// ==========================================
export const STORAGE_KEYS = {
  // Authentication
  ACCESS_TOKEN: "accessToken",
  USER_INFO: "userInfo",
  USERNAME: "username",
  PASSWORD: "password",
  IS_LOGGED_IN: "isLoggedIn",

  // User data
  USER_ID: "userId",
  USER_NAME: "userName",
  USER_AVATAR: "userAvatar",
  USER_ROLE: "userRole",
  USER_TEAM: "userTeam",

  // Attendance
  MORNING_CHECK_IN: "morningCheckIn",
  MORNING_CHECK_OUT: "morningCheckOut",
  AFTERNOON_CHECK_IN: "afternoonCheckIn",
  AFTERNOON_CHECK_OUT: "afternoonCheckOut",
};

// ==========================================
// WORK HOURS
// ==========================================
export const WORK_HOURS = {
  MORNING_START: 8,
  MORNING_END: 12,
  AFTERNOON_START: 13,
  AFTERNOON_END: 17,
};

// ==========================================
// ROUTES
// ==========================================
export const ROUTES = {
  INDEX: "/",
  LOGIN: "/login",
  HOME: "/home",
  HISTORY: "/history",
  PROFILE: "/profile",
  UTILITIES: "/utilities",
  NOTIFICATIONS: "/notifications",
  WORK_SCHEDULE: "/utilities/work-schedule",
  REGISTER_SCHEDULE: "/utilities/register-schedule",
  REQUESTS: "/utilities/requests",
};

// ==========================================
// API & NETWORK CONSTANTS
// ==========================================

export const TOKEN_EXPIRED = 501;
export const BAD_GATEWAY = 502;
export const NOT_FOUND = 404;
export const SHORT_DELAY = 300;
export const LONG_DELAY = 4000;
export const LIMIT_NOTI = 10;
export const NUMBER_OF_TAB_EMPLOYEE = 5;
export const NUMBER_OF_TAB_ADMIN = 4;
export const MAX_NUMBER_NOTI_BADGE_DISPLAY = 99;
export const TIME_OUT = 30000;
export const defaultBody = {
  page: 1,
  limit: LIMIT_NOTI,
};

export const TAB_THONG_BAO = 2;
export const MAX_DEFAULT_FUNCTION = 4;

export const DS_CHUC_NANG_TIEN_ICH = [
  { new: false, title: "Đăng ký lịch làm" },
  { new: false, title: "Lịch làm việc" },
  { new: false, title: "Đơn từ" },
  // { new: false, title: "Lương tháng" },
  // { new: true, title: "Sơ yếu lí lịch 2C" },
];

export const DS_CHUC_NANG_CA_NHAN = [
  // { new: false, title: "Thống kê cá nhân" },
  { new: false, title: "Đăng xuất" },
  { new: false, title: "Đổi mật khẩu" },
  { new: false, title: "Xoá tài khoản" },
  // { new: false, title: "Đăng kí thiết bị định danh" },
];

export const DS_CHUC_NANG_CA_NHAN_ADMIN = [{ new: false, title: "Đăng xuất" }];

export const DS_CHUC_NANG_TIEN_ICH_ADMIN = [
  { new: false, title: "Đơn từ" },
  { new: false, title: "Quản lí điểm danh" },
  { new: false, title: "Quản lí lịch làm" },
];

export const DANH_SACH_CHUC_NANG_PHO_BIEN_MAC_DINH = [
  {
    title: "Điểm danh",
    destination: screenNames.ScanQR,
  },
  {
    title: "Lịch làm việc",
    destination: screenNames.LichLamViec,
  },
  {
    title: "Xin phép đến muộn",
    destination: screenNames.DonDangKyDenMuon,
  },
  {
    title: "Xin phép về sớm",
    destination: screenNames.DangKyVeSom,
  },
];

export const DANH_SACH_CHUC_NANG_PHO_BIEN_MAC_DINH_ADMIN = [
  {
    title: "Đơn từ",
    destination: screenNames.DanhSachDonDuyetAdmin,
  },
];

export const DANH_SACH_CHUC_NANG = [
  {
    title: "Điểm danh",
    destination: screenNames.ScanQR,
  },
  {
    title: "Lịch làm việc",
    destination: screenNames.LichLamViec,
  },
  {
    title: "Xin phép nghỉ làm",
    destination: screenNames.DonDangKyNghiLam,
  },
  {
    title: "Xin phép đến muộn",
    destination: screenNames.DonDangKyDenMuon,
  },
  {
    title: "Xin phép về sớm",
    destination: screenNames.DangKyVeSom,
  },
  {
    title: "Xin làm ngoài giờ",
    destination: screenNames.XinOT,
  },
];

export const DANH_SACH_CHUC_NANG_ADMIN = [
  {
    title: "Đơn từ",
    destination: screenNames.DanhSachDonDuyetAdmin,
  },
];

export const NOI_QUY_CONG_TY = {
  new: false,
  title: "Nội quy AI-Soft ",
};

export const MAX_NEWS_SWIPEHOME = 3;

export const ID_VIEW_SWIPER_NEWS = {
  VIEW_LEFT: 0,
  VIEW_RIGHT: 1,
};

export const THOI_GIAN_LAM_VIEC = {
  SANG: "8:30 - 12:30",
  CHIEU: "14:00 - 18:00",
};

export const UTC_TIME_DIFFERENT = 60 * 60 * 7 * 1000;

export const MAX_USER_LENGTH = 20;

export const THOI_DIEM_DIEM_DANH = {
  SANG: 0,
  CHIEU: 1,
};

export const THOI_DIEM_CHON = {
  BAT_DAU: 0,
  KET_THUC: 1,
};

export const CALENDAR_TYPE = {
  HOM_NAY: "Hôm nay",
  SAP_TOI: "Sắp tới",
};

export const DOI_DANH_SACH_THOI_KHOA_BIEU = {
  HOM_NAY: 0,
  SAP_TOI: 1,
};

export const LOAI_SU_KIEN = {
  TAT_CA: "TAT_CA",
  CA_NHAN: "CA_NHAN",
};

export const Weekday = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export const LOAI_THONG_TIN_NGAY_LAM_VIEC = {
  THOI_GIAN: 1,
  TIEU_DE: 2,
  DO_DAI: 3,
  PHONG: 4,
};

export const LIST_FUNCTION_FOR_STAFF = [
  {
    name: "Điểm danh",
    icon: "team",
  },
  {
    name: "Đăng ký nghỉ làm",
    icon: "form",
  },
  {
    name: "Đăng ký đến muộn",
    icon: "clockcircleo",
  },
  {
    name: "Ghi chú",
    icon: "edit",
  },
];

export const LIST_INFOR_LOGIN = [
  {
    name: "Tài khoản",
    iconName: "account-circle",
    placeholder: "Nhập tài khoản",
  },
  {
    name: "Mật khẩu",
    iconName: "lock",
    placeholder: "Mật khẩu",
  },
];

export const LIST_CHANGE_PASSWORD = [
  {
    name: "Mật khẩu cũ",
    placeholder: "Mật khẩu cũ",
  },
  {
    name: "Mật khẩu mới",
    placeholder: "Mật khẩu mới",
  },
  {
    name: "Xác nhận mật khẩu mới",
    placeholder: "Xác nhận mật khẩu",
  },
];

export const LIST_SIGN_UP = [
  {
    name: "Họ và tên",
    placeholder: "Họ và tên",
  },
  {
    name: "Tài khoản",
    placeholder: "Tài khoản",
  },
  {
    name: "Mật khẩu",
    isPassword: true,
    placeholder: "Mật khẩu",
  },
  {
    name: "Xác nhận mật khẩu",
    isPassword: true,
    placeholder: "Xác nhận mật khẩu",
  },
];

export const INPUT_CHANGE_PASSWORD = {
  OLD_PASSWORD: 0,
  NEW_PASSWORD: 1,
  REPEAT_PASSWORD: 2,
};

export const LIST_PICKER_CALENDAR = ["Tất cả"];

export const INPUT_LOGIN = {
  USERNAME: 0,
  PASSWORD: 1,
};

export const FUNCTIONAL_LIST_OF_WORK_SCHEDULE = {
  DIEM_DANH: 0,
  XIN_PHEP_NGHI_LAM: 1,
  XIN_PHEP_DEN_MUON: 2,
  GHI_CHU: 3,
};

export const RESPONSE_IN_RESULT = {
  EARLY: "Early",
  IN_TIME: "In time",
  LATE: "Late",
};

export const RETURN_RESPONSE_IN_RESULT = {
  EARLY: "Sớm",
  IN_TIME: "Đúng giờ",
  LATE: "Muộn",
};

export const CONTENT_XIN_NGHI = {
  NGAY_GUI: "Thời gian gửi đơn",
  NGUOI_GUI: "Người gửi",
  TEN_DANG_NHAP: "Tên đăng nhập",
  THOI_GIAN_NGHI: "Ngày xin nghỉ",
  LY_DO_NGHI: "Lý do nghỉ",
  CANH_BAO: "Cảnh báo",
  LY_DO_TU_CHOI: "Lý do từ chối",
  TRANG_THAI: "Trạng thái",
};

export const CONTENT_DI_MUON = {
  NGAY_GUI: "Thời gian gửi đơn",
  NGUOI_GUI: "Người gửi",
  TEN_DANG_NHAP: "Tên đăng nhập",
  NGAY_DEN_MUON: "Ngày xin đến muộn",
  THOI_GIAN_MUON: "Số phút đến muộn",
  THOI_GIAN_DEN: "Thời gian đến muộn",
  LY_DO_MUON: "Lý do muộn",
  CANH_BAO_1: "Lí do phạt",
  CANH_BAO_2: "Lí do không phạt",
  CANH_BAO_3: "Lí do từ chối",
  TRANG_THAI: "Trạng thái",
};

export const CONTENT_VE_SOM = {
  NGAY_GUI: "Thời gian gửi đơn",
  NGUOI_GUI: "Người gửi",
  TEN_DANG_NHAP: "Tên đăng nhập",
  NGAY_VE_SOM: "Ngày xin về sớm",
  THOI_GIAN_SOM: "Số phút về sớm",
  THOI_GIAN_VE: "Thời gian về sớm",
  LY_DO_SOM: "Lý do về sớm",
  CANH_BAO: "Cảnh báo",
  TRANG_THAI: "Trạng thái",
};

export const CONTENT_OT = {
  NGAY_GUI: "Thời gian gửi đơn",
  NGUOI_GUI: "Người gửi",
  TEN_DANG_NHAP: "Tên đăng nhập",
  NGAY_OT: "Ngày xin làm OT",
  THOI_GIAN_OT: "Thời gian làm OT",
  NGAY_LAM_OT: "Loại làm OT",
  NOI_DUNG_OT: "Nội dung làm OT",
  DU_AN: "Dự án",
  LY_DO_TU_CHOI: "Lý do từ chối",
  TRANG_THAI: "Trạng thái",
  NGUOI_QUAN_LY: "Người quản lý",
  TO: "Đến",
  FROM: "Từ",
};
export const CONTENT_CONG_TAC = {
  NGAY_GUI: "Thời gian gửi đơn",
  NGUOI_GUI: "Người gửi",
  TEN_DANG_NHAP: "Tên đăng nhập",
  NOI_CONG_TAC: "Nơi đi công tác",
  TO: "Đến",
  FROM: "Từ",
  LY_DO: "Lý do công tác",
  CHI_PHI: "Chi phí dự kiến",
  NGUOI_QL: "Người gửi đi công tác",
};
export const OT_TYPE = {
  THUONG: "Thường",
  DAC_THU: "Đặc thù",
};

export const CONTENT_EXTRA = {
  NGAY_GUI: "Thời gian gửi",
  NGUOI_GUI: "Người gửi",
  TEN_DANG_NHAP: "Tên đăng nhập",
  NGAY_LAM_THEM: "Ngày làm thêm",
  THOI_GIAN_LAM_THEM: "Thời gian làm",
  TRANG_THAI: "Trạng thái",
};

export const CANH_BAO_GUI_DON = {
  KHONG_GUI_TRUOC_30P: "Đã gửi đơn không trước 30p",
  DA_GUI_DON_KHAC_CHO_BUOI_LAM_NAY: "Đã gửi một đơn khác cho buổi làm này",
  SU_DUNG_HET_SO_BUOI_CUA_THANG: "Đã sử dụng hết số buổi cho phép",
  NGHI_PHEP_PARTTIME: "Số buổi không đạt 26 buổi",
  NGHI_PHEP_FULLTIME_THANG: "Đã nghỉ quá 04 buổi theo quy định",
  NGHI_PHEP_FULLTIME_NAM: "Đã nghỉ quá 24 buổi/1 năm theo quy định",
  KHONG_XIN_NGHI_TRUOC_1_BUOI: "Đơn xin phép không gửi trước 1 buổi",
};

export const SESSION_DURING_THE_DAY_OFF = ["All_day", "Morning", "Afternoon"];
export const RADIO_CHOICE_CHOOSE_TIME = [
  "LAM_CA_NGAY",
  "LAM_SANG",
  "LAM_CHIEU",
  "NGHI",
];
export const RADIO_CHOICE_CHOOSE_TIME_WORK = [
  "LAM_CA_NGAY",
  "LAM_SANG",
  "LAM_CHIEU",
];

export const RADIO_CHOICE_CHOOSE_TIME_MORNING = [
  "THOI_GIAN_CA_SANG_1",
  "THOI_GIAN_CA_SANG_2",
  "THOI_GIAN_CA_SANG_3",
  "KHAC_SANG",
];

export const RADIO_CHOICE_CHOOSE_TIME_AFTERNOON = [
  "THOI_GIAN_CA_CHIEU_1",
  "THOI_GIAN_CA_CHIEU_2",
  "THOI_GIAN_CA_CHIEU_3",
  "KHAC_CHIEU",
];

export const VALUE_RADIO_CHOICE_SANG = {
  FULL: "THOI_GIAN_CA_SANG_1",
  THIRD: "THOI_GIAN_CA_SANG_2",
  HALF: "THOI_GIAN_CA_SANG_3",
  OTHER: "KHAC_SANG",
};
export const TEAM_AIS = {
  APP: "App",
  BACK: "Back",
  HCTH: "HCTH",
  NGHIEN_CUU: "Nghiên cứu",
  TEST: "Test",
  DESIGN: "Design",
  BA: "Ba",
  WEB: "Web",
};

export const VALUE_RADIO_CHOICE_CHIEU = {
  FULL: "THOI_GIAN_CA_CHIEU_1",
  THIRD: "THOI_GIAN_CA_CHIEU_2",
  HALF: "THOI_GIAN_CA_CHIEU_3",
  OTHER: "KHAC_CHIEU",
};

export const VALUE_DANG_KI_LICH_LAM = {
  FULL_IN_SANG: "08:30",
  THIRD_IN_SANG: "09:30",
  HALF_IN_SANG: "10:30",
  FULL_OUT_SANG: "12:30",
  FULL_IN_CHIEU: "14:00",
  THIRD_IN_CHIEU: "15:00",
  HALF_IN_CHIEU: "16:00",
  FULL_OUT_CHIEU: "18:00",
};

export const RADIO_CHOICE_VALUE = {
  LAM_CA_NGAY: "LAM_CA_NGAY",
  LAM_SANG: "LAM_SANG",
  LAM_CHIEU: "LAM_CHIEU",
  NGHI: "NGHI",
};

export const PICKER_REGISTER_WORK = [
  "Làm cả ngày",
  "Làm sáng",
  "Làm chiều",
  "Nghỉ",
];
export const PICKER_REGISTER_WORK_MORE = [
  "Làm cả ngày",
  "Làm sáng",
  "Làm chiều",
];

export const LATE_ARRIVAL_TIME = ["10 phút", "15 phút", "20 phút", "Khác"];

export const LATE_ARRIVAL_TIME_INDEX = {
  MUOI_PHUT: 0,
  MUOI_LAM_PHUT: 1,
  HAI_MUOI_PHUT: 2,
  KHAC: 3,
};

export const CAC_TRUONG_DANG_KI_LAM_PARTTIME = [
  "Tổng số buổi làm",
  "Tổng số buổi nghỉ",
];
export const CAC_TRUONG_DANG_KI_LAM_FULLTIME = ["Tổng số buổi nghỉ"];
export const CAC_TRUONG_DANG_KI_MUON = ["Tổng số buổi muộn"];
export const CAC_TRUONG_DANG_KI_VE_SOM = ["Tổng số buổi về sớm"];
export const CAC_TRUONG_DANG_KI_LAM = [
  "Đăng kí thành công",
  "Tổng số buổi đăng kí",
  "Tổng số buổi nghỉ",
];
export const NAVIGATION_CHOICE = [
  {
    title: "Xin phép nghỉ làm",
    destination: "DiemDanh",
  },
  {
    title: "Xin phép đến muộn",
    destination: "DonDangKyDenMuon",
  },
  {
    title: "Xin phép về sớm",
    destination: "DangKyVeSom",
  },
];

export const LIST_DEFAULT_FUNCTION = {
  FUNCTION_1: 0,
  FUNCTION_2: 1,
  FUNCTION_3: 2,
  FUNCTION_4: 3,
};

export const SESSION_OFF_TIME = {
  NGHI_SANG: "NGHI_SANG",
  NGHI_CHIEU: "NGHI_CHIEU",
  NGHI_CA_NGAY: "NGHI_CA_NGAY",
};

export const TYPE_WORKDAY = {
  WORKING: "Đi làm",
  WEEKEND: "Nghỉ",
};

export const ARRAY_MONTH = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export const ARRAY_DAY = [
  "Chủ Nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

export const ARRAY_SHORT_DAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export const TIME_CHECK_IN = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  ALLDAY: "AllDay",
  NONE: "None",
};

export const AVAILABLE = "Available";

export const RESPONSE_ERROR_ABSENT = {
  BAD_REQUEST_NO_WORK_REGISTED: "BAD_REQUEST_NO_WORK_REGISTED",
  BAD_REQUEST_REGISTER_ABSENT_REGISTERED:
    "BAD_REQUEST_REGISTER_ABSENT_REGISTERED",
};

export const RESPONSE_ERROR_OT = {
  BAD_REQUEST_INVALID_OT_TIME_INTERVAL: "BAD_REQUEST_INVALID_OT_TIME_INTERVAL",
  BAD_REQUEST_REGISTER_OT_REGISTERED: "BAD_REQUEST_REGISTER_OT_REGISTERED",
};

export const TIME_CHECK_IN_BUTTON = {
  ALLDAY: 0,
  MORNING: 1,
  AFTERNOON: 2,
  NGHI: 3,
};

export const WORKING_BUTTON = {
  FULL: 0,
  THIRD: 1,
  HALF: 2,
  OTHER: 3,
};

export const COUNT_ABSENT_LATE = {
  SANG_HOAC_CHIEU: 1,
  CA_NGAY: 2,
};

export const COUNT_WORK = {
  THIRD: 0.75,
  HALF: 0.5,
  SANG_HOAC_CHIEU: 1,
  CA_NGAY: 2,
  NGHI: 0,
};

export const ObjectMorning = {
  morningWorkFrom: VALUE_DANG_KI_LICH_LAM.FULL_IN_SANG,
  morningWorkTo: VALUE_DANG_KI_LICH_LAM.FULL_OUT_SANG,
};

export const ObjectAfternoon = {
  afternoonWorkFrom: VALUE_DANG_KI_LICH_LAM.FULL_IN_CHIEU,
  afternoonWorkTo: VALUE_DANG_KI_LICH_LAM.FULL_OUT_CHIEU,
};

export const CHECK_IN_STATUS = {
  NONE: "None",
  IN: "In",
  OUT: "Out",
};

export const UNAUTHORIZED_WRONG_WORKSPACE_IP_ADDRESS =
  "UNAUTHORIZED_WRONG_WORKSPACE_IP_ADDRESS";

export const SIGN_UP_DEVICE_ERROR_CODE = {
  BAD_REQUEST_CLIENT_DEVICE_ID_EXIST: "BAD_REQUEST_CLIENT_DEVICE_ID_EXIST",
  BAD_REQUEST_DEVICE_IDENDIFIED: "BAD_REQUEST_DEVICE_IDENDIFIED",
  BAD_REQUEST_WRONG_PASSWORD: "BAD_REQUEST_WRONG_PASSWORD",
};

export const KHAC_INDEX_TIMELATE = 3;
export const RequiredWorkDay = 26;

export const DIEM_DANH_ERROR_CODE = {
  BAD_REQUEST_INVALID_OTP: "BAD_REQUEST_INVALID_OTP",
  BAD_REQUEST_INVALID_BSSID: "BAD_REQUEST_INVALID_BSSID",
  UNAUTHORIZED_WRONG_WORKSPACE_IP_ADDRESS:
    "UNAUTHORIZED_WRONG_WORKSPACE_IP_ADDRESS",
  UNAUTHORIZED_WRONG_IDENTIFY_DEVICE: "UNAUTHORIZED_WRONG_IDENTIFY_DEVICE",
  BAD_REQUEST_NO_WORK_REGISTED: "BAD_REQUEST_NO_WORK_REGISTED",
  BAD_REQUEST_INVALID_TYPE: "BAD_REQUEST_INVALID_TYPE",
};

export const LOGIN_ERROR_CODE = {
  UNAUTHORIZED_USERNAME_NOT_FOUND: "UNAUTHORIZED_USERNAME_NOT_FOUND",
  UNAUTHORIZED_WRONG_PASSWORD: "UNAUTHORIZED_WRONG_PASSWORD",
};

export const CHANGE_PASSWORD_ERROR_CODE = {
  BAD_REQUEST_WRONG_OLD_PASSWORD: "BAD_REQUEST_WRONG_OLD_PASSWORD",
  BAD_REQUEST_DUPLICATE_NEW_PASSWORD: "BAD_REQUEST_DUPLICATE_NEW_PASSWORD",
};

export const BAD_REQUEST_INVALID_MIME_TYPE = "BAD_REQUEST_INVALID_MIME_TYPE";

export const USER_INFORMATION = [
  {
    title: "Tài khoản",
    value: "",
  },
  {
    title: "Đội",
    value: "",
  },
  {
    title: "Số điện thoại",
    value: "",
  },
  {
    title: "Vai trò",
    value: "",
  },
];

export const ADMIN_INFORMATION = [
  {
    title: "Tài khoản",
    value: "",
  },
  {
    title: "Số điện thoại",
    value: "",
  },
  {
    title: "Vai trò",
    value: "",
  },
];

export const FUNCTION_NAME = [
  // { title: "Bảng lương", icon: "chart-areaspline" },
  { title: "Đổi mật khẩu", icon: "account-lock" },
];

export const STATISTIC_FIELD = [
  "Đúng giờ",
  "Muộn giờ",
  "Nghỉ có phép",
  "Nghỉ không phép",
];

export const STATISTIC_FIELD_DETAIL = [
  "Muộn giờ",
  "Nghỉ có phép",
  "Nghỉ không phép",
];

export const TRANG_THAI_DON = {
  KHONG_DUOC_DUYET: "Không duyệt",
  DUOC_PHE_DUYET: "Duyệt và không phạt",
  DUOC_PHE_DUYET_VA_PHAT: "Duyệt và phạt",
  CHO_PHE_DUYET: "Chờ duyệt",
  ALL: "Tất cả",
};
export const TRANG_THAI_DON_I = [
  "Tất cả",
  "Duyệt và không phạt",
  "Duyệt và phạt",
  "Không duyệt",
  "Chờ duyệt",
];
export const TRANG_THAI_DON_II = [
  "Tất cả",
  "Duyệt",
  "Không duyệt",
  "Chờ duyệt",
];
export const DEVICE_SIGNED_UP_TYPE = {
  NO_DEVICE_SIGNED_UP: 0,
  WRONG_DEVICE: 1,
  CORRECT_DEVICE: 2,
  DEFAULT: -1,
};

export const TRANG_THAI_DON_GUI = {
  TAT_CA: undefined,
  KHONG_DUOC_DUYET: "Rejected",
  DUOC_PHE_DUYET: "Accepted",
  CHO_PHE_DUYET: "Processing",
};

export const TRANG_THAI_DON_PICKER = [
  "Tất cả",
  "Không duyệt",
  "Chấp nhận",
  "Chờ duyệt",
];

export const OneDayByMillisecond = 60 * 60 * 24 * 1000;
export const TwoHourByMillisecond = 60 * 60 * 2 * 1000;
export const OTGapTime = 60 * 60 * 14 * 1000 + 30 * 60 * 1000;

export const NAM = [
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "2031",
  "2032",
  "2033",
  "2034",
  "2035",
  "2036",
  "2037",
  "2038",
  "2039",
  "2040",
];

export const SESSION_PER_DAY = ["Cả ngày", "Sáng", "Chiều"];

export const SESSION_A_DAY = ["Sáng", "Chiều"];

export const CA_LAM_VIEC = {
  CA_NGAY: 0,
  SANG: 1,
  CHIEU: 2,
};

export const FROM_DESTINATION = {
  DON_XIN: 0,
  LICH_SU_DON: 1,
};

export const ON_CHANGE_PICKER_LICH_SU_DON = {
  THANG: 0,
  NAM: 1,
  TRANG_THAI: 2,
};

export const YES_NO = ["Không", "Có"];

export const ExtraType = {
  NHANH: "Nhanh",
  THUONG: "Thường",
};

export const ALL_STAT_COUNT = ["Tổng buổi phép", "Đã nghỉ", "Còn lại"];
export const ALL_STAT_COUNT_LATE = ["Tổng muộn tuần", "Tổng muộn tháng"];
export const ALL_STAT_COUNT_ABSENT = ["Tổng nghỉ tuần", "Tổng nghỉ tháng"];
export const ALL_STAT_COUNT_EARLY = ["Tổng về sớm tuần", "Tổng về sớm tháng"];

export const LIST_THONG_TIN_DON_NGHI_LAM = [
  "Ngày gửi đơn",
  "Thời gian nghỉ",
  "Lý do",
  "Trạng thái",
];
export const LIST_THONG_TIN_DON_DEN_MUON = [
  "Ngày gửi đơn",
  "Ngày đến muộn",
  "Thời gian muộn",
  "Lý do",
];
export const LIST_THONG_TIN_XIN_OT = [
  "Ngày gửi đơn",
  "Thời gian OT",
  "Nội dung OT",
  "Trạng thái",
];
export const LIST_THONG_TIN_LAM_THEM = [
  "Ngày gửi đơn",
  "Ngày làm thêm",
  "Thời gian làm thêm",
];
export const LIST_THONG_TIN_DON_VE_SOM = [
  "Ngày gửi đơn",
  "Ngày về sớm",
  "Thời gian sớm",
  "Lý do",
];

export const LIST_SUBMIT_BUTTON = [
  {
    title: "Huỷ đơn",
  },
  {
    title: "Nộp đơn",
  },
];
export const LIST_SUBMIT_BUTTON_FUNCTION = {
  HUY: 0,
  ACCEPT: 1,
};

export const LIST_RESULT_FUNCTION = [
  "Gửi đơn thành công",
  "Xem đơn vừa gửi",
  "Lịch sử đơn",
  "Quay lại",
];

export const FLATLIST_INDEX = {
  FUNCTION_0: 0,
  FUNCTION_1: 1,
  FUNCTION_2: 2,
  FUNCTION_3: 3,
};

export const PICKER_INDEX = {
  PICKER_0: 0,
  PICKER_1: 1,
  PICKER_2: 2,
  PICKER_3: 3,
};
export const LOAI_DON_XIN = {
  NGHI_LAM: 0,
  DI_MUON: 1,
  XIN_LAM_THEM: 2,
  XIN_OT: 3,
  VE_SOM: 4,
};

export const customStyleSelectedDate = {
  customStyles: {
    container: {
      backgroundColor: R.colors.black0,
    },
    text: {
      color: R.colors.white,
    },
  },
};

export const REGISTER_TYPE = {
  LATE: "Late",
  Absent: "Absent",
  OT: "OT",
  EXTRA: "Extra",
  Early: "Early",
};

export const TYPE_EMPLOYEE = {
  FULLTIME: "full_time",
  PARTTIME: "part_time",
  ADMIN: "admin",
};

export const TYPE_EMPLOYEE_VI = {
  FULLTIME: "Nhân viên Fulltime",
  PARTTIME: "Nhân viên Parttime",
  ADMIN: "admin",
};

export const CHECK_IN_RESULT_LIST = ["Ngày", "Thời gian check in"];
export const CHECK_OUT_RESULT_LIST = [
  "Thời gian check out",
  "Thời gian làm việc",
];

export const customStyleEventFullDay = {
  customStyles: {
    container: {
      backgroundColor: R.colors.caNgay,
    },
    text: {
      color: R.colors.black0,
    },
  },
};
export const customStyleEventDisableDay = {
  customStyles: {
    container: {
      backgroundColor: R.colors.colorBFC9DD,
    },
    text: {
      color: R.colors.black0,
    },
  },
};
export const customStyleEventHalfDaySang = {
  customStyles: {
    container: {
      backgroundColor: R.colors.sang,
    },
    text: {
      color: R.colors.black0,
    },
  },
};
export const customStyleEventHalfDayChieu = {
  customStyles: {
    container: {
      backgroundColor: R.colors.chieu,
    },
    text: {
      color: R.colors.black0,
    },
  },
};

export const customStyleEventNghiLe = {
  customStyles: {
    container: {
      backgroundColor: R.colors.ngayLe,
    },
    text: {
      color: R.colors.black0,
    },
  },
};
export const customStyleToday = {
  customStyles: {
    container: {
      backgroundColor: R.colors.transparent,
      borderWidth: 2,
      borderColor: R.colors.primaryColor,
    },
    text: {
      color: R.colors.black0,
    },
  },
};

export const customStyleHaveChanged = {
  customStyles: {
    container: {
      backgroundColor: R.colors.greenA400,
    },
    text: {
      color: R.colors.white,
    },
  },
};

export const customStyleNormalToday = {
  customStyles: {
    container: {
      backgroundColor: R.colors.white,
    },
    text: {
      color: R.colors.black0,
    },
  },
};

export const themeCalendar = {
  arrowColor: R.colors.grey400,
  backgroundColor: R.colors.white,
  calendarBackground: R.colors.white,
  dayTextColor: R.colors.black0,
  monthTextColor: R.colors.black0,
  textDayFontFamily: R.fonts.Roboto,
  textDayFontSize: getFont(15),
  textDayHeaderFontFamily: R.fonts.Roboto,
  textDayHeaderFontSize: getFont(15),
  textMonthFontFamily: R.fonts.Roboto,
  textMonthFontSize: getFont(16),
  textMonthFontWeight: "bold",
  todayBackgroundColor: R.colors.white,
  todayTextColor: R.colors.black0,
};

export const INDEX_STRING_DATE = {
  NGAY: 2,
  THANG: 1,
  NAM: 0,
};
export const TYPE_DATE_CHANGE = {
  TO: 1,
  FROM: 0,
};

export const morningCheckIn = moment(`08:30`, "HH:mm").toDate();
export const morningCheckOut = moment(`12:30`, "HH:mm").toDate();
export const afternoonCheckIn = moment(`14:00`, "HH:mm").toDate();
export const afternoonCheckOut = moment(`18:00`, "HH:mm").toDate();
export const afternoonOTTime = moment().toDate();

export const LOAI_OT_ARRAY = ["Đặc thù", "Thường"];
export const DS_LOAI_NV = [
  "Tất cả nhân viên",
  "Nhân viên Fulltime",
  "Nhân viên Parttime",
];
export const TRANG_THAI_DUYET = ["Tất cả", "Chờ duyệt", "Duyệt", "Không duyệt"];
export const TRANG_THAI_DUYET_PHAT = [
  "Tất cả",
  "Chờ duyệt",
  "Duyệt và phạt",
  "Duyệt và không phạt",
  "Không duyệt",
];
export const LOAI_DON_DUYET = [
  "Đơn xin nghỉ",
  "Đơn xin đến muộn",
  "Đơn xin về sớm",
  "Đơn xin làm ngoài giờ",
  "Đơn xin đi công tác",
];
export const TYPE_DIEM_DANH_NORMAL = 0;
export const TYPE_DIEM_DANH_OT = 1;
export const TYPE_DIEM_DANH_XIN_LAM_THEM = 2;
export const TYPE_DIEM_DANH_XIN_NGHI = 3;
export const TYPE_DIEM_DANH_VE_SOM = 4;
export const TYPE_LOAI_DON_DUYET = {
  DON_XIN_NGHI_PHEP: "Đơn xin nghỉ",
  DON_XIN_DEN_MUON: "Đơn xin đến muộn",
  DON_XIN_VE_SOM: "Đơn xin về sớm",
  DON_XIN_LAM_THEM: "Đơn xin làm thêm",
  DON_XIN_LAM_OT: "Đơn xin làm ngoài giờ",
  DON_XIN_DI_CONG_TAC: "Đơn xin đi công tác",
};
export const FILTER_GET_DON_ADMIN = ["Theo tháng", "Theo tuần", "Theo ngày"];
export const FILTER_LICH_LAM_ADMIN = ["Theo ngày", "Theo tuần", "Theo tháng"];
export const TYPE_FILTER_GET_DON_ADMIN = {
  THEO_NGAY: "Theo ngày",
  THEO_TUAN: "Theo tuần",
  THEO_THANG: "Theo tháng",
};
export const TYPE_FILTER_LICH_LAM_ADMIN = {
  THEO_NGAY: "Theo ngày",
  THEO_THANG: "Theo tháng",
};
export const MONTH_WEEK_TYPE = {
  THEO_TUAN: "Theo tuần",
  THEO_THANG: "Theo tháng",
};
export const LIST_MONTH = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export const STATISTIC_TYPE_PICKER = {
  THEO_LOAI_NGAY_THANG: "THEO_LOAI_NGAY_THANG",
  THEO_LOAI_THONG_KE: "THEO_LOAI_THONG_KE",
  THEO_TEAM: "THEO_TEAM",
  THEO_LOAI_PHEP: "THEO_LOAI_PHEP",
};

export const TYPE_PICKER = {
  THEO_LOAI_NGAY_THANG: "THEO_LOAI_NGAY_THANG",
  THEO_NGAY: "THEO_NGAY",
  THEO_THANG: "THEO_THANG",
  THEO_LOAI_NV: "THEO_LOAI_NV",
  THEO_LOAI_DON: "THEO_LOAI_DON",
  THEO_TRANG_THAI: "THEO_TRANG_THAI",
  THEO_TUAN: "THEO_TUAN",
};

export const MENU_TABMAIN = {
  TRANG_CHU: "0",
  TIEN_ICH: "1",
  DIEM_DANH: "2",
  THONG_BAO: "3",
  CA_NHAN: "4",
};

export const MAX_LENGTH_PASSWORD = 128;
export const MAX_LENGTH_USERNAME = 32;

export const TRANG_THAI_DIEM_DANH = {
  SOM: "Sớm",
  DUNG_GIO: "Đúng giờ",
  MUON: "Muộn",
};

export const LOAI_DIEM_DANH = {
  CHECK_IN: "CHECK_IN",
  CHECK_OUT: "CHECK_OUT",
};

export const BUOI_TRONG_NGAY = {
  SANG: "sang",
  CHIEU: "chieu",
};

export const LOAI_PHEP = {
  CO_PHEP: "Có phép",
  KO_PHEP: "Không phép",
};

export const LOAI_THONG_KE_LAM_VIEC = {
  NGHI_LAM: "Nghỉ làm",
  DI_MUON: "Đi muộn",
  VE_SOM: "Về sớm",
};

export const ONE_HOUR_MILLISECONDS = 60 * 60 * 1000;
export const ONE_MILLISECONDS = 1000;

export const MORNING_WORK_FROM_DEFAULT = "08:00";
export const MORNING_WORK_TO_DEFAULT = "12:00";
export const AFTERNOON_WORK_FROM_DEFAULT = "13:30";
export const AFTERNOON_WORK_TO_DEFAULT = "17:30";

// thời gian 1 buổi là 4h
export const THOI_GIAN_1_BUOI = 4;

// 2h tinh bang milliseconds
export const THOI_GIAN_LAM_VIEC_TOI_THIEU = 60 * 60 * 2 * 1000;

export const DON_TU = {
  DANH_SACH_DON: "0",
  LICH_SU_DON: "1",
};
export const TYPE_THONG_BAO = {
  CONG_TY: 0,
  KHAC: 1,
};
export const DON_TU_TRANG_CHU = {
  XIN_NGHI: 0,
  XIN_DEN_MUON: 1,
  XIN_VE_SOM: 2,
};
export const QUAN_LY_DON = {
  XIN_NGHI: 0,
  XIN_DEN_MUON: 1,
  XIN_VE_SOM: 2,
  OT: 3,
  CONG_TAC: 4,
  REMOTE: 5,
};
export const MAU_DON_QUAN_LY = [
  "Đơn xin nghỉ",
  "Đơn xin đến muộn",
  "Đơn xin về sớm",
];

export const TEN_CAC_MAU_DON = [
  "Đơn xin nghỉ",
  "Đơn xin đến muộn",
  "Đơn xin về sớm",
  "Đơn xin làm ngoài giờ",
  "Đăng ký làm thêm",
  "Đơn xin đi công tác",
  "Đơn đăng ký làm Remote",
  // "Đơn xin nghỉ việc",
  // 'Đơn đề xuất mua vật tư văn phòng'
];

// phạt 30% lương buổi
export const MUC_PHAT_NGHI_KO_HOP_LE_FULLTIME = 0.3;

// phạt 75% lương buổi
export const MUC_PHAT_NGHI_KO_HOP_LE_PARTTIME = 0.75;

export const HOURS_FROM_LAST_CHECKOUT_TO_FIRST_CHECKIN = 14.5;

export const FIRST_MONTH_OF_YEAR = 0;
export const LAST_MONTH_OF_YEAR = 11;

export const TAB_CHART = {
  STACKED_CHART: "0",
  PIE_CHART: "1",
};
