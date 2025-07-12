import { format, addDays, subDays, startOfDay, isToday, isSameDay } from 'date-fns';

export function formatDateForDisplay(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }

  const yesterday = subDays(new Date(), 1);
  const tomorrow = addDays(new Date(), 1);

  if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }

  if (isSameDay(date, tomorrow)) {
    return 'Tomorrow';
  }

  return format(date, 'MMM d');
}

export function formatDateForAPI(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getCentralTimeDate() {
  const now = new Date();
  const centralTimeOffset = -6; // Central Time Zone offset
  return new Date(now.getTime() + centralTimeOffset * 60 * 60 * 1000);
}

export function getTodayInCentralTime(): string {
  const centralTime = getCentralTimeDate();
  return formatDateForAPI(centralTime);
}

export function addDaysToDate(date: Date, days: number): Date {
  return startOfDay(addDays(date, days));
}

export function subtractDaysFromDate(date: Date, days: number): Date {
  return startOfDay(subDays(date, days));
}

export function parseDateString(dateString: string): Date {
  return new Date(dateString);
}

export function isDateToday(date: Date): boolean {
  return isToday(date);
}

export function createDateFromString(dateString: string): Date {
  // Parse the date string safely to avoid timezone issues
  // dateString is expected to be in YYYY-MM-DD format
  const [year, month, day] = dateString.split('-').map(Number);
  // Create date in local timezone (month is 0-indexed)
  const date = new Date(year, month - 1, day);
  return startOfDay(date);
}
