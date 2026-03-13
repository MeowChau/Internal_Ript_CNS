import url from "./url";
import { getData, postData, putData, deleteData, postFormData } from "./helper";

// TODO: Define proper TypeScript interfaces in src/types/
// For now, using 'any' for flexibility

// ==========================================
// AUTHENTICATION APIs
// ==========================================

/**
 * Đăng nhập (New API)
 */
export function postDangNhapNew(body: { username: string; password: string }) {
  return postData<any, any>(url.LOGIN_NEW, body, false).then((res) => res);
}

/**
 * Đăng xuất (New API)
 */
export function postDangXuatNew() {
  return postData<unknown, { statusCode: number }>(
    url.LOGOUT_NEW,
    {},
    true,
  ).then((res) => res);
}

/**
 * Lấy thông tin user hiện tại
 */
export function getUserInfoNew() {
  return getData<unknown, any>(url.USER_INFORMATION_NEW, {}, true).then(
    (res) => res,
  );
}

/**
 * Lấy avatar
 */
export function getAvatar() {
  return getData<unknown, any>(url.GET_AVATAR_NEW, {}, true).then((res) => res);
}

/**
 * Đổi mật khẩu
 */
export function putDoiMatKhauNew(body: {
  oldPassword: string;
  newPassword: string;
}) {
  return putData<any, any>(url.CHANGE_PASSWORD_NEW, body, true).then(
    (res) => res,
  );
}

/**
 * Đổi avatar
 */
export function changeAvatar(body: any) {
  return putData<any, any>(url.CHANGE_AVATAR_NEW, body, true).then(
    (res) => res,
  );
}

// ==========================================
// SCHEDULE REGISTRATION (Đăng ký lịch làm)
// ==========================================

/**
 * Lấy đợt đăng ký lịch làm việc
 */
export function getDotDangKyNew() {
  return getData<unknown, any>(url.GET_DOT_DANG_KY_NEW, {}, true).then(
    (res) => res,
  );
}

/**
 * Lấy ngày đăng ký trong tháng/năm
 */
export function postLichDKThangNamNew(body: { year: number; month: number }) {
  return postData<any, any>(url.GET_NGAY_DANG_KY_NEW, body, true).then(
    (res) => res,
  );
}

/**
 * Gửi đăng ký lịch làm
 */
export function putLichDK(body: any) {
  return putData<any, any>(url.GUI_DANG_KY_LICH_LAM, body, true).then(
    (res) => res,
  );
}

/**
 * Xem lịch đã đăng ký của bản thân
 */
export function postLichDKMe(body: { nam: number; thang: number }) {
  return postData<any, any>(url.GET_LICH_DANG_KY_ME, body, true).then(
    (res) => res,
  );
}

// ==========================================
// LEAVE REQUESTS (Đơn xin)
// ==========================================

/**
 * Kiểm tra đơn xin đến muộn (cảnh báo trùng)
 */
export function postCheckRegisterLateNew(body: any) {
  return postData<any, any>(url.CHECK_DON_DEN_MUON_NEW, body, true).then(
    (res) => res,
  );
}

/**
 * Gửi đơn xin đến muộn
 */
export function postRegisterLateNew(body: any) {
  return postData<any, any>(url.GUI_DON_DEN_MUON_NEW, body, true).then(
    (res) => res,
  );
}

/**
 * Gửi đơn xin OT (làm ngoài giờ)
 */
export function postRegisterOTNew(body: any) {
  return postData<any, any>(url.GUI_DON_OT_NEW, body, true).then((res) => res);
}

/**
 * Kiểm tra đơn xin nghỉ (cảnh báo trùng)
 */
export function postCheckRegisterAbsentNew(body: any) {
  return postData<any, any>(url.CHECK_DON_XIN_NGHI_NEW, body, true).then(
    (res) => res,
  );
}

/**
 * Gửi đơn xin nghỉ
 */
export function postRegisterAbsentNew(body: any) {
  return postData<any, any>(url.GUI_DON_XIN_NGHI_NEW, body, true).then(
    (res) => res,
  );
}

