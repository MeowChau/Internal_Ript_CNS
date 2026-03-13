import moment from "moment";

// Constants (sẽ import từ Constants.ts khi có)
const TRANG_THAI_DON = {
  CHO_PHE_DUYET: "CHO_PHE_DUYET",
  DUOC_PHE_DUYET: "DUOC_PHE_DUYET",
  KHONG_DUOC_DUYET: "KHONG_DUOC_DUYET",
};

const TRANG_THAI_DUYET = {
  1: "Chờ duyệt",
  2: "Đã duyệt",
  3: "Không duyệt",
};

const TRANG_THAI_DIEM_DANH = {
  SOM: "SOM",
  DUNG_GIO: "DUNG_GIO",
  MUON: "MUON",
};

const TYPE_EMPLOYEE = {
  ADMIN: "ADMIN",
  FULLTIME: "FULLTIME",
  PARTTIME: "PARTTIME",
};

const TYPE_EMPLOYEE_VI = {
  ADMIN: "Quản trị viên",
  FULLTIME: "Toàn thời gian",
  PARTTIME: "Bán thời gian",
};

const BUOI_TRONG_NGAY = {
  SANG: "SANG",
  CHIEU: "CHIEU",
};

const MORNING_WORK_FROM_DEFAULT = "08:00";
const MORNING_WORK_TO_DEFAULT = "12:00";
const AFTERNOON_WORK_FROM_DEFAULT = "13:00";
const AFTERNOON_WORK_TO_DEFAULT = "17:00";
const THOI_GIAN_1_BUOI = 4; // 4 tiếng

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * ==========================================
 * WINDOW & DIMENSION FUNCTIONS
 * ==========================================
 */

/**
 * Lấy kích thước màn hình hiện tại
 */
export const getWidth = () => window.innerWidth;
export const getHeight = () => window.innerHeight;

/**
 * Tính toán width responsive
 * @param w - giá trị width cơ bản (base: 375)
 */
export const WIDTH = (w: number) => (window.innerWidth * w) / 375;

/**
 * Tính toán height responsive
 * @param h - giá trị height cơ bản (base: 812)
 */
export const HEIGHT = (h: number) => (window.innerHeight * h) / 812;

/**
 * Tính font size
 * @param f - font size gốc
 */
export const getFont = (f: number) => f - 1;

/**
 * Tính line height
 * @param f - line height gốc
 */
export const getLineHeight = (f: number) => f;

/**
 * ==========================================
 * POPUP & NOTIFICATION FUNCTIONS
 * ==========================================
 */

/**
 * Hiển thị toast message
 * @param message - nội dung thông báo
 * @param type - loại thông báo: success, error, warning
 */
export const toastMessage = (
  message: string,
  type: "success" | "error" | "warning" = "success",
) => {
  alert(message);
};

/**
 * Hiển thị snackbar/toast (tương thích với React Native code)
 * @param options - options cho snackbar
 */
export const openSnackbar = (options: {
  text: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  position?: "top" | "bottom";
}) => {
  const { text, type = "info", duration = 3000 } = options;

  // Tạm thời dùng alert, sau có thể thay bằng zmp-ui toast

  // TODO: Replace with zmp-ui toast when integrated
  if (type === "error") {
    alert(text);
  }
};

/**
 * Hiển thị popup xác nhận với 2 nút
 * @param notice - tiêu đề popup
 * @param content - nội dung popup
 * @param onPressOk - callback khi nhấn OK
 * @param onPressCan - callback khi nhấn Hủy
 */
export const popUpAlert = (
  notice: string,
  content: string,
  onPressOk: () => void,
  onPressCan?: () => void,
) => {
  if (confirm(`${notice}\n\n${content}`)) {
    onPressOk && onPressOk();
  } else {
    onPressCan && onPressCan();
  }
};

/**
 * Hiển thị popup với 1 nút OK
 * @param title - tiêu đề thông báo
 * @param msg - nội dung thông báo
 * @param onPress - callback khi nhấn OK
 */
export const popupOk = (
  title: string,
  msg: string,
  onPress?: (() => void) | null,
) => {
  alert(`${title}\n\n${msg}`);
  onPress && onPress();
};

