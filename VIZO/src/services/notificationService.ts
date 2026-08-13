import { NotificationItems } from '../types/notification';

let Notification: NotificationItems[] = [
  {
    id: 'notif_1',
    senderName: 'William John',
    senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    message: 'Just messaged you. Check the message in message tab.',
    timestamp: '10 mins ago',
    isRead: false,
    section: 'Today',
    targetScreen: 'ChatScreen',
  },
  {
    id: 'notif_2',
    senderName: 'Emmett Perry',
    senderImage: 'https://randomuser.me/api/portraits/men/45.jpg',
    message: 'Just giving 5 Star review on your listing Fairview Apartment',
    timestamp: '40 mins ago',
    isRead: false,
    section: 'Today',
    targetScreen: 'ReviewDetailsScreen',
  },
  {
    id: 'notif_3',
    senderName: 'Velma Cole',
    senderImage: 'https://randomuser.me/api/portraits/women/68.jpg',
    message: 'Just buy your listing Schoolview House',
    timestamp: '4 hours ago',
    isRead: true,
    section: 'Older notifications',
    targetScreen: 'PropertyDetailsScreen',
  },
  {
    id: 'notif_4',
    senderName: 'Julia James',
    senderImage: 'https://randomuser.me/api/portraits/women/21.jpg',
    message: 'Just favorited your listing Schoolview House',
    timestamp: '2 Days ago',
    isRead: true,
    section: 'Older notifications',
    targetScreen: 'PropertyDetailsScreen',
  },
];

export const notificationService = {
  getAllNotification: async (): Promise<NotificationItems[]> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    return [...Notification];
  },

  markReadAllNotification: async (): Promise<NotificationItems[]> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 200);
    });

    Notification = Notification.map(item => ({
      ...item,
      isRead: true,
    }));
    return [...Notification];
  },

  markSingleRead: async (id: string): Promise<NotificationItems[]> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 200);
    });

    Notification = Notification.map(item =>
      item.id === id ? { ...item, isRead: true } : item,
    );
    return [...Notification];
  },
};