/**
 * Gửi đơn xin làm remote
 */
export function postLamRemote(body: any) {
  return postData<any, any>(url.GUI_DON_XIN_REMOTE, body, true).then(
    (res) => res,
  );
}

/**
 * Lấy danh sách đơn của bản thân
 */
export function postDonXinNew(body: {
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  trang_thai: string;
  loai_don: string;
}) {
  return postData<any, any>(url.GET_DON_XIN_ME, body, true).then((res) => res);
}

/**
 * Gửi đơn xin về sớm
 */
export function postRegisterEarlyNew(body: any) {
  return postData<any, any>(url.GUI_DON_XIN_VE_SOM_NEW, body, true).then(
    (res) => res,
  );
}

/**
 * Kiểm tra đơn xin về sớm
 */
export function postCheckRegisterEarlyNew(body: any) {
  return postData<any, any>(url.CHECK_DON_XIN_VE_SOM_NEW, body, true).then(
    (res) => res,
  );
}

/**
 * Gửi đơn xin đi công tác
 */
export function postRegisterCongTacNew(body: any) {
  return postData<any, any>(url.GUI_DON_XIN_DI_CONG_TAC_NEW, body, true).then(
    (res) => res,
  );
}

/**
 * Cập nhật đơn xin làm thêm
 */
export function putRegisterLamThemNew(body: any) {
  return putData<any, any>(url.GUI_DON_XIN_LAM_THEM_NEW, body, true).then(
    (res) => res,
  );
}

// ==========================================
// ADMIN & MANAGEMENT
// ==========================================

/**
 * Lấy danh sách quản trị viên
 */
export function getListQuanTri() {
  return getData<unknown, any>(url.GET_DANH_SACH_QUAN_TRI, {}, true).then(
    (res) => res,
  );
}

/**
 * Lấy danh sách quản lý
 */
export function getListQuanLy() {
  return getData<unknown, any>(url.GET_DANH_SACH_QUAN_LY, {}, true).then(
    (res) => res,
  );
}

/**
 * Quản lý đơn (duyệt/từ chối hàng loạt)
 */
export function quanLyDon(loai: string, loaiDuyet: string, listId: number[]) {
  return putData<{ listId: number[] }, any>(
    `${url.QUAN_LY_DON}/${loai}/v3/${loaiDuyet}`,
    { listId },
    true,
  ).then((res) => res);
}

/**
 * Lấy danh sách đơn từ theo điều kiện (Admin)
 */
export function getListQuanLyDonTu(code: string, year: number, month: number) {
  return getData<unknown, any>(
    `${url.QUAN_LY_DON_TU}/${code}/${year}/${month}`,
    {},
    true,
  ).then((res) => res);
}

// ==========================================
// SALARY (Lương)
// ==========================================

/**
 * Lấy thông tin lương theo tháng/năm
 */
export function getInfoLuongNew(thang: number, nam: number) {
  return getData<unknown, any>(
    `${url.GET_INFO_LUONG_ME}/${thang}/${nam}`,
    {},
    true,
  ).then((res) => res);
}

/**
 * Lấy thông tin lương V3
 */
export function getInfoLuongNewV3(thang: number, nam: number) {
  return getData<unknown, any>(
    `${url.GET_INFO_LUONG_ME_V3}/${thang}/${nam}`,
    {},
    true,
  ).then((res) => res);
}

/**
 * Lấy đợt xác nhận lương
 */
export function getDotConfirmLuongNew(thang: number, nam: number) {
  return getData<unknown, any>(
    `${url.GET_INFO_DOT_CONFIRM_LUONG}/${thang}/${nam}`,
    {},
    true,
  ).then((res) => res);
}

/**
 * Lấy đợt xác nhận lương V3
 */
export function getDotConfirmLuongNewV3(thang: number, nam: number) {
  return getData<unknown, any>(
    `${url.GET_INFO_DOT_CONFIRM_LUONG_V3}/${thang}/${nam}`,
    {},
    true,
  ).then((res) => res);
}

