import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../constants/Color';
import HeaderSection from '../../components/HeaderSection';
import OverviewCards from '../../components/OverviewCards';
import ScoreRatingCard, { buildRatingData } from '../../components/ScoreRatingCard';
import EarnedBadgesRow from '../../components/EarnedBadgesRow';
import PerformanceChart from '../../components/PerformanceChart';
import ReferralsRingChart from '../../components/ReferralsRingChart';

import { useGetProfileQuery, useToggleAvailabilityMutation } from '../../redux/api/profileApi';
import { useGetAllRequestQuery } from '../../redux/api/clientRequestApi';
import { useGetReferralsQuery } from '../../redux/api/referralApi';
import { useGetUnreadNotificationCountQuery } from '../../redux/api/notificationApi';
import { useGetChatStatsQuery } from '../../redux/api/chatApi';

const isSameDay = (dateString?: string) => {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

const DashboardScreen = ({ navigation }: any) => {
  const { data: profile, refetch: refetchProfile } = useGetProfileQuery(undefined);
  const [toggleAvailability] = useToggleAvailabilityMutation();

  const { data: requests } = useGetAllRequestQuery(undefined);
  const totalRequests = requests?.length;
  const todayRequests = requests?.filter((r: any) => isSameDay(r.createdAt)).length;

  const { data: unreadCount } = useGetUnreadNotificationCountQuery(undefined);
  const { data: chatStats } = useGetChatStatsQuery(undefined);

  const { data: referralsData } = useGetReferralsQuery(undefined);
  const referralList = referralsData?.referralList || [];
  const referralRingData = {
    inProgress: referralList.filter((r: any) => r.referralStatus === 'Accepted' || r.referralStatus === 'Under Contract').length,
    pending: referralList.filter((r: any) => r.referralStatus === 'Pending').length,
    closed: referralList.filter((r: any) => r.referralStatus === 'Closed').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      <LinearGradient
        colors={['#FF1616', '#FF7A00', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.topGlowLayer}
      />
      <HeaderSection
        location={profile?.currentCity || "No location set"}
        onNotificationPress={() => navigation.navigate("NotificationsScreen")}
        onSubscriptionPress={() => navigation.navigate("SubscriptionPlansScreen")}
        isAvailable={Boolean(profile?.isOnline)}
        onToggleAvailability={(value) => toggleAvailability(value).catch(() => { })}
        unreadCount={unreadCount}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >


        <OverviewCards
          agentName={profile?.name?.split(' ')[0] || 'Alex'}
          totalRequests={totalRequests}
          todayRequests={todayRequests}
          profileViews={profile?.profileViewCount}
          messageCount={chatStats?.totalMessages}
        />

        <ScoreRatingCard data={buildRatingData(profile)} />

        <EarnedBadgesRow />

        <PerformanceChart requests={requests || []} />

        <ReferralsRingChart referrals={referralList} />

      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topGlowLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 550,
    opacity: 0.25,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
});