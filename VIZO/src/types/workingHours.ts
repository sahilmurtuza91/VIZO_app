export interface DailyWorkingHour {
  id: string;
  dayShort: string;
  dayFull: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

export type CalendarType =
  | 'Google Calendar'
  | 'Outlook Calendar'
  | 'Apple Calendar';

export interface WorkingHoursResponse {
  hours: DailyWorkingHour[];
  selectedDates: string[];
}
