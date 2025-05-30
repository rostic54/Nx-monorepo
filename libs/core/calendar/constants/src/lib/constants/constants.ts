import {
  MonthName,
  PromptTopic,
  WeekDays,
} from '@angular-monorepo/enums-calendar';

export const monthList = [
  MonthName.January,
  MonthName.February,
  MonthName.March,
  MonthName.April,
  MonthName.May,
  MonthName.June,
  MonthName.July,
  MonthName.August,
  MonthName.September,
  MonthName.October,
  MonthName.November,
  MonthName.December,
];

export const weekDays = [
  WeekDays.Monday,
  WeekDays.Tuesday,
  WeekDays.Wednesday,
  WeekDays.Thursday,
  WeekDays.Friday,
  WeekDays.Saturday,
  WeekDays.Sunday,
];

export const DAYS_IN_MONTH_VIEW = 42;
export const HOURS_IN_DAY = 24;

export const topicOptions = [
  PromptTopic.BUSINESS,
  PromptTopic.FINANCE,
  PromptTopic.INVESTMENT,
  PromptTopic.SPORT,
  PromptTopic.TRAVEL,
];
