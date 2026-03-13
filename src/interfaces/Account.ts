export interface Account {
  department_id: any;
  loai_nhan_vien: string;
  _id: string;
  token: string;
  username: string;
  password: string;
  email: string;
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
  profile: {
    idNumber: string;
    gender: string;
    firstname: string;
    contactEmail: string;
    bankAccount: string;
    address: string;
    _id: string;
    phoneNumber: string;
    lastname: string;
    placeOfBirth: string;
    team: string;
    updatedAt: string;
    createdAt: string;
    dateOfBirth: string;
    joinDate: string;
    username: string;
    baseSalary: number;
    name?: string;
  };
}

export interface CrudeAccount {
  token: string;
}
