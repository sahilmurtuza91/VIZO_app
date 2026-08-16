export interface NotificationItems {
  id: string;
  senderName: string;
  senderImage: any;
  message: string;
  timestamp: string;
  isRead: boolean;
  section: 'Today' | 'Older notifications';
  targetScreen?: string;
  targetId?: string;
}