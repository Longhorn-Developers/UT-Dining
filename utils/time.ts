import { format } from 'date-fns';

import type * as schema from '~/services/database/schema';

// Types for service hours structure
interface TimeRange {
  open: number;
  close: number;
}

interface DaySchedule {
  isClosed?: boolean;
  timeRanges?: TimeRange[];
}

interface ServiceHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
  [key: string]: DaySchedule | undefined;
}

import type { MealTimes } from '~/utils/locations';

type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

// Returns weekday name, e.g., 'Monday'
const weekdayName = (date: Date): WeekDay => format(date, 'EEEE') as WeekDay;

// Returns time of day: 'morning', 'afternoon', or 'evening'
export const timeOfDay = (
  date: Date,
  mealTimes?: MealTimes,
): 'morning' | 'afternoon' | 'evening' => {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  // Convert to military time
  const currentTime = hour * 100 + minutes;

  // If mealTimes is provided, use it to determine time of day
  if (mealTimes && (mealTimes.breakfast || mealTimes.lunch || mealTimes.dinner)) {
    const breakfastEnd = mealTimes.breakfast?.closeTime ?? 1100;
    const lunchEnd = mealTimes.lunch?.closeTime ?? 1700;

    if (currentTime < breakfastEnd) return 'morning';
    if (currentTime < lunchEnd) return 'afternoon';
    return 'evening';
  }

  // Fall back to default logic if mealTimes not provided
  if (hour < 11) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

// Database-based version of getTodaySchedule
export function getTodaySchedule(locationData: schema.Location | null, date: Date = new Date()) {
  if (!locationData || !locationData.regular_service_hours) return null;

  const serviceHours = locationData.regular_service_hours as ServiceHours;
  const day = weekdayName(date).toLowerCase();
  const daySchedule = serviceHours[day];

  if (
    !daySchedule ||
    daySchedule.isClosed ||
    !daySchedule.timeRanges ||
    !Array.isArray(daySchedule.timeRanges)
  ) {
    return null;
  }

  return {
    days: [weekdayName(date)],
    intervals: daySchedule.timeRanges.map((timeRange: TimeRange) => ({
      openTime: timeRange.open,
      closeTime: timeRange.close,
    })),
  };
}

// Helper to convert HHMM number to minutes since midnight.
function convertToMinutes(time: number): number {
  const hour = Math.floor(time / 100);
  const minute = time % 100;
  return hour * 60 + minute;
}

// Database-based version of isLocationOpen
export function isLocationOpen(
  locationData: schema.Location | null,
  currentTime: Date = new Date(),
): boolean {
  if (locationData?.force_close) {
    // If the location is forced closed, return false immediately
    return false;
  }

  const schedule = getTodaySchedule(locationData, currentTime);
  if (!schedule || schedule.intervals.length === 0) return false;

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  return schedule.intervals.some((interval: { openTime: number; closeTime: number }) => {
    const openM = convertToMinutes(interval.openTime);
    const closeM = convertToMinutes(interval.closeTime);
    return currentMinutes >= openM && currentMinutes < closeM;
  });
}

// Database-based version of getLocationTimeMessage
export function getLocationTimeMessage(
  locationData: schema.Location | null,
  currentTime: Date = new Date(),
): string {
  const schedule = getTodaySchedule(locationData, currentTime);
  if (!schedule || schedule.intervals.length === 0) return 'Closed';

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Check if currently open and return closing time
  for (const { openTime, closeTime } of schedule.intervals) {
    const openM = convertToMinutes(openTime);
    const closeM = convertToMinutes(closeTime);
    if (currentMinutes >= openM && currentMinutes < closeM) {
      const diffMins = closeM - currentMinutes;
      return diffMins < 60
        ? `Open for ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'}`
        : `Open for ${Math.ceil(diffMins / 60)} ${Math.ceil(diffMins / 60) > 1 ? 'hours' : 'hour'}`;
    }
  }

  // Check for next opening time today
  const nextOpening = schedule.intervals
    .map(({ openTime }: { openTime: number }) => convertToMinutes(openTime))
    .filter((openM: number) => openM > currentMinutes)
    .sort((a: number, b: number) => a - b)[0];

  if (nextOpening !== undefined) {
    const diffMins = nextOpening - currentMinutes;
    return diffMins < 60
      ? `Opens in ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'}`
      : `Opens in ${Math.ceil(diffMins / 60)} ${Math.ceil(diffMins / 60) > 1 ? 'hours' : 'hour'}`;
  }

  // For database version, we need to check next days differently
  // Since we don't have a simple way to get next day schedules from database in this context,
  // we'll fall back to a simpler message
  return 'Closed';
}

// Helper: convert HHMM number to a formatted time string.
// It uses the provided date as a reference.
function formatTimeFromNumber(time: number, referenceDate: Date): string {
  const hour = Math.floor(time / 100);
  const minute = time % 100;
  const d = new Date(referenceDate);
  d.setHours(hour, minute, 0, 0);
  return format(d, 'hh:mm a');
}

// Mapping of full weekday names to their abbreviated forms.
const dayAbbreviations: Record<WeekDay, string> = {
  Monday: 'M',
  Tuesday: 'T',
  Wednesday: 'W',
  Thursday: 'TH',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

// Generates an array of strings representing the schedule for a given location.
// Each string is in the format "DAY-DAY: HH:MM AM - HH:MM AM/PM".
// If the days in a schedule are not contiguous, they are joined by commas.
export function generateSchedule(
  locationData: schema.Location | null,
  _todayFirst: boolean = true,
  date: Date = new Date(),
): { dayRange: string; time: string }[] {
  if (!locationData || !locationData.regular_service_hours) return [];

  const serviceHours = locationData.regular_service_hours as ServiceHours;
  const dayOrder: WeekDay[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Helper to get intervals or closed status for a day
  const getDayKey = (weekDay: WeekDay) => {
    const dayKey = weekDay.toLowerCase();
    const daySchedule = serviceHours[dayKey];
    if (
      daySchedule &&
      !daySchedule.isClosed &&
      daySchedule.timeRanges &&
      Array.isArray(daySchedule.timeRanges) &&
      daySchedule.timeRanges.length > 0
    ) {
      return JSON.stringify(daySchedule.timeRanges);
    } else {
      return 'CLOSED';
    }
  };

  // Helper to format intervals or closed
  const formatTime = (weekDay: WeekDay) => {
    const dayKey = weekDay.toLowerCase();
    const daySchedule = serviceHours[dayKey];
    if (
      daySchedule &&
      !daySchedule.isClosed &&
      daySchedule.timeRanges &&
      Array.isArray(daySchedule.timeRanges) &&
      daySchedule.timeRanges.length > 0
    ) {
      const intervals = daySchedule.timeRanges.map((interval: TimeRange) => {
        const openStr = formatTimeFromNumber(interval.open, date);
        const closeStr = formatTimeFromNumber(interval.close, date);
        return `${openStr} - ${closeStr}`;
      });
      // Group intervals in pairs, join with comma, then new line for next pair
      const lines: string[] = [];
      for (let i = 0; i < intervals.length; i += 2) {
        lines.push(intervals.slice(i, i + 2).join(', '));
      }
      return lines.join('\n');
    } else {
      return 'Closed';
    }
  };

  // Group consecutive days with the same intervals/closed status
  const result: { dayRange: string; time: string }[] = [];
  let groupStart = 0;
  let prevKey = getDayKey(dayOrder[0]);

  for (let i = 1; i <= dayOrder.length; i++) {
    // Use a sentinel string for the end of the loop
    const currentKey = i < dayOrder.length ? getDayKey(dayOrder[i]) : '__END__';
    if (currentKey !== prevKey) {
      // Group from groupStart to i-1
      const daysInGroup = dayOrder.slice(groupStart, i);
      let dayRange = '';
      if (daysInGroup.length === 1) {
        dayRange = dayAbbreviations[daysInGroup[0]];
      } else {
        dayRange = `${dayAbbreviations[daysInGroup[0]]}-${dayAbbreviations[daysInGroup[daysInGroup.length - 1]]}`;
      }
      result.push({ dayRange, time: formatTime(daysInGroup[0]) });
      groupStart = i;
      prevKey = currentKey;
    }
  }

  return result;
}
