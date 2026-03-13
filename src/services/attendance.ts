import type {
  AttendanceType,
  AttendanceRecord,
  DailyAttendance,
} from "@/types";
import { STORAGE_KEYS } from "@/config";
import { StorageService } from "./storage";
import { formatTimeShort, isMorning } from "@/utils";

export const AttendanceService = {
  async checkIn(userId: string): Promise<AttendanceRecord> {
    const now = new Date();
    const timeString = formatTimeShort(now);
    const type: AttendanceType = isMorning() ? "morning_in" : "afternoon_in";
    const key =
      type === "morning_in"
        ? STORAGE_KEYS.MORNING_CHECK_IN
        : STORAGE_KEYS.AFTERNOON_CHECK_IN;

    await StorageService.set(key, timeString);

    return {
      id: `${userId}-${type}-${now.getTime()}`,
      userId,
      type,
      timestamp: now.toISOString(),
      status: "on_time",
    };
  },

  async checkOut(userId: string): Promise<AttendanceRecord> {
    const now = new Date();
    const timeString = formatTimeShort(now);
    const type: AttendanceType = isMorning() ? "morning_out" : "afternoon_out";
    const key =
      type === "morning_out"
        ? STORAGE_KEYS.MORNING_CHECK_OUT
        : STORAGE_KEYS.AFTERNOON_CHECK_OUT;

    await StorageService.set(key, timeString);

    return {
      id: `${userId}-${type}-${now.getTime()}`,
      userId,
      type,
      timestamp: now.toISOString(),
      status: "on_time",
    };
  },

  async getTodayAttendance(): Promise<DailyAttendance> {
    try {
      const data = await StorageService.getMultiple<Record<string, string>>([
        STORAGE_KEYS.MORNING_CHECK_IN,
        STORAGE_KEYS.MORNING_CHECK_OUT,
        STORAGE_KEYS.AFTERNOON_CHECK_IN,
        STORAGE_KEYS.AFTERNOON_CHECK_OUT,
      ]);

      return {
        date: new Date().toISOString(),
        morning: {
          checkIn: data[STORAGE_KEYS.MORNING_CHECK_IN] || null,
          checkOut: data[STORAGE_KEYS.MORNING_CHECK_OUT] || null,
        },
        afternoon: {
          checkIn: data[STORAGE_KEYS.AFTERNOON_CHECK_IN] || null,
          checkOut: data[STORAGE_KEYS.AFTERNOON_CHECK_OUT] || null,
        },
      };
    } catch (error) {
      try {
        const data = await StorageService.getMultiple<Record<string, string>>([
          STORAGE_KEYS.MORNING_CHECK_IN,
          STORAGE_KEYS.MORNING_CHECK_OUT,
          STORAGE_KEYS.AFTERNOON_CHECK_IN,
          STORAGE_KEYS.AFTERNOON_CHECK_OUT,
        ]);

        return {
          date: new Date().toISOString(),
          morning: {
            checkIn: data[STORAGE_KEYS.MORNING_CHECK_IN] || null,
            checkOut: data[STORAGE_KEYS.MORNING_CHECK_OUT] || null,
          },
          afternoon: {
            checkIn: data[STORAGE_KEYS.AFTERNOON_CHECK_IN] || null,
            checkOut: data[STORAGE_KEYS.AFTERNOON_CHECK_OUT] || null,
          },
        };
      } catch {
        return {
          date: new Date().toISOString(),
          morning: { checkIn: null, checkOut: null },
          afternoon: { checkIn: null, checkOut: null },
        };
      }
    }
  },

  async clearTodayAttendance(): Promise<void> {
    await StorageService.removeMultiple([
      STORAGE_KEYS.MORNING_CHECK_IN,
      STORAGE_KEYS.MORNING_CHECK_OUT,
      STORAGE_KEYS.AFTERNOON_CHECK_IN,
      STORAGE_KEYS.AFTERNOON_CHECK_OUT,
    ]);
  },
};
