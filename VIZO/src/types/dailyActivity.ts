export type ActivityStatus = 'Ongoing' | 'Completed';
export type ActivityCategory =
  | 'Property Handling'
  | 'Client Meeting'
  | 'Follow Up';

export interface DailyActivityItem {
  id: string;
  title: string;
  clientName?: string;
  propertyRef?: string;
  date: string;
  updatedTime: string;
  category: ActivityCategory;
  status: ActivityStatus;
}

export interface CreateActivityPayload {
  category: ActivityCategory;
  title: string;
  clientName: string;
  propertyRef: string;
  data: string;
}
