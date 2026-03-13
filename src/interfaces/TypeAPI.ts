/* eslint-disable camelcase */
import { type } from "ramda";
import { Account } from "./Account";

export type TBodyDangNhap = {
  username: string;
  password: string;
  deviceId: string;
  oneSignalId: string;
};

export type TBodyDoiMatKhau = {
  oldPassword: string;
  newPassword: string;
};

export type TBodySignUpDevice = {
  password: string;
};
export interface IThongKe {
  ngay_remote?: string;
  nguoi_cu_di_cong_tac: (number | string)[];
  nguoi_quan_ly: (number | string)[];
  chi_phi_du_kien?: number;
  noi_di_cong_tac?: string;
  thoi_gian_bat_dau_cong_tac?: string;
  thoi_gian_ket_thuc_cong_tac?: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  cong_viec_lam_them?: string;
  du_an?: string;
  ca_lam?: string;
  id: number;
  ly_do: string;
  name: string;
  ngay: string;
  nhan_vien_id: (number | string)[];
  thoi_gian_gui_don: string;
  trang_thai: string;
  ca_muon?: string;
  so_phut?: number;
  phut_ve_som?: number;
}
export type TypeResponseThongKe = {
  data: IThongKe[];
  statusCode: number;
};
export type TypeResponseSignUpDevice = {
  success: boolean;
  message: string;
};
// chưa có api chính để viết interface, anh dũng chưa chốt nên để tạm any
export type TypeResponseLogin = {
  data: {
    accessToken: string;
    user: Account;
  };
};

export type TypeResponseBanner = any;

export type TypeResponseCurrentBanner = any;

export type TypeResponseUpcomingBanner = any;

export type TypeResponseNews = any;

export type UserInformation = {
  _id: string;
  username: string;
  password: string;
  email: string;
  token: string;
  emailVerify: {
    token: string;
    createdAt: Date;
    expiredAt: Date;
    verifiedAt: Date;
    verified: boolean;
  };
  systemRole: string;
  identifiedDeviceInfo?: {
    deviceId: string;
    identifiedAt: Date;
  };
  clientDeviceId: string;
};

export type TypeResponseUserInformation = {
  data: {
    data: UserInformation;
  };
};

export type typeInfoDiemDanh = {
  username: string;
  hoTen: string;
  nam: number;
  thang: number;
  ngay: number;
  timestamp: string;
  buoiDiemDanh: string;
  trangThaiCheckIn: true;
  thoiGianCheckIn: string;
  trangThaiCheckOut: true;
  thoiGianCheckOut: string;
  thoiGianBatDauBuoi: string;
  thoiGianKetThucBuoi: string;
  thoiGianBatDauDiemDanh: string;
  thoiGianKetThucDiemDanh: string;
  phutDiemDanhMuonChoPhep: number;
  trangThaiGioLamCheckIn: string;
  trangThaiGioLamCheckOut: string;
  chamDiemGioLam: number;
};

export type BuoiDiemDanh = {
  danh_gia_thoi_gian_lam_viec?: number;
  _id?: string;
  buoiDiemDanh?: string;
  buoi_lam_viec?: string;
  nam?: number;
  ngay?: number;
  thang?: number;
  username?: string;
  chamDiemGioLam?: number;
  hoTen?: string;
  phutDiemDanhMuonChoPhep?: number;
  thoiGianBatDau?: string;
  thoiGianBatDauBuoi?: string;
  thoiGianBatDauDiemDanh?: string;
  thoiGianKetThuc?: string;
  thoiGianKetThucBuoi?: string;
  thoiGianKetThucDiemDanh?: string;
  timestamp?: string;
  trangThaiCheckIn?: boolean;
  trangThaiCheckOut?: boolean;
  thoiGianCheckIn?: string;
  thoiGianCheckOut?: string;
  trangThaiGioLamCheckIn?: string;
  trangThaiGioLamCheckOut?: string;
  // New fields from /thoi-gian-lam-viec API
  trang_thai_lam_viec?: string;
  thoi_gian_check_in?: string | false;
  thoi_gian_check_out?: string | false;
  trang_thai_check_in?: string;
  trang_thai_check_out?: string;
};

export type ThongTinDiemDanh = {
  sang: BuoiDiemDanh;
  chieu: BuoiDiemDanh;
  buoiDiemDanh: string;
};

export type TypeResponseAttendanceStatus = {
  data: {
    data: ThongTinDiemDanh;
    statusCode: number;
  };
};

export type ResponseAttendance = {
  thoi_gian_check_in: any;
  thoi_gian_check_out: any;
  message: string;
  periodOfTime: string;
  deviceId: string;
  createdAt: string;
  type: string;
  username: string;
  workFrom: string;
  workTo: string;
  workDuration: number;
  inResult: string;
};

