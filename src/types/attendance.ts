export type AttendanceType =
  | "morning_in"
  | "morning_out"
  | "afternoon_in"
  | "afternoon_out";

export interface AttendanceRecord {
  id: string;
  userId: string;
  type: AttendanceType;
  timestamp: string;
  status: "on_time" | "late" | "early";
}

export interface AttendanceSession {
  checkIn: string | null;
  checkOut: string | null;
}

export interface DailyAttendance {
  date: string;
  morning: AttendanceSession;
  afternoon: AttendanceSession;
}

export interface MonthlyStats {
  workDays: number;
  registeredDays: number;
  approvedLeaves: number;
  lateApprovals: number;
  earlyLeaveApprovals: number;
  overtimeHours: number;
}