/**
 * ==========================================
 * DATE & TIME FUNCTIONS
 * ==========================================
 */

/**
 * Tìm ngày đầu tiên của tuần
 * @param date - thời gian hiện tại
 * @param dayInWeek - thứ bắt đầu tính (mặc định: Monday)
 */
export const getFirstDayOfWeek = (date: Date, dayInWeek?: string) => {
  const from = dayInWeek || "Monday";
  const index = weekday.indexOf(from);
  const start = index >= 0 ? index : 0;

  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (start > day ? start - 7 : start);
  d.setDate(diff);
  return d;
};

/**
 * Tìm ngày cuối cùng của tuần
 * @param date - thời gian hiện tại
 * @param dayInWeek - thứ kết thúc (mặc định: Sunday)
 */
export const getLastDayOfWeek = (date: Date, dayInWeek?: string) => {
  const from = dayInWeek || "Sunday";
  const index = weekday.indexOf(from);
  const start = index >= 0 ? index : 0;

  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (start > day ? start - 1 : 6 + start);
  d.setDate(diff);
  return d;
};

/**
 * Chuyển đổi từ ngày/tháng/năm sang Date
 * @param day - ngày
 * @param month - tháng
 * @param year - năm
 * @param format - định dạng (mặc định: DD/MM/YYYY)
 */
export const changeToDate = (
  day: number,
  month: number,
  year: number,
  format: string = "DD/MM/YYYY",
) => {
  return new Date(
    moment(`${day}/${month}/${year}`, format).format("YYYY-MM-DD[T]HH:mm:ss"),
  );
};

/**
 * Chuyển đổi string DD/MM/YYYY sang Date
 * @param date - string ngày tháng
 */
