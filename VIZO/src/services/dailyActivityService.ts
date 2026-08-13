import { Activity } from 'react';
import {
  DailyActivityItem,
  CreateActivityPayload,
} from '../types/dailyActivity';

let Activities: DailyActivityItem[] = [
  {
    id: 'act_1',
    category: 'Property Handling',
    status: 'Ongoing',
    title: 'Preparing documents for property viewing',
    clientName: 'Sarah Williams',
    propertyRef: 'PROP-2024-001',
    date: 'May 14, 2026',
    updatedTime: '15:55',
  },
  {
    id: 'act_2',
    category: 'Client Meeting',
    status: 'Ongoing',
    title: 'Initial consultation for commercial property sale',
    clientName: 'Michael Chen',
    propertyRef: 'PROP-2024-002',
    date: 'May 15, 2026',
    updatedTime: '15:00',
  },
  {
    id: 'act_3',
    category: 'Follow Up',
    status: 'Ongoing',
    title: 'Follow-up regarding apartment rental agreement',
    clientName: 'Emma Thompson',
    propertyRef: 'PROP-2024-003',
    date: 'May 16, 2026',
    updatedTime: '16:45',
  },
  {
    id: 'act_4',
    category: 'Property Handling',
    status: 'Completed',
    title: 'Property inspection documents completed',
    clientName: 'David Miller',
    propertyRef: 'PROP-2024-004',
    date: 'May 17, 2026',
    updatedTime: '11:30',
  },
  {
    id: 'act_5',
    category: 'Client Meeting',
    status: 'Completed',
    title: 'Met client to discuss villa purchase options',
    clientName: 'Sophia Brown',
    propertyRef: 'PROP-2024-005',
    date: 'May 18, 2026',
    updatedTime: '13:20',
  },
  {
    id: 'act_6',
    category: 'Follow Up',
    status: 'Completed',
    title: 'Confirmed payment details with the client',
    clientName: 'James Anderson',
    propertyRef: 'PROP-2024-006',
    date: 'May 19, 2026',
    updatedTime: '09:45',
  },
  {
    id: 'act_7',
    category: 'Property Handling',
    status: 'Ongoing',
    title: 'Collecting ownership verification documents',
    clientName: 'Olivia Taylor',
    propertyRef: 'PROP-2024-007',
    date: 'May 20, 2026',
    updatedTime: '10:40',
  },
  {
    id: 'act_8',
    category: 'Client Meeting',
    status: 'Ongoing',
    title: 'Meeting scheduled for luxury apartment viewing',
    clientName: 'William Harris',
    propertyRef: 'PROP-2024-008',
    date: 'May 20, 2026',
    updatedTime: '14:15',
  },
  {
    id: 'act_9',
    category: 'Follow Up',
    status: 'Ongoing',
    title: 'Requested additional KYC documents from client',
    clientName: 'Isabella Moore',
    propertyRef: 'PROP-2024-009',
    date: 'May 21, 2026',
    updatedTime: '12:10',
  },
  {
    id: 'act_10',
    category: 'Property Handling',
    status: 'Completed',
    title: 'Property registration process completed',
    clientName: 'Benjamin Clark',
    propertyRef: 'PROP-2024-010',
    date: 'May 22, 2026',
    updatedTime: '17:30',
  },
  {
    id: 'act_11',
    category: 'Client Meeting',
    status: 'Completed',
    title: 'Final meeting before agreement signing',
    clientName: 'Charlotte White',
    propertyRef: 'PROP-2024-011',
    date: 'May 23, 2026',
    updatedTime: '11:50',
  },
  {
    id: 'act_12',
    category: 'Follow Up',
    status: 'Completed',
    title: 'Received confirmation from buyer',
    clientName: 'Daniel Walker',
    propertyRef: 'PROP-2024-012',
    date: 'May 24, 2026',
    updatedTime: '16:05',
  },
];

export const dailyActivityService = {
  getAllActivity: async (): Promise<DailyActivityItem[]> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    return [...Activities];
  },

  createActivity: async (
    payload: CreateActivityPayload,
  ): Promise<DailyActivityItem> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 500);
    });

    const newActivity: DailyActivityItem = {
      id: `act_${Date.now()}`,
      category: payload.category,
      title: payload.title,
      clientName: payload.clientName,
      propertyRef: payload.propertyRef,
      date: payload.data,
      updatedTime: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      status: 'Ongoing',
    };

    Activities.unshift(newActivity);
    return newActivity;
  },

  updateActivity: async (
    id: string,
    payload: Partial<CreateActivityPayload>,
  ): Promise<boolean> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
    Activities = Activities.map(act => {
      if (act.id === id) {
        return {
          ...act,
          ...payload,
          updatedTime: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
        };
      }
      return act;
    });
    return true;
  },

  toggleCompleteStatus: async (id: string): Promise<boolean> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    Activities = Activities.map(act => {
      if (act.id === id) {
        return {
          ...act,
          status: act.status === 'Ongoing' ? 'Completed' : 'Ongoing',
        };
      }
      return act;
    });
    return true;
  },

  deleteActivity: async (id: string): Promise<boolean> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    Activities = Activities.filter(act => act.id !== id);
    return true;
  },
};
