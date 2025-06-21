import { parseISO, format, addDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { LOCATION_INFO, LocationInfo, WeekDay } from '~/data/LocationInfo';
import * as schema from '~/db/schema';
import { miscStorage } from '~/store/misc-storage';

const CENTRAL_TIME_ZONE = 'America/Chicago';

// Helper to determine if a requery is needed based on the last query time.
export const shouldRequery = async (): Promise<boolean> => {
  const lastQueryTime = miscStorage.getString('lastQueryTime');
  if (!lastQueryTime) return true;
  const lastQueryDate = parseISO(lastQueryTime);
  const now = new Date();
  const nowCentral = toZonedTime(now, CENTRAL_TIME_ZONE);
  const lastQueryCentral = toZonedTime(lastQueryDate, CENTRAL_TIME_ZONE);

  // Prevent requerying before 3:00 AM CST
  if (nowCentral.getHours() < 3) {
    return false;
  }

  const nowDate = format(nowCentral, 'yyyy-MM-dd');
  const lastQueryDateFormatted = format(lastQueryCentral, 'yyyy-MM-dd');

  return nowDate !== lastQueryDateFormatted;
};

// Returns weekday name, e.g., 'Monday'
const weekdayName = (date: Date): WeekDay => format(date, 'EEEE') as WeekDay;

// Returns time of day: 'morning', 'afternoon', or 'evening'
export const timeOfDay = (
  date: Date,
  mealTimes?: LocationInfo['mealTimes']
): 'morning' | 'afternoon' | 'evening' => {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  // Convert to military time
  const currentTime = hour * 100 + minutes;

  // If mealTimes is provided, use it to determine time of day
  if (mealTimes) {
    const breakfastEnd = mealTimes.breakfast?.closeTime ? mealTimes.breakfast.closeTime : 1100;
    const lunchEnd = mealTimes.lunch?.closeTime ? mealTimes.lunch.closeTime : 1700;

    if (currentTime < breakfastEnd) return 'morning';
    if (currentTime < lunchEnd) return 'afternoon';
    return 'evening';
  }

  // Fall back to default logic if mealTimes not provided
  if (hour < 11) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

// Returns today's schedule for a given location
export function getTodaySchedule(locationName: string, date: Date = new Date()) {
  const location = LOCATION_INFO.find((loc) => loc.name === locationName);
  if (!location) return null;
  // Use actual weekday name
  const day = weekdayName(date);
  return location.schedules.find((schedule) => schedule.days.includes(day)) || null;
}

// Database-based version of getTodaySchedule
export function getTodayScheduleFromData(
  locationData: schema.Location | null,
  date: Date = new Date()
) {
  if (!locationData || !locationData.regular_service_hours) return null;

  const serviceHours = locationData.regular_service_hours as any;
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
    intervals: daySchedule.timeRanges.map((timeRange: any) => ({
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

// Determines open status using a location's schedule from LOCATION_INFO.
export function isLocationOpen(locationName: string, currentTime: Date = new Date()): boolean {
  const schedule = getTodaySchedule(locationName, currentTime);
  if (!schedule || schedule.intervals.length === 0) return false;
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  return schedule.intervals.some((interval) => {
    const openM = convertToMinutes(interval.openTime);
    const closeM = convertToMinutes(interval.closeTime);
    return currentMinutes >= openM && currentMinutes < closeM;
  });
}

// Database-based version of isLocationOpen
export function isLocationOpenFromData(
  locationData: schema.Location | null,
  currentTime: Date = new Date()
): boolean {
  const schedule = getTodayScheduleFromData(locationData, currentTime);
  if (!schedule || schedule.intervals.length === 0) return false;

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  return schedule.intervals.some((interval: { openTime: number; closeTime: number }) => {
    const openM = convertToMinutes(interval.openTime);
    const closeM = convertToMinutes(interval.closeTime);
    return currentMinutes >= openM && currentMinutes < closeM;
  });
}

// New helper that uses LOCATION_INFO for time message.
export function getLocationTimeMessage(
  locationName: string,
  currentTime: Date = new Date()
): string {
  const schedule = getTodaySchedule(locationName, currentTime);
  if (!schedule || schedule.intervals.length === 0) return 'Closed';

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Check if currently open and return closing time
  for (const { openTime, closeTime } of schedule.intervals) {
    const openM = convertToMinutes(openTime);
    const closeM = convertToMinutes(closeTime);
    if (currentMinutes >= openM && currentMinutes < closeM) {
      const diffMins = closeM - currentMinutes;
      return diffMins < 60
        ? `Closes in ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'}`
        : `Closes in ${Math.ceil(diffMins / 60)} ${Math.ceil(diffMins / 60) > 1 ? 'hours' : 'hour'}`;
    }
  }

  // Check for next opening time today
  const nextOpening = schedule.intervals
    .map(({ openTime }) => convertToMinutes(openTime))
    .filter((openM) => openM > currentMinutes)
    .sort((a, b) => a - b)[0];

  if (nextOpening !== undefined) {
    const diffMins = nextOpening - currentMinutes;
    return diffMins < 60
      ? `Opens in ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'}`
      : `Opens in ${Math.ceil(diffMins / 60)} ${Math.ceil(diffMins / 60) > 1 ? 'hours' : 'hour'}`;
  }

  // Find the next open day
  let dayOffset = 1;
  while (dayOffset <= 7) {
    const nextDate = addDays(currentTime, dayOffset);
    const nextSchedule = getTodaySchedule(locationName, nextDate);
    if (nextSchedule && nextSchedule.intervals.length > 0) {
      const nextOpeningMins = convertToMinutes(nextSchedule.intervals[0].openTime);
      const totalDiffMins = dayOffset * 24 * 60 - currentMinutes + nextOpeningMins;
      return totalDiffMins >= 1440
        ? `Opens in ${Math.ceil(totalDiffMins / 1440)} ${Math.ceil(totalDiffMins / 1440) > 1 ? 'days' : 'day'}`
        : `Opens in ${Math.ceil(totalDiffMins / 60)} ${Math.ceil(totalDiffMins / 60) > 1 ? 'hours' : 'hour'}`;
    }
    dayOffset++;
  }

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

// Order value for each weekday to check contiguity.
const weekOrder: Record<WeekDay, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

// Generates an array of strings representing the schedule for a given location.
// Each string is in the format "DAY-DAY: HH:MM AM - HH:MM AM/PM".
// If the days in a schedule are not contiguous, they are joined by commas.
export function generateSchedule(
  locationName: string,
  todayFirst: boolean = true,
  date: Date = new Date()
): { dayRange: string; time: string }[] {
  const location = LOCATION_INFO.find((loc) => loc.name === locationName);
  if (!location) return [];

  const currentWeekDay = weekdayName(date);

  // Helper to format one schedule block and return an object.
  const formatSchedule = (
    schedule: (typeof location.schedules)[number]
  ): { dayRange: string; time: string } => {
    // Sort days in week order.
    const daysSorted = [...schedule.days].sort((a, b) => weekOrder[a] - weekOrder[b]);

    let dayRange = '';
    if (
      daysSorted.length > 1 &&
      weekOrder[daysSorted[daysSorted.length - 1]] - weekOrder[daysSorted[0]] ===
        daysSorted.length - 1
    ) {
      // Contiguous range, e.g., Monday through Thursday.
      dayRange = `${dayAbbreviations[daysSorted[0]]}-${dayAbbreviations[daysSorted[daysSorted.length - 1]]}`;
    } else {
      // Not contiguous – join using commas.
      dayRange = daysSorted.map((d) => dayAbbreviations[d]).join(', ');
    }

    let time = '';
    if (schedule.intervals.length === 0) {
      time = 'CLOSED';
    } else {
      // Format each interval.
      time = schedule.intervals
        .map((interval) => {
          const openStr = formatTimeFromNumber(interval.openTime, date);
          const closeStr = formatTimeFromNumber(interval.closeTime, date);
          return `${openStr} - ${closeStr}`;
        })
        .join(', ');
    }

    return { dayRange, time };
  };

  const result: { dayRange: string; time: string }[] = [];

  if (todayFirst) {
    // Include all schedule blocks, but put today's schedule first.
    const todaySchedules = location.schedules.filter((schedule) =>
      schedule.days.includes(currentWeekDay)
    );
    const otherSchedules = location.schedules.filter(
      (schedule) => !schedule.days.includes(currentWeekDay)
    );
    todaySchedules.forEach((schedule) => result.push(formatSchedule(schedule)));
    otherSchedules.forEach((schedule) => result.push(formatSchedule(schedule)));
  } else {
    // Use original order from LOCATION_INFO.
    location.schedules.forEach((schedule) => result.push(formatSchedule(schedule)));
  }

  return result;
}

// Database-based version of generateSchedule
export function generateScheduleFromData(
  locationData: schema.Location | null,
  todayFirst: boolean = true,
  date: Date = new Date()
): { dayRange: string; time: string }[] {
  if (!locationData || !locationData.regular_service_hours) return [];

  const serviceHours = locationData.regular_service_hours as any;
  const currentWeekDay = weekdayName(date);

  // Helper to format one schedule block and return an object.
  const formatSchedule = (
    days: WeekDay[],
    intervals: { openTime: number; closeTime: number }[]
  ): { dayRange: string; time: string } => {
    // Sort days in week order.
    const daysSorted = [...days].sort((a, b) => weekOrder[a] - weekOrder[b]);

    let dayRange = '';
    if (
      daysSorted.length > 1 &&
      weekOrder[daysSorted[daysSorted.length - 1]] - weekOrder[daysSorted[0]] ===
        daysSorted.length - 1
    ) {
      // Contiguous range, e.g., Monday through Thursday.
      dayRange = `${dayAbbreviations[daysSorted[0]]}-${dayAbbreviations[daysSorted[daysSorted.length - 1]]}`;
    } else {
      // Not contiguous – join using commas.
      dayRange = daysSorted.map((d) => dayAbbreviations[d]).join(', ');
    }

    let time = '';
    if (intervals.length === 0) {
      time = 'CLOSED';
    } else {
      // Format each interval.
      time = intervals
        .map((interval) => {
          const openStr = formatTimeFromNumber(interval.openTime, date);
          const closeStr = formatTimeFromNumber(interval.closeTime, date);
          return `${openStr} - ${closeStr}`;
        })
        .join(', ');
    }

    return { dayRange, time };
  };

  const result: { dayRange: string; time: string }[] = [];

  // Parse service hours and group by schedule pattern
  const scheduleGroups: {
    days: WeekDay[];
    intervals: { openTime: number; closeTime: number }[];
  }[] = [];

  // Convert new database format to our schedule format
  // Format: {"monday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 2100}]}}
  Object.entries(serviceHours).forEach(([day, daySchedule]: [string, any]) => {
    const capitalizedDay = (day.charAt(0).toUpperCase() + day.slice(1)) as WeekDay;

    if (
      daySchedule &&
      !daySchedule.isClosed &&
      daySchedule.timeRanges &&
      Array.isArray(daySchedule.timeRanges) &&
      daySchedule.timeRanges.length > 0
    ) {
      const intervals = daySchedule.timeRanges.map((timeRange: any) => ({
        openTime: timeRange.open,
        closeTime: timeRange.close,
      }));

      // Find existing group with same intervals or create new one
      const existingGroup = scheduleGroups.find(
        (group) => JSON.stringify(group.intervals) === JSON.stringify(intervals)
      );

      if (existingGroup) {
        existingGroup.days.push(capitalizedDay);
      } else {
        scheduleGroups.push({
          days: [capitalizedDay],
          intervals,
        });
      }
    } else {
      // Closed day - group with other closed days
      const closedGroup = scheduleGroups.find((group) => group.intervals.length === 0);
      if (closedGroup) {
        closedGroup.days.push(capitalizedDay);
      } else {
        scheduleGroups.push({
          days: [capitalizedDay],
          intervals: [],
        });
      }
    }
  });

  if (todayFirst) {
    // Include all schedule blocks, but put today's schedule first.
    const todaySchedules = scheduleGroups.filter((group) => group.days.includes(currentWeekDay));
    const otherSchedules = scheduleGroups.filter((group) => !group.days.includes(currentWeekDay));
    todaySchedules.forEach((group) => result.push(formatSchedule(group.days, group.intervals)));
    otherSchedules.forEach((group) => result.push(formatSchedule(group.days, group.intervals)));
  } else {
    // Use original order from database.
    scheduleGroups.forEach((group) => result.push(formatSchedule(group.days, group.intervals)));
  }

  return result;
}
