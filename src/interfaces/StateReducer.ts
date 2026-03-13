import { Account } from "./Account";
import {
  ResponseRegisterLimit,
  ThongTinDiemDanh,
  ThongTinLamViecUser,
  ThongTinDotDK,
  TypeInfoDon,
  TypeBodyGetDonAdmin,
  ThongTinNopDon,
} from "./TypeAPI";
export type userReducer = {
  loading: boolean;
  account: Account;
};
export interface StateReducer {
  userReducer: {
    loading: boolean;
    account: Account;
    thongTinLamViec: ThongTinLamViecUser;
    deviceSignedUpType: number;
    thongTinNopDon: ThongTinNopDon;
    thongTinLuong: number;
    luongDuKien: number;
  };
  notificationCongTyReducer: {
    refreshingCT: boolean;
    listNotificationCT: Array<any>;
    amountUnreadCT: number;
  };
  notificationReducer: {
    loadMore: boolean;
    refreshing: boolean;
    listNotification: Array<any>;
    maxData: boolean;
    amountUnread: number;
  };
  limitRegisterReducer: {
    loading: boolean;
    workLimit: ResponseRegisterLimit;
  };
  diemDanhReducer: {
    thongTinDiemDanh: ThongTinDiemDanh;
    netWorkType: number;
  };
  dotDangKyReducer: {
    thongTinDotDK: ThongTinDotDK;
  };
  dSDonDuyetReducer: {
    listDon: TypeInfoDon[];
    loading: boolean;
  };
  lichSuDonReducer: {
    refreshing: boolean;
    loadMore: boolean;
    listDon: TypeInfoDon[];
    maxData: boolean;
    defaultBody: TypeBodyGetDonAdmin;
  };
  modalReducer: {
    visibleTokenExpired: boolean;
    leftBtnFunc: () => void;
    rightBtnFunc: () => void;
  };
}