export const changeToDateFromStringDDMMYYYY = (date: string) => {
  return new Date(moment(date, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss"));
};

/**
 * Tách giờ và phút từ string, gán vào date
 * @param datetime - string thời gian (HH:mm)
 * @param date - Date object (mặc định: new Date())
 */
export const splitHourAndMinutes = (datetime: string, date?: Date) => {
  const time = datetime.split(":");
  const currentTime = date || new Date();
  currentTime.setHours(Number(time[0]), Number(time[1]), 0, 0);
  return currentTime;
};

/**
 * Tính khoảng cách theo phút giữa 2 thời gian
 * @param firstHour - thời gian bắt đầu (HH:mm)
 * @param secondHours - thời gian kết thúc (HH:mm)
 */
export const tinhKhoangCachTheoPhut = (
  firstHour: string,
  secondHours: string,
) => {
  const timeStart = new Date(moment(firstHour, "HH:mm").toDate()).getTime();
  const timeEnd = new Date(moment(secondHours, "HH:mm").toDate()).getTime();
  const minutes = (timeEnd - timeStart) / 1000 / 60;
  return minutes;
};

/**
 * Tính chênh lệch phút giữa 2 Date
 * @param timeChose1 - thời gian so sánh 1
 * @param timeChose2 - thời gian so sánh 2
 */
export const getMinuteDifferent = (timeChose1: Date, timeChose2: Date) => {
  const secondLate = timeChose1.getTime() - timeChose2.getTime();
  return Math.floor(secondLate / 1000 / 60);
};

/**
 * ==========================================
 * FORMAT & CONVERT FUNCTIONS
 * ==========================================
 */

/**
 * Chuyển đổi từ giây sang HH:MM:SS
 * @param seconds - thời gian dạng giây
 */
export function secondsToHms(seconds: number) {
  const hours = Math.floor(seconds / 60 / 60);
  const minutes = Math.floor(seconds / 60) - hours * 60;
  const sec = Math.floor(seconds % 60);

  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    sec.toString().padStart(2, "0")
  );
}

/**
 * Format tiền VND: 1000000 -> 1.000.000
 * @param price - số tiền
 * @param type - 0: không có đơn vị, 1: có đơn vị VNĐ
 */
export const formatVND = (price: number, type = 0) => {
  return (
    price?.toFixed(0)?.replace(/(\d)(?=(\d{3})+$)/g, "$1.") +
    (type ? " VNĐ" : "")
  );
};

/**
 * Format số thành 2 chữ số: 1 -> 01
 * @param text - số cần format
 */
export const formatTwoFigureNumber = (text: string | number) => {
  const num = typeof text === "string" ? parseInt(text, 10) : text;
  return num < 10 ? `0${num.toString()}` : num.toString();
};

/**
 * Format từ second thành DD:HH:MM:SS
 * @param second - số giây
 */
export const secondFormat = (second: number) => {
  const days = Math.floor(second / 3600 / 24);
  const hours = Math.floor((second - days * 3600 * 24) / 3600);
  const minutes = Math.floor((second - Math.floor(second / 3600) * 3600) / 60);
  const seconds = second - Math.floor(second / 3600) * 3600 - minutes * 60;

  const displayDay = days.toString().padStart(2, "0");
  const displayHour = hours.toString().padStart(2, "0");
  const displayMinute = minutes.toString().padStart(2, "0");
  const displaySecond = seconds.toString().padStart(2, "0");

  return (
    displayDay + ":" + displayHour + ":" + displayMinute + ":" + displaySecond
  );
};

/**
 * ==========================================
 * WORK TIME CALCULATION FUNCTIONS
 * ==========================================
 */

/**
 * Đổi từ số giờ làm ra buổi (giây / 4 tiếng)
 * @param secondDiff - số giây
 */
export const getWorkCount = (secondDiff: number) => {
  return secondDiff / (4 * 60 * 60);
};

/**
 * Tính tổng số buổi làm theo giờ
 * @param listNgayLam - danh sách ngày làm việc
 */
export const tinhTongSoBuoiLamTheoGio = (listNgayLam: any[]) => {
  const tongSobuoi = listNgayLam?.reduce((total, item) => {
    const hourStart =
      item?.thoiGianBatDau ??
      (item?.buoi_lam_viec === BUOI_TRONG_NGAY.SANG
        ? MORNING_WORK_FROM_DEFAULT
        : AFTERNOON_WORK_FROM_DEFAULT);
    const hourEnd =
      item?.thoiGianKetThuc ??
      (item?.buoi_lam_viec === BUOI_TRONG_NGAY.SANG
        ? MORNING_WORK_TO_DEFAULT
        : AFTERNOON_WORK_TO_DEFAULT);
    const timeStart = new Date(moment(hourStart, "HH:mm").toDate()).getTime();
    const timeEnd = new Date(moment(hourEnd, "HH:mm").toDate()).getTime();
    const buoi = (timeEnd - timeStart) / 1000 / 60 / 60 / THOI_GIAN_1_BUOI;
    return total + (buoi === 0 ? 0 : 1);
  }, 0);
  return tongSobuoi;
};

/**
 * ==========================================
 * STRING & VALIDATION FUNCTIONS
 * ==========================================
 */

/**
 * Deep clone object
 * @param data - dữ liệu cần clone
 */
export const deepCloneObject = (data: any) => JSON.parse(JSON.stringify(data));

/**
 * Kiểm tra chuỗi có chứa kí tự đặc biệt không
 * @param str - string đầu vào
 */
export const checkSpecialCharacterExistence = (str: string) => {
  const format = /[^A-Za-z0-9]/;
  return format.test(str);
};

/**
 * Kiểm tra username hợp lệ (chỉ chứa chữ, số, dấu gạch dưới)
 * @param username - tên đăng nhập
 */
export function isValidUsername(username: string) {
  return /^[a-zA-Z0-9_]+$/.test(username);
}

/**
 * Loại bỏ kí tự đặc biệt khỏi tên file
 * @param filename - tên file có chứa kí tự đặc biệt
 */
export const normalizeFileName = (filename: string) => {
  return filename.replace(
    /\.|!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    "",
  );
};

/**
 * Lấy tên file không có extension: abc.jpg -> abc
 * @param stringName - tên file dạng abc.jpg
 */
export const getImageName = (stringName: string) => {
  const nameImageArray = stringName.split(".");
  let fileName = "";
  nameImageArray?.map((item: string, index: number) => {
    if (index !== nameImageArray.length - 1) fileName += `${item}.`;
    return null;
  });
  return fileName.substring(0, fileName.length - 1);
};

/**
 * ==========================================
 * STATUS & COLOR FUNCTIONS
 * ==========================================
 */

/**
 * Chuyển đổi trạng thái đơn
 * @param value - mã trạng thái
 */
export const convertTrangThai = (value: string) => {
  switch (value) {
    case TRANG_THAI_DON.CHO_PHE_DUYET:
      return TRANG_THAI_DUYET[1];
    case TRANG_THAI_DON.DUOC_PHE_DUYET:
      return TRANG_THAI_DUYET[2];
    case TRANG_THAI_DON.KHONG_DUOC_DUYET:
      return TRANG_THAI_DUYET[3];
    default:
      return TRANG_THAI_DUYET[3];
  }
};

/**
 * Trả về màu theo trạng thái đơn
 * @param value - mã trạng thái
 */
export const returnColorTrangThai = (value: string) => {
  switch (value) {
    case TRANG_THAI_DON.CHO_PHE_DUYET:
      return "#3366ff"; // blueText
    case TRANG_THAI_DON.DUOC_PHE_DUYET:
      return "#00c853"; // greenA700
    case TRANG_THAI_DON.KHONG_DUOC_DUYET:
      return "#c81e2a"; // redC81
    default:
      return "#000000"; // black0
  }
};

/**
 * Trả về màu theo trạng thái text
 * @param type - trạng thái (text)
 */
export function colorTrangThai(type: string) {
  switch (type) {
    case "Chờ duyệt":
      return "#fbc02d";
    case "Duyệt và không phạt":
    case "Duyệt":
      return "#28a745";
    case "Không duyệt":
      return "#dc3545";
    case "Duyệt và phạt":
      return "#14a2b8";
    default:
      return "#FFF";
  }
}

/**
 * Lấy màu theo trạng thái điểm danh
 * @param trangThaiGioLamCheckIn - trạng thái check in
 * @param trangThaiGioLamCheckOut - trạng thái check out
 */
export const getColorTrangThaiDiemDanh = (
  trangThaiGioLamCheckIn?: string,
  trangThaiGioLamCheckOut?: string,
) => {
  let colorCheckIn = "#999999";
  let colorCheckOut = "#999999";

  switch (trangThaiGioLamCheckIn) {
    case TRANG_THAI_DIEM_DANH.SOM:
    case TRANG_THAI_DIEM_DANH.DUNG_GIO:
      colorCheckIn = "#00c853"; // green
      break;
    case TRANG_THAI_DIEM_DANH.MUON:
      colorCheckIn = "#DE0600"; // red
      break;
  }

  switch (trangThaiGioLamCheckOut) {
    case TRANG_THAI_DIEM_DANH.SOM:
      colorCheckOut = "#DE0600"; // red
      break;
    case TRANG_THAI_DIEM_DANH.DUNG_GIO:
    case TRANG_THAI_DIEM_DANH.MUON:
      colorCheckOut = "#00c853"; // green
      break;
  }

  return {
    colorCheckIn,
    colorCheckOut,
  };
};

/**
 * Trả về role tiếng Việt
 * @param role - mã role
 */
export const returnRole = (role: string) => {
  switch (role) {
    case TYPE_EMPLOYEE.ADMIN:
      return TYPE_EMPLOYEE_VI.ADMIN;
    case TYPE_EMPLOYEE.FULLTIME:
      return TYPE_EMPLOYEE_VI.FULLTIME;
    case TYPE_EMPLOYEE.PARTTIME:
      return TYPE_EMPLOYEE_VI.PARTTIME;
    default:
      return TYPE_EMPLOYEE_VI.PARTTIME;
  }
};

/**
 * Chuyển đổi type thành id
 * @param type - loại đơn
 */
export function convertId(type: string) {
  switch (type) {
    case "Đơn xin nghỉ":
      return "don-xin-nghi";
    case "Đơn xin đến muộn":
      return "don-xin-den-muon";
    case "Đơn xin về sớm":
      return "don-xin-ve-som";
    default:
      return "";
  }
}