/**
 * Xác nhận lương
 */
export function putConfirmLuongNew(thang: number, nam: number, body: any) {
  return putData<any, any>(
    `${url.PUT_CONFIRM_LUONG}/${thang}/${nam}`,
    body,
    true,
  ).then((res) => res);
}

/**
 * Xác nhận lương V3
 */
export function putConfirmLuongNewV3(thang: number, nam: number, body: any) {
  return putData<any, any>(`${url.PUT_CONFIRM_LUONG_V3}`, body, true).then(
    (res) => res,
  );
}

/**
 * Lấy thông tin lương part-time
 */
export function getInfoLuongNewPT(thang: number, nam: number) {
  return getData<unknown, any>(
    `${url.GET_INFO_LUONG_ME_PT}/${thang}/${nam}`,
    {},
    true,
  ).then((res) => res);
}

/**
 * Lấy đợt xác nhận lương part-time
 */
export function getDotConfirmLuongNewPT(thang: number, nam: number) {
  return getData<unknown, any>(
    `${url.GET_INFO_DOT_CONFIRM_LUONG_PT}/${thang}/${nam}`,
    {},
    true,
  ).then((res) => res);
}

/**
 * Xác nhận lương part-time
 */
export function putConfirmLuongNewPT(thang: number, nam: number, body: any) {
  return putData<any, any>(
    `${url.PUT_CONFIRM_LUONG_PT}/${thang}/${nam}`,
    body,
    true,
  ).then((res) => res);
}

// ==========================================
// ATTENDANCE (Điểm danh)
// ==========================================

/**
 * Check-in điểm danh
 */
export function postCheckInNew(body: {
  latitude: number;
  longitude: number;
  timestamp: number;
  photo?: string;
}) {
  return postData<any, any>(url.CHECKIN_NEW, body, true).then((res) => res);
}

/**
 * Check-out điểm danh
 */
export function postCheckOutNew(body: {
  latitude: number;
  longitude: number;
  timestamp: number;
  photo?: string;
}) {
  return postData<any, any>(url.CHECKOUT_NEW, body, true).then((res) => res);
}

/**
 * Cảnh báo check-in (kiểm tra điều kiện)
 */
export function postWarningCheckInNew(body: any) {
  return postData<any, any>(url.CANH_BAO_CHECK_IN, body, true).then(
    (res) => res,
  );
}

/**
 * Cảnh báo check-out (kiểm tra điều kiện)
 */
export function postWarningCheckOutNew(body: any) {
  return postData<any, any>(url.CANH_BAO_CHECK_OUT, body, true).then(
    (res) => res,
  );
}

/**
 * Lấy thiết bị định danh
 */
export function getThietBiDinhDanh() {
  return getData<any, any>(url.THIET_BI_DINH_DANH, {}, true).then((res) => res);
}

/**
 * Cập nhật thiết bị định danh
 */
export function postThietBiDinhDanh(id: string) {
  return putData<any, any>(`${url.THIET_BI_DINH_DANH}${id}`, {}, true).then(
    (res) => res,
  );
}

// ==========================================
// NOTIFICATIONS (Thông báo)
// ==========================================

/**
 * Đánh dấu đã đọc thông báo
 */
export function putDocThongBao(id: number) {
  return putData<unknown, any>(`${url.CHECK_THONG_BAO}/${id}`, {}, true).then(
    (res) => res,
  );
}

/**
 * Lấy danh sách thông báo
 */
export function getListThongBao() {
  return getData<unknown, any>(url.THONG_BAO, {}, true).then((res) => res);
}

/**
 * Đọc tất cả thông báo
 */
export function readAllNoti() {
  return putData<unknown, any>(url.READ_ALL, {}, true).then((res) => res);
}

/**
 * Lấy thông báo công ty
 */
export function getThongBaoMe() {
  return getData<unknown, any>(url.THONG_BAO_CONG_TY, {}, true).then(
    (res) => res,
  );
}

/**
 * Lấy thông báo công ty theo ID
 */
