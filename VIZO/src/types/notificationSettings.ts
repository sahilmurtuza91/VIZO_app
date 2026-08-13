export interface NotificationSettings {
  newClientRequest: boolean;
  newMessage: boolean;
  reviewsRatings: boolean;
  meetingReminders: boolean;
  licenseExpiryAlerts: boolean;
  platformUpdates: boolean;
  marketingPromotions: boolean;
}

export interface NotificationSettingItem {
  id: keyof NotificationSettings;
  title: string;
}
