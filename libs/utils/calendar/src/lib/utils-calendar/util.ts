export const daysInMonth = (year: number, month: number): number => new Date(year, month, 0).getDate();

export function createDateInstance(date: Date | number | string): Date {
  return new Date(date)
}

export function createDateWithSpecifiedMonthDay(date: number, month: number, day: number): Date {
  return new Date(date, month, day)
}

export function createDateWithSpecifiedTime(date: Date, hours: number, minutes = 0): Date {
  return new Date(date.setHours(hours, minutes));
}

export function getBeginningOfDayInMilliseconds(date: Date): number {
  return new Date(createDateInstance(date).setHours(0,0,0,0)).getTime();
}