export type TypeResponseCheckIn = {
  canh_bao: any;
  message: string;
  data: ResponseAttendance;
};

export type TypeBodyCheckIn = {
  otp: string;
};

export type TypeItemPhoBien = {
  title: string;
  destination: string;
};

export type TypeBodyGetLateStat = {
  month: string | number;
  year: string | number;
  date?: string | number;
  registerStatus?: string | undefined;
  page: number;
  limit: number;
};

export type TypeResponseTotalWorkedDay = {
  data: number;
};

export type TypeResponseAvatar = {
  data: {
    id: number;
    image_512: string;
  };
};
export type TypeResponseGetLateStatistic = {
  data: {
    monthLimit: number;
    monthRegisted: number;
    weekRegisted?: number;
    monthProcessing?: number;
  };
};

export type TypeResponseGetExtraStatistic = {
  data: {
    monthRegistedFast?: number;
    monthRegistedNormal?: number;
  };
};
export type TypeResponseGetWorkTime = {
  data: {
    morningWorkFrom: string;
    morningWorkTo: string;
    afternoonWorkFrom: string;
    afternoonWorkTo: string;
  };
};

export type TypeBodyRegisterOffDate = {
  ngay: number;
  thang: number;
  nam: number;
  buoi: string;
  lyDo?: string;
  urlAnh?: string;
};
export type TypeBodyLamRemote = {
  ngay_remote: string;
  ca_lam: string;
  ly_do: string;
};

export type TypeBodyRegisterOT = {
  thoiGianBatDauLamNgoaiGio: string;
  thoiGianKetThucLamNgoaiGio: string;
  congViecLamNgoaiGio: string;
  du_an: string;
};

export type TypeBodyRegisterLate = {
  nam: number;
  thang: number;
  ngay: number;
  phutDenMuon: number;
  caLam: string;
  lyDo?: string;
};

export type TypeBodyRegisterEarly = {
  nam: number;
  thang: number;
  ngay: number;
  phutVeSom: number;
  caLam: string;
  lyDo: string;
};

export type TypeBodyRegisterExtra = {
  date: number;
  month: number;
  year: number;
  workShift: string;
  afternoonWorkFrom?: string;
  afternoonWorkTo?: string;
  morningWorkFrom?: string;
  morningWorkTo?: string;
};

export type TypeResponseRegisterLate = {
  data: Array<TypeResponseContentRegister>;
};

export type TypeResponseRegisterOT = {
  data: Array<TypeResponseContentOT>;
};

export type TypeResponseRegisterHistory = {
  data: Array<TypeResponseRegisterLate>;
};

export type TypeResponseLateCounting = {
  data: {
    processing: number;
    accepted: number;
    rejected: number;
  };
};

export type TypeResponseContentOT = {
  _id: string;
  date: number;
  month: number;
  year: number;
  registerType: string;
  fromHour: string;
  toHour: string;
  otWork: string;
  username: string;
  registerStatus: string;
  createdAt: Date;
  updatedAt: Date;
  imageUri: string;
};

export type TypeResponseContentRegister = {
  [x: string]: any;
  _id?: string;
  date?: number;
  month?: number;
  year?: number;
  registerType?: string;
  shift?: string;
  minuteLength?: number;
  reason?: string;
  username?: string;
  registerStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
  otWork?: string;
  otType?: string;
  otTo?: string;
  otFrom?: string;
  workShift?: string;
  morningWorkFrom?: string;
  morningWorkTo?: string;
  afternoonWorkFrom?: string;
  afternoonWorkTo?: string;
  nam?: number;
  thang?: number;
  ngay?: number;
  data?: Array<string>;
};

export type TypeResponseRegisterAbsent = {
  data: TypeResponseContentRegister;
};

export type TypeObjectWorkingDay = {
  _id: string;
  type?: string;
  date: number;
  absenceShift?: string;
  workShift?: string;
  radioMorning?: number;
  radioAfternoon?: number;
  morningWorkFrom?: string;
  morningWorkTo?: string;
  afternoonWorkFrom?: string;
  afternoonWorkTo?: string;
};

export type TypeResponseWorkingCalendar = {
  data: TypeResponseDataWorkingCalendar;
};

export type TypeResponseDataWorkingCalendar = {
  dailyCalendarList?: Array<TypeObjectWorkingDay>;
  dailyRegisterList?: Array<TypeObjectWorkingDay>;
  month: number;
  year: number;
  registerFrom: Date;
  registerTo: Date;
  registerStatus: string;
};

export type ResponseRegisterLimit = {
  morningWorkFrom: string;
  morningWorkTo: string;
  afternoonWorkFrom: string;
  afternoonWorkTo: string;
  absentLimitPerMonth: number;
  requiredWorkDayPerMonth: number;
  absenceLimitPerYear: number;
};

