export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatTimeShort = (date: Date): string => {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isTimeString = (time: string): boolean => {
  return /^\d{2}:\d{2}(:\d{2})?$/.test(time);
};

export const getCurrentHour = (): number => {
  return new Date().getHours();
};

export const isMorning = (): boolean => {
  const hour = getCurrentHour();
  return hour >= 0 && hour < 13;
};

export const isAfternoon = (): boolean => {
  const hour = getCurrentHour();
  return hour >= 13 && hour < 24;
};

export const getTimeOfDay = (): "morning" | "afternoon" => {
  return isMorning() ? "morning" : "afternoon";
};

export const parseTimeString = (timeString: string): Date | null => {
  if (!isTimeString(timeString)) {
    return null;
  }

  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const getDayName = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", { weekday: "long" });
};

export const getMonthYear = (date: Date = new Date()): string => {
  return date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};

export const getWeekRange = (
  date: Date = new Date(),
): { start: Date; end: Date } => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const start = new Date(date.setDate(diff));
  const end = addDays(start, 6);

  return { start, end };
};

export const getMonthRange = (
  date: Date = new Date(),
): { start: Date; end: Date } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return { start, end };
};
