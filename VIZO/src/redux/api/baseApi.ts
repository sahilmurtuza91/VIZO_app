import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Platform } from 'react-native';
import { RootState } from '../store';

// Dynamic Base URL
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api/v1',
  ios: 'http://localhost:8000/api/v1',
  default: 'http://10.0.2.2:8000/api/v1',
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'User',
    'Profile',
    'WorkingHours',
    'ClientRequest',
    'DailyActivity',
    'Referral',
    'Invite',
    'Ticket',
    'Notification',
    'Conversation',
    'Message',
    'ChatStats',
  ],
  endpoints: () => ({}),
});

