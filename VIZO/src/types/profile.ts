export type SpecialtyTag = 'Luxury' | 'Residential' | 'Flats';

export interface UserProfile {
    id: string;
    name: string;
    rating: number;
    specialties: SpecialtyTag[];
    experience: number;
    profileCompletePercentage: number;
    isOnline: boolean;
    avatarUrl: string;
    bio: string;
    phoneNumber:string;
    countryCode: string;
    email: string;
    language: string[];
    licenseNumber: string;
    isLicenseVerified: boolean;
}