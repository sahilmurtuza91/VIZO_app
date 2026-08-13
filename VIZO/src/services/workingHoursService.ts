import { DailyWorkingHour, WorkingHoursResponse } from '../types/workingHours';

let workingHoursData: DailyWorkingHour[] = [
  {
    id: '1',
    dayShort: 'S',
    dayFull: 'Sunday',
    isAvailable: false,
    startTime: '',
    endTime: '',
  },
  {
    id: '2',
    dayShort: 'M',
    dayFull: 'Monday',
    isAvailable: true,
    startTime: '9:00 AM',
    endTime: '9:00 PM',
  },
  {
    id: '3',
    dayShort: 'T',
    dayFull: 'Tuesday',
    isAvailable: true,
    startTime: '9:00 AM',
    endTime: '9:00 PM',
  },
  {
    id: '4',
    dayShort: 'W',
    dayFull: 'Wednesday',
    isAvailable: true,
    startTime: '9:00 AM',
    endTime: '9:00 PM',
  },
  {
    id: '5',
    dayShort: 'T',
    dayFull: 'Thursday',
    isAvailable: true,
    startTime: '9:00 AM',
    endTime: '9:00 PM',
  },
  {
    id: '6',
    dayShort: 'F',
    dayFull: 'Friday',
    isAvailable: true,
    startTime: '9:00 AM',
    endTime: '5:00 PM',
  },
  {
    id: '7',
    dayShort: 'S',
    dayFull: 'Saturday',
    isAvailable: false,
    startTime: '',
    endTime: '',
  },
];

let selectedDateList: string[] = [
  '2026-12-11',
  '2026-12-12',
  '2026-12-13',
  '2026-12-17',
  '2026-12-18',
  '2026-12-19',
  '2026-12-20',
  '2026-12-24',
  '2026-12-25',
  '2026-12-26',
];

export const workingHoursService = {
  getWorkingHoursData: async (): Promise<WorkingHoursResponse> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    return {
      hours: [...workingHoursData],
      selectedDates: [...selectedDateList],
    };
  },

  saveWorkingHours: async (
    hours: DailyWorkingHour[],
    dates: string[],
  ): Promise<boolean> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    workingHoursData = [...hours];
    selectedDateList = [...dates];
    return true;
  },
};