export type TypeResponseRegisterLimit = {
  data: ResponseRegisterLimit;
};

export type TypeResponseWorkTimeByDay = {
  data: TypeObjectWorkingDay;
};

export type TypeBodyGetDonAdmin = {
  page: number;
  limit: number;
  condition?: {
    trangThaiDon?: string;
    loaiDon?: string | { $in: string[] };
    createdAt?: {
      $lte: string;
      $gte: string;
    };
    ngay?: number;
    thang?: number;
    nam?: number;
  };
};
export type TypeBodyGetDiemDanhAdmin = {
  page: number;
  limit: number;
  condition?: {
    ngay?: number;
    thang?: number;
    nam?: number;
    buoiDiemDanh?: string;
    trangThaiCheckIn?: boolean;
    trangThaiGioLamCheckIn?: string;
  };
};

export type TypeInfoDon = {
  nguoi_quan_ly: any;
  nguoi_cu_di_cong_tac: string;
  anh_dinh_kem: string;
  ly_do_phat_nghi: string[];
  ly_do_phat: string[];
  ly_do_phat_muon: string[];
  ly_do_khong_phat: string;
  ly_do_tu_choi: string;
  chi_phi_du_kien: number;
  createdAt: string;
  ngay: any;
  name?: string;
  thoi_gian_gui_don?: string;
  so_phut?: number;
  thoiGianBatDau?: string;
  thoiGianKetThuc?: string;
  buoiLamViec?: string;
  ca_muon?: string;
  thoiGianDenMuon?: number;
  ngayXinDenMuon?: string;
  phutVeSom?: number;
  phutDenMuon?: number;
  ngayXinVeSom?: string;
  thang: number;
  lyDo: string;
  congViecLamNgoaiGio?: string;
  loaiOt?: string;
  thoiGianBatDauLamNgoaiGio?: string;
  thoiGianKetThucLamNgoaiGio?: string;
  afternoonWorkFrom?: string;
  afternoonWorkTo?: string;
  morningWorkFrom?: string;
  morningWorkTo?: string;
  ca_lam?: string;
  canhBao?: string[];
  ghiChu?: string;
  trangThaiDon: string;
  registerTimestamp: number;
  registerType: string;
  imageUrl?: string;
  role: string;
  buoi: string;
  total: number;
  updatedAt: string;
  hoDem: string;
  ten: string;
  username: string;
  nam: number;
  __v: number;
  _id: string;
  loaiDon: string;
  cong_viec_lam_them?: string;
  du_an?: string;
  loai_ot?: string;
  thoi_gian_ket_thuc?: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_bat_dau_cong_tac?: string;
  thoi_gian_ket_thuc_cong_tac?: string;
  noi_di_cong_tac?: string;
  ly_do?: string;
  phut_ve_som?: number;
};

export type TypeResponseGetDonAdmin = {
  data: {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: Array<TypeInfoDon>;
  };
};

export type TypeResponseGetDiemDanhAdmin = {
  data: {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: Array<typeInfoDiemDanh>;
  };
};
export type ThongTinNopDon = {
  soNgayLam: number;
  soNgayNghi: number;
  soNgayXinDenMuon: number;
  soNgayXinVeSom: number;
};

export type TypeResponseGetSoBuoiNopDon = {
  data: {
    data: ThongTinNopDon;
    statusCode: number;
  };
};

export type TypeBodyDuyetDon = {
  loaiOt?: string;
};

export type TypeBodyTuChoi = {
  ghiChu?: string;
};

export type TypeResponseDuyetDonAdmin = {
  data: TypeInfoDon;
  statusCode: number;
};

export type ThongTinLamViecUser = {
  AFTERNOON_WORK_FROM: string;
  AFTERNOON_WORK_TO: string;
  MORNING_WORK_FROM: string;
  MORNING_WORK_TO: string;
  FULLTIME_MAX_ABSENT_PER_MONTH: number;
  PARTTIME_MIN_WORK_PER_MONTH: number;
  MAX_MINUTE_REGISTER_HOME_EARLY: number;
  MAX_MINUTE_REGISTER_WORK_LATE: number;
  MAX_MINUTE_WORK_LATE: number;
  MAX_REGISTER_HOME_EARLY_PER_MONTH: number;
  MAX_REGISTER_WORK_LATE_PER_MONTH: number;
  MIN_MINUTE_HOME_EARLY: number;
  MIN_WORK_HOUR_PER_SESSION: number;
};

export type TypeResponseThongTinLamViecUser = {
  data: ThongTinLamViecUser;
};

