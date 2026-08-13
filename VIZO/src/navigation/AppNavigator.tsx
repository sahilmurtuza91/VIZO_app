import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import Splash from '../screen/splashScreen/Spalsh';
import SplashIntro from '../screen/splashScreen/SplashIntro';
import LoginScreen from '../screen/signInScreen/LoginScreen';
import ForgotPassword from '../screen/signInScreen/ForgotPassword';
import OtpVerification from '../screen/signInScreen/OtpVerification';
import setPassword from '../screen/signInScreen/setPassword';
import SingUpScreen from "../screen/signUpScreen/SingUpScreen";
import ProfileSetupScreen from '../screen/signUpScreen/ProfileSetupScreen';

import ClientDetailScreen from '../screen/RequestScreen/ClientDetailScreen';
import PropertyRequirementsScreen from '../screen/RequestScreen/PropertyRequirementsScreen';
import MyTicketsScreen from '../screen/PrfileScreen/TicketScreen/MyTicketsScreen';

import BottomTabNavigator from './BottomTabNavigator';

import ChatDetailScreen from '../screen/ChatScreen/ChatDetailScreen';

import DailyActivitiesScreen from '../screen/DailyActivitiesScreen/DailyActivitiesScreen';
import SubscriptionPlansScreen from '../screen/SubscriptionScreen/SubscriptionPlansScreen';
import HelpCenterScreen from '../screen/PrfileScreen/HelpCenterScreen/HelpCenterScreen';
import SettingScreen from '../screen/SettingScreen/SettingScreen';
import RefralScreen from '../screen/RefralScreen/RefralScreen';
import PlatformSettingScreen from '../screen/SettingScreen/PlatformSettingScreen';
import EditProfileScreen from '../screen/PrfileScreen/EditProfileScreen';
import ProfileDetailsScreen from '../screen/PrfileScreen/ProfileDetailsScreen';

import HelpAndSupportScreen from '../screen/PrfileScreen/HelpCenterScreen/HelpAndSupportScreen';
import NotificationManagementScreen from '../screen/PrfileScreen/NotificationScreen/NotificationManagementScreen';
import FAQScreen from '../screen/PrfileScreen/HelpCenterScreen/FAQScreen';
import PrivacyPoliciesScreen from '../screen/PrfileScreen/HelpCenterScreen/PrivacyPoliciesScreen';
import TermsAndConditionsScreen from '../screen/PrfileScreen/HelpCenterScreen/TermsAndConditionsScreen';
import ChangePasswordScreen from '../screen/PrfileScreen/ChangePasswordScreen';
import NotificationsScreen from '../screen/PrfileScreen/NotificationScreen/NotificationsScreen';
import ReferralProgramScreen from '../screen/RefralScreen/ReferralProgramScreen/ReferralProgramScreen';
import CreateReferralScreen from '../screen/RefralScreen/ReferralProgramScreen/CreateReferralScreen';
import InviteAndEarnScreen from '../screen/RefralScreen/InviteAndEarnScreen/InviteAndEarnScreen';
import WorkingHoursScreen from '../screen/SettingScreen/WorkingHours/WorkingHoursScreen';
import SelectCalendarScreen from '../screen/SettingScreen/WorkingHours/SelectCalendarScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="SplashIntro" component={SplashIntro} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="OtpVerification" component={OtpVerification} />
                <Stack.Screen name="SetPassword" component={setPassword} />
                <Stack.Screen name="SignUp" component={SingUpScreen} />
                <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />

                <Stack.Screen name="Dashboard" component={BottomTabNavigator} />

                {/* Registered ChatDetailScreen in Navigation Stack */}
                <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen} />

                <Stack.Screen name='ClientDetail' component={ClientDetailScreen} />
                <Stack.Screen name="PropertyRequirements" component={PropertyRequirementsScreen} />

                <Stack.Screen name="DailyActivitiesScreen" component={DailyActivitiesScreen} />
                <Stack.Screen name='SubscriptionPlansScreen' component={SubscriptionPlansScreen} />
                <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} />
                <Stack.Screen name="SettingScreen" component={SettingScreen} />
                <Stack.Screen name='RefralScreen' component={RefralScreen} />
                <Stack.Screen name='PlatformSettingScreen' component={PlatformSettingScreen} />
                <Stack.Screen name='EditProfileScreen' component={EditProfileScreen} />
                <Stack.Screen name='ProfileDetailsScreen' component={ProfileDetailsScreen} />

                <Stack.Screen name='HelpAndSupportScreen' component={HelpAndSupportScreen} />
                <Stack.Screen name='MyTicketsScreen' component={MyTicketsScreen} />
                <Stack.Screen name='NotificationManagementScreen' component={NotificationManagementScreen} />
                <Stack.Screen name='FAQScreen' component={FAQScreen} />
                <Stack.Screen name='PrivacyPoliciesScreen' component={PrivacyPoliciesScreen} />
                <Stack.Screen name='TermsAndConditionsScreen' component={TermsAndConditionsScreen} />
                <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} />
                <Stack.Screen name='NotificationsScreen' component={NotificationsScreen} />
                <Stack.Screen name='ReferralProgramScreen' component={ReferralProgramScreen} />
                <Stack.Screen name='CreateReferralScreen' component={CreateReferralScreen} />
                <Stack.Screen name='InviteAndEarnScreen' component={InviteAndEarnScreen} />
                <Stack.Screen name='WorkingHoursScreen' component={WorkingHoursScreen} />
                <Stack.Screen name='SelectCalendarScreen' component={SelectCalendarScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;