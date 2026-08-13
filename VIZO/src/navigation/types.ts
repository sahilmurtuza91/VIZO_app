import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  SplashIntro: undefined;
  LoginScreen: undefined;
  ForgotPassword: undefined;
  OtpVerification: {
    target: string;
    type: "email" | "phone";
    flowType: "signup" | "forgot_password" | "phone_login";
    password?: string;
    countryCode?: string;
    referralCode?: string;
    rememberMe?: boolean;
  };
  SetPassword: {
    email: string;
  };
  SignUp: undefined;
  ProfileSetup: undefined;
  Dashboard: undefined;

  ClientDetail: { clientData: any };
  PropertyRequirements: { clientData: any };

  ChatDetailScreen: { clientData: any };

  DailyActivitiesScreen: undefined;
  SubscriptionPlansScreen: undefined;
  HelpCenterScreen: undefined;
  SettingScreen: undefined;
  RefralScreen: undefined;
  PlatformSettingScreen: undefined;
  EditProfileScreen: undefined;
  ProfileDetailsScreen: undefined;

  HelpAndSupportScreen: undefined;
  MyTicketsScreen: undefined;
  NotificationManagementScreen: undefined;
  FAQScreen: undefined;
  TermsAndConditionsScreen: undefined;
  PrivacyPoliciesScreen: undefined;
  ChangePasswordScreen: undefined;
  NotificationsScreen: undefined;
  ReferralProgramScreen: undefined;
  CreateReferralScreen: undefined;
  InviteAndEarnScreen: undefined;
  WorkingHoursScreen: undefined;
  SelectCalendarScreen: undefined;
};

export type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;
export type IntroScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SplashIntro'
>;
export type SignInScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LoginScreen'
>;
export type SignUpScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUp'
>;
export type ForgotPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ForgotPassword'
>;
export type OTPVerificationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OtpVerification'
>;
export type SetPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SetPassword'
>;
export type ProfileSetupScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProfileSetup'
>;
export type SingUpScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUp'
>;
