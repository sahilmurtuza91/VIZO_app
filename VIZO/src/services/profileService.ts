import { UserProfile } from '../types/profile';

let profile: UserProfile = {
  id: 'usr_001',
  name: 'William John',
  rating: 4.9,
  specialties: ['Luxury', 'Residential', 'Flats'],
  experience: 8,
  profileCompletePercentage: 85,
  isOnline: true,
  avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
  bio: 'Trusted property agent with 8+ years of excellence in real estate.',
  phoneNumber: '567 886 245',
  countryCode: '+1',
  email: 'admin@gmail.com',
  language: ['English', 'Spanish'],
  licenseNumber: 'RE-2024-12345',
  isLicenseVerified: true,
};

export const profileService = {
  getUserProfile: async (): Promise<UserProfile> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 500);
    });

    return { ...profile };
  },

  toggleOnlineOfflineStatus: async (status: boolean): Promise<boolean> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
    profile.isOnline = status;
    return true;
  },

  updateProfile: async (
    updateData: Partial<UserProfile>,
  ): Promise<UserProfile> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    profile = { ...profile, ...updateData };
    return { ...profile };
  },
};