export type ThongTinDotDK = {
  soBuoiLamToiThieu?: number;
  phan_tram_phat_khi_nv_part_time_khong_dang_ky_du_so_buoi?: number;
  thoi_gian_bat_dau_lam_buoi_chieu?: string;
  thoi_gian_ket_thuc_lam_buoi_chieu?: string;
  thoi_gian_bat_dau_lam_buoi_sang?: string;
  thoi_gian_ket_thuc_lam_buoi_sang?: string;
  createdAt?: string;
  nam?: number;
  thang?: number;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  trangThaiKichHoat?: boolean;
  updatedAt?: string;
  usernameList?: string[];
  __v?: number;
  _id?: string;
  id?: string;
};

export type TypeResponseDotDK = {
  data: ThongTinDotDK;
  statusCode: number;
};

export type NgayLamViec = {
  thoi_gian_check_in: string;
  thoi_gian_check_out: string;
  buoiLamViec?: string;
  loai?: string;
  ngay: number;
  timestamp?: string;
  trangThaiLamViec?: string;
  thoiGianBatDau?: string;
  thoiGianKetThuc?: string;
  changed?: boolean;
  buoi_lam_viec?: string;
  trang_thai_lam_viec?: string;
};

export type danhSachNgayDangKyAdmin = {
  buoiLamViec: string;
  ngay: number;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  timestamp: Date;
  trangThaiLamViec: string;
  _id: string;
};
export type NgayLamViecAdmin = {
  createdAt: Date;
  danhSachNgayDangKy: Array<danhSachNgayDangKyAdmin>;
  nam: number;
  thang: number;
  updatedAt: Date;
  username: string;
  __v: number;
  _id: string;
};

export type LichDKThangNam = {
  thang: number;
  nam: number;
  _id: string;
  danhSachNgayLam: NgayLamViec[];
};

export type LichDaDK = {
  thang: number;
  nam: number;
  _id: string;
  idDotDangKy: string;
  updatedAt: string;
  createdAt: string;
  username: string;
  __v: number;
  danhSachNgayDangKy: NgayLamViec[];
};
export type LichDKAdmin = {
  nhanVien: {
    _id: string;
    username: string;
    email: string;
    profile: {
      _id: string;
      username: string;
      bankAccount: string;
      contactEmail: string;
      dateOfBirth: Date;
      firstname: string;
      gender: string;
      lastname: string;
      phoneNumber: string;
      baseSalary: number;
      team: string;
    };
    systemRole: string;
    identifiedDeviceInfo: {
      _id: string;
      deviceId: string;
      identifiedAt: Date;
    };
    idTeam: {
      _id: string;
      maTeam: string;
      tenTeam: string;
    };
  };
  dangKy: NgayLamViecAdmin[];
};
export type TypeResponseLichDKThangNam = {
  data: LichDKThangNam;
  statusCode: number;
};

export type TypeResponseLichDaDK = {
  data: LichDaDK;
  statusCode: number;
};
export type TypeResponseLichDKAdmin = {
  data: LichDKAdmin[];
  statusCode: number;
};
export type TypeResponseStatusOpen = {
  status_open: boolean;
};
export type TypeResponseSignup = {
  status: number;
};
export type TypeResponseDelAcc = {
  mesaage: string;
};
export type TypeResponseThongKeDiemDanh = {
  data: any[];
};
export type TypeBodyUpdateLichLam = {
  danhSachNgayDangKy: NgayLamViec[];
  idDotDangKy?: string;
  nam?: number;
  thang?: number;
};
export type BodyDangKy = {
  username: string;
  password: string;
  name: string;
};
export type ThongTinLuong = {
  _id: string;
  username: string;
  loai: string;
  luong: number;
  dangApDung: boolean;
};

export type TypeResponseThongTinLuong = {
  data: {
    data: ThongTinLuong;
    statusCode: number;
  };
};

export type TypeBodyReadNoti = {
  notificationId: string;
};

export type TypeBodyGetNoti = {
  limit: number;
  page: number;
};

export type TypeNotification = {
  nguoi_gui: any;
  thoi_gian: Date;
  create_date: Date;
  mo_ta?: string;
  id: number;
  tieu_de: any;
  noi_dung: any;
  da_doc_thong_bao: any;
  roles: string[];
  userIds: string[];
  _id: string;
  senderName: string;
  senderId: string;
  notifType: string;
  title: string;
  content: string;
  htmlContent: string;
  description: string;
  oneSignalData: {
    id: string;
    notifType: string;
  };
  unread: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TypeResponseGetNoti = {
  data: {
    data: {
      page: number;
      offset: number;
      limit: number;
      total: number;
      result: TypeNotification[];
    };
    statusCode: number;
  };
};

export type TypeResponseGetUnreadNotiNumber = {
  data: {
    data: {
      so_thong_bao_chua_doc: number;
    };
    statusCode: number;
  };
};
