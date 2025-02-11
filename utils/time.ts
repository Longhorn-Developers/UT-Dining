import { parseISO, format, addDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { LOCATION_INFO, WeekDay } from '~/data/LocationInfo';

const CENTRAL_TIME_ZONE = 'America/Chicago';

export const shouldRequery = (lastQueryTime: string | null): boolean => {
  if (!lastQueryTime) return true;
  const lastQueryDate = parseISO(lastQueryTime);
  const now = new Date();
  const nowCentral = toZonedTime(now, CENTRAL_TIME_ZONE);
  const lastQueryCentral = toZonedTime(lastQueryDate, CENTRAL_TIME_ZONE);

  // Prevent requerying before 1:10 AM CST
  if (nowCentral.getHours() === 1 && nowCentral.getMinutes() < 10) {
    return false;
  }

  const nowDate = format(nowCentral, 'yyyy-MM-dd');
  const lastQueryDateFormatted = format(lastQueryCentral, 'yyyy-MM-dd');

  return nowDate !== lastQueryDateFormatted;
};

// Returns weekday name, e.g., 'Monday'
const weekdayName = (date: Date): WeekDay => format(date, 'EEEE') as WeekDay;

// Returns today's schedule for a given location
export function getTodaySchedule(locationName: string, date: Date = new Date()) {
  const location = LOCATION_INFO.find((loc) => loc.name === locationName);
  if (!location) return null;
  // Use actual weekday name
  const day = weekdayName(date);
  return location.schedules.find((schedule) => schedule.days.includes(day)) || null;
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

// New helper that uses LOCATION_INFO for time message.
export function getLocationTimeMessage(
  locationName: string,
  currentTime: Date = new Date()
): string {
  const schedule = getTodaySchedule(locationName, currentTime);
  if (!schedule) return 'Closed.';

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // If currently open in one of the intervals, show closing message.
  for (const interval of schedule.intervals) {
    const openM = convertToMinutes(interval.openTime);
    const closeM = convertToMinutes(interval.closeTime);
    if (currentMinutes >= openM && currentMinutes < closeM) {
      const diffMins = closeM - currentMinutes;
      if (diffMins < 60) {
        return `Closes in ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'}`;
      }
      const hoursDiff = Math.ceil(diffMins / 60);
      return `Closes in ${hoursDiff} ${hoursDiff > 1 ? 'hours' : 'hour'}`;
    }
  }

  // Not open – find the next opening time.
  const upcoming = schedule.intervals
    .map((interval) => convertToMinutes(interval.openTime))
    .filter((openM) => openM > currentMinutes)
    .sort((a, b) => a - b);

  if (upcoming.length > 0) {
    const diffMins = upcoming[0] - currentMinutes;
    if (diffMins < 60) {
      return `Opens in ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'}`;
    }
    const hoursDiff = Math.ceil(diffMins / 60);
    return `Opens in ${hoursDiff} ${hoursDiff > 1 ? 'hours' : 'hour'}`;
  } else {
    // No more intervals today, find the next opening day (tomorrow or later)
    let dayOffset = 1;
    let nextOpeningMinutes: number | null = null;
    while (dayOffset <= 7) {
      const nextDate = addDays(currentTime, dayOffset);
      const nextSchedule = getTodaySchedule(locationName, nextDate);

      if (nextSchedule && nextSchedule.intervals.length === 0) {
        console.log('No intervals found for', weekdayName(nextDate));
        break;
      }

      if (nextSchedule && nextSchedule.intervals.length > 0) {
        nextOpeningMinutes = convertToMinutes(nextSchedule.intervals[0].openTime);
        break;
      }
      dayOffset++;
    }

    if (nextOpeningMinutes === null) {
      // No opening found in the next week.
      return 'Closed.';
    }

    // Calculate time difference from currentTime until the next opening.
    const currentDayMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const diffMins = dayOffset * 24 * 60 - currentDayMinutes + nextOpeningMinutes;
    if (diffMins < 60) {
      return `Opens in ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'}`;
    }
    const hoursDiff = Math.ceil(diffMins / 60);
    if (hoursDiff >= 24) {
      const days = Math.ceil(hoursDiff / 24);
      return `Opens in ${days} ${days > 1 ? 'days' : 'day'}`;
    } else {
      return `Opens in ${hoursDiff} ${hoursDiff > 1 ? 'hours' : 'hour'}`;
    }
  }
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
  Friday: 'F',
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
