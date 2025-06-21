import { parseISO, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { LocationInfo, WeekDay } from '~/data/LocationInfo';
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

// Database-based version of isLocationOpen
export function isLocationOpenFromData(
  locationData: schema.Location | null,
  currentTime: Date = new Date()
): boolean {
  if (locationData?.force_close) {
    // If the location is forced closed, return false immediately
    return false;
  }

  const schedule = getTodayScheduleFromData(locationData, currentTime);
  if (!schedule || schedule.intervals.length === 0) return false;

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  return schedule.intervals.some((interval: { openTime: number; closeTime: number }) => {
    const openM = convertToMinutes(interval.openTime);
    const closeM = convertToMinutes(interval.closeTime);
    return currentMinutes >= openM && currentMinutes < closeM;
  });
}

// Database-based version of getLocationTimeMessage
export function getLocationTimeMessageFromData(
  locationData: schema.Location | null,
  currentTime: Date = new Date()
): string {
  const schedule = getTodayScheduleFromData(locationData, currentTime);
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
    let daysSorted: WeekDay[];

    if (todayFirst && days.includes(currentWeekDay)) {
      // Sort chronologically starting from current day
      const currentDayIndex = weekOrder[currentWeekDay];
      daysSorted = [...days].sort((a, b) => {
        const aIndex = weekOrder[a];
        const bIndex = weekOrder[b];

        // Calculate days from current day (0 = today, 1 = tomorrow, etc.)
        const getDaysFromToday = (dayIndex: number) => {
          if (dayIndex >= currentDayIndex) {
            return dayIndex - currentDayIndex;
          } else {
            return 7 - currentDayIndex + dayIndex;
          }
        };

        return getDaysFromToday(aIndex) - getDaysFromToday(bIndex);
      });
    } else {
      // Sort days in standard week order (Monday-Sunday)
      daysSorted = [...days].sort((a, b) => weekOrder[a] - weekOrder[b]);
    }

    let dayRange = '';
    if (daysSorted.length > 1) {
      if (todayFirst && days.includes(currentWeekDay)) {
        // For chronological ordering, check if days are consecutive in chronological order
        const isChronologicallyContiguous = daysSorted.every((day, index) => {
          if (index === 0) return true;
          const prevIndex = weekOrder[daysSorted[index - 1]];
          const currIndex = weekOrder[day];
          // Check if current day is next day after previous (with week wraparound)
          return currIndex === (prevIndex % 7) + 1;
        });

        if (isChronologicallyContiguous) {
          dayRange = `${dayAbbreviations[daysSorted[0]]}-${dayAbbreviations[daysSorted[daysSorted.length - 1]]}`;
        } else {
          dayRange = daysSorted.map((d) => dayAbbreviations[d]).join(', ');
        }
      } else {
        // Standard week order contiguity check
        if (
          weekOrder[daysSorted[daysSorted.length - 1]] - weekOrder[daysSorted[0]] ===
          daysSorted.length - 1
        ) {
          dayRange = `${dayAbbreviations[daysSorted[0]]}-${dayAbbreviations[daysSorted[daysSorted.length - 1]]}`;
        } else {
          dayRange = daysSorted.map((d) => dayAbbreviations[d]).join(', ');
        }
      }
    } else {
      // Single day
      dayRange = dayAbbreviations[daysSorted[0]];
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

  // Define day order to ensure consistent processing
  const dayOrder: WeekDay[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Convert new database format to our schedule format
  // Format: {"monday": {"isClosed": false, "timeRanges": [{"open": 1030, "close": 2100}]}}
  // Process days in order to ensure consistent grouping
  dayOrder.forEach((weekDay) => {
    const dayKey = weekDay.toLowerCase();
    const daySchedule = serviceHours[dayKey];

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
        existingGroup.days.push(weekDay);
      } else {
        scheduleGroups.push({
          days: [weekDay],
          intervals,
        });
      }
    } else {
      // Closed day - group with other closed days
      const closedGroup = scheduleGroups.find((group) => group.intervals.length === 0);
      if (closedGroup) {
        closedGroup.days.push(weekDay);
      } else {
        scheduleGroups.push({
          days: [weekDay],
          intervals: [],
        });
      }
    }
  });

  if (todayFirst) {
    // When todayFirst is true, process days individually in chronological order
    const currentDayIndex = weekOrder[currentWeekDay];

    // Create chronologically ordered day list starting from today
    const chronologicalDays: WeekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const dayIndex = ((currentDayIndex - 1 + i) % 7) + 1;
      const day = Object.keys(weekOrder).find(
        (d) => weekOrder[d as WeekDay] === dayIndex
      ) as WeekDay;
      chronologicalDays.push(day);
    }

    // Create a map to track intervals for each day
    const dayIntervals = new Map<WeekDay, { openTime: number; closeTime: number }[]>();

    chronologicalDays.forEach((weekDay) => {
      const dayKey = weekDay.toLowerCase();
      const daySchedule = serviceHours[dayKey];

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
        dayIntervals.set(weekDay, intervals);
      } else {
        dayIntervals.set(weekDay, []);
      }
    });

    // Now group consecutive days with same intervals
    type ScheduleGroup = {
      days: WeekDay[];
      intervals: { openTime: number; closeTime: number }[];
    };

    let currentGroup: ScheduleGroup | null = null;

    chronologicalDays.forEach((weekDay) => {
      const intervals = dayIntervals.get(weekDay) || [];

      if (currentGroup && JSON.stringify(currentGroup.intervals) === JSON.stringify(intervals)) {
        // Same schedule as current group, add to it
        currentGroup.days.push(weekDay);
      } else {
        // Different schedule, finalize current group and start new one
        if (currentGroup) {
          result.push(formatSchedule(currentGroup.days, currentGroup.intervals));
        }
        currentGroup = {
          days: [weekDay],
          intervals,
        };
      }
    });

    // Don't forget the last group
    if (currentGroup) {
      // @ts-expect-error - just to satisfy TypeScript, we know currentGroup is defined here
      result.push(formatSchedule(currentGroup.days, currentGroup.intervals));
    }
  } else {
    // Use original grouping logic for non-todayFirst case
    scheduleGroups.forEach((group) => result.push(formatSchedule(group.days, group.intervals)));
  }

  return result;
}