export function getThongBaoCTById(id: number) {
  return getData<unknown, any>(`${url.THONG_BAO_BY_ID}/${id}`, {}, true).then(
    (res) => res,
  );
}

/**
 * Đọc thông báo theo ID
 */
export function docThongBaoById(id: number) {
  return putData<unknown, any>(
    `${url.DOC_THONG_BAO_BY_ID}/${id}`,
    {},
    true,
  ).then((res) => res);
}

/**
 * Đọc tất cả thông báo công ty
 */
export function docAllThongBao() {
  return putData<unknown, any>(url.DOC_ALL_THONG_BAO, {}, true).then(
    (res) => res,
  );
}

// ==========================================
// STATISTICS (Thống kê)
// ==========================================

/**
 * Thống kê theo tháng
 */
export function getThongKeThang(thang: number, nam: number) {
  return getData<unknown, any>(
    `${url.THONG_KE}/${nam}/${thang}`,
    {},
    true,
  ).then((res) => res);
}

/**
 * Thống kê thời gian làm việc theo ngày
 */
export function getThoigianLamViec(ngay: number, thang: number, nam: number) {
  return getData<unknown, any>(
    `${url.THOI_GIAN_LAM_VIEC}/${ngay}/${thang}/${nam}`,
    {},
    true,
  ).then((res) => res);
}

/**
 * Thống kê điểm danh
 */
export function thongKeDiemDanh() {
  return getData<unknown, any>(url.THONG_KE_DIEM_DANH, {}, true).then(
    (res) => res,
  );
}

/**
 * Thống kê nghỉ phép
 */
export function getThongKeNghi(year: number, month: number) {
  return getData<unknown, any>(
    `${url.THONG_KE_XIN_NGHI}/${year}/${month}`,
    {},
    true,
  ).then((res) => res);
}

/**
 * Thống kê đến muộn
 */
export function getThongKeDenMuon(year: number, month: number) {
  return getData<unknown, any>(
    `${url.THONG_KE_DEN_MUON}/${year}/${month}`,
    {},
    true,
  ).then((res) => res);
}

/**
 * Thống kê về sớm
 */
export function getThongKeVeSom(year: number, month: number) {
  return getData<unknown, any>(
    `${url.THONG_KE_VE_SOM}/${year}/${month}`,
    {},
    true,
  ).then((res) => res);
}

// ==========================================
// UTILITIES
// ==========================================

/**
 * Upload file ảnh
 */
export function uploadFileImage(body: FormData) {
  return postFormData<FormData, any>(url.POST_IMAGE, body, true).then(
    (res) => res,
  );
}

/**
 * Lấy cấu hình đăng ký
 */
export function getConfigDangKy() {
  return getData<unknown, any>(url.CONFIG_SIGNUP, {}, false).then((res) => res);
}

/**
 * Đăng ký tài khoản
 */
export function postDangKyTaiKhoan(body: any) {
  return postData<any, any>(url.SIGNUP, body, false).then((res) => res);
}

/**
 * Xóa tài khoản
 */
export function delAccount() {
  return deleteData<unknown, any>(url.DEL_ACCOUNT, undefined, true).then(
    (res) => res,
  );
}

// ==========================================
// OLD APIs (Backward Compatibility)
// ==========================================

/**
 * Đăng nhập (Old API)
 * @deprecated Use postDangNhapNew instead
 */
export function postDangNhap(body: { username: string; password: string }) {
  return postData<any, any>(url.LOGIN, body, false).then((res) => res);
}

/**
 * Đăng xuất (Old API)
 * @deprecated Use postDangXuatNew instead
 */
export function postDangXuat() {
  return postData<unknown, { statusCode: number }>(url.LOGOUT, {}, true).then(
    (res) => res,
  );
}

/**
 * Đổi mật khẩu (Old API)
 * @deprecated Use putDoiMatKhauNew instead
 */
export function postDoiMatKhau(body: {
  oldPassword: string;
  newPassword: string;
}) {
  return postData<any, any>(url.CHANGE_PASSWORD, body, true).then((res) => res);
}
