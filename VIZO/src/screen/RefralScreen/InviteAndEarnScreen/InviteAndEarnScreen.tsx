import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Platform,
    ActivityIndicator,
    Image,
    Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../../constants/Color';
import { InviteItem } from '../../../types/invite';
// import { inviteService } from '../../../services/inviteService';
// import { referralDashboardSummary } from '../../../services/referralService';
import { useGetMyInvitesQuery } from '../../../redux/api/referralApi';

const InviteAndEarnScreen = ({ navigation }: any) => {
    // const [summary, setSummary] = useState(referralDashboardSummary);
    // const [invites, setInvites] = useState<InviteItem[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(true);

    const { data, isLoading } = useGetMyInvitesQuery(undefined);
    const summary = data?.dashboardSummary || { totalRewardsEarned: 0, totalReferralsCount: 0 };
    const invites: InviteItem[] = data?.invites || [];

    // useEffect(() => {
    //     fetchInviteData();
    // }, []);

    // const fetchInviteData = async () => {
    //     setIsLoading(true);
    //     try {
    //         const data = await inviteService.getInviteDashboard();
    //         setSummary(data.dashboardSummary);
    //         setInvites(data.invites);
    //     } catch (error) {
    //         console.log("Faild to load the dashboard data: ", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleSendInvite = async () => {
        try {
            await Share.share({
                title: "Invite Friends & Earn Rewards",
                message: "link:"
            });
        } catch (error) {
            console.log("Faild to share Invite link: ", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={"light-content"} backgroundColor={COLORS.black} />
            <LinearGradient
                colors={['#FF1616', '#FF7A00', 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.topGlowLayer}
            />
            <View style={styles.headerBar}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Image
                        source={require('../../../assets/images/backIcon.png')}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Invite & Earn</Text>
            </View>
            {isLoading ? (
                <View style={styles.loaderCenter}>
                    <ActivityIndicator size="large" color={COLORS.orange || '#FF6B00'} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.rewardCard}>
                        <View>
                            <Text style={styles.rewardCardLabel}>Total Reward earned</Text>
                            <Text style={styles.rewardAmountText}>
                                ${summary.totalRewardsEarned}
                            </Text>
                        </View>

                        <View style={styles.coinBadgeContainer}>
                            <Image
                                source={require('../../../assets/images/crownStar.png')}
                                style={styles.crownstar}
                                resizeMode='contain'
                            />
                        </View>
                    </View>
                    <View style={styles.totalInvitesCard}>
                        <Text style={styles.invitesCountLabel}>Total Invites</Text>
                        <Text style={styles.invitesCountValue}>
                            {summary.totalReferralsCount}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.sendInviteGlowBtn}
                        onPress={handleSendInvite}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.sendInviteBtnText}>
                            Send Invite To Your Friends
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.invitesListContainer}>
                        {invites.map((item) => (
                            <View key={item.id} style={styles.inviteCard}>
                                <View style={styles.cardUpperSection}>
                                    <Text style={styles.friendNameText}>{item.friendName}</Text>
                                    <Text style={styles.referralStatusText}>
                                        Referral Status : {item.referralStatus}
                                    </Text>
                                </View>

                                <View style={styles.cardSeparatorLine} />

                                <View style={styles.cardLowerSection}>
                                    <View
                                        style={[
                                            styles.smallCoinCircle,
                                            !item.hasReward && styles.greyCoinCircle,
                                        ]}
                                    >
                                        <Image
                                            source={require("../../../assets/images/crownCircle.png")}
                                            style={styles.CrownIcon}
                                            resizeMode='contain'
                                        />
                                    </View>

                                    <Text
                                        style={[
                                            styles.rewardStatusText,
                                            !item.hasReward && styles.greyRewardText,
                                        ]}
                                    >
                                        {item.rewardStatus}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default InviteAndEarnScreen

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
        height: 380,
        opacity: 0.25,
    },
    loaderCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 16,
    },
    backBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        marginRight: 8,
    },
    backIcon: {
        width: 18,
        height: 18,
        tintColor: COLORS.white,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    rewardCard: {
        backgroundColor: '#1C1A18',
        borderRadius: 16,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2D2822',
    },
    rewardCardLabel: {
        color: '#8E8E93',
        fontSize: 12,
        marginBottom: 4,
    },
    rewardAmountText: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '800',
    },
    coinBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    crownstar: {
        width: 78,
        height: 70,
    },
    totalInvitesCard: {
        backgroundColor: '#261810',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#803810',
    },
    invitesCountLabel: {
        color: '#D8D8DC',
        fontSize: 14,
        fontWeight: '500',
    },
    invitesCountValue: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
    sendInviteGlowBtn: {
        backgroundColor: '#FF3B00',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF3B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 20,
    },
    sendInviteBtnText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
    invitesListContainer: {
        gap: 12,
    },
    inviteCard: {
        backgroundColor: '#161618',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#242426',
        overflow: 'hidden',
    },
    cardUpperSection: {
        padding: 16,
        alignItems: 'center',
    },
    friendNameText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    referralStatusText: {
        color: '#8E8E93',
        fontSize: 12,
    },
    cardSeparatorLine: {
        height: 1,
        backgroundColor: '#242426',
        width: '100%',
    },
    cardLowerSection: {
        backgroundColor: '#1B1B1E',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    smallCoinCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFCC00',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greyCoinCircle: {
        backgroundColor: COLORS.textMuted,
    },
    CrownIcon: {
        width: 16,
        height: 16,
    },
    rewardStatusText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '500',
    },
    greyRewardText: {
        color: COLORS.textMuted,
    },
})