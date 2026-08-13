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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from "../../../constants/Color";
import {
    ReferralListItem,
    ReferralDashboardSummary,
} from '../../../types/referral';
// import { referralService } from '../../../services/referralService';
import { useGetReferralsQuery } from '../../../redux/api/referralApi';


const ReferralProgramScreen = ({ navigation }: any) => {
    // const [dashboardSummary, setDashboardSummary] =
    //     useState<ReferralDashboardSummary | null>(null);

    // const [referralList, setReferralList] =
    //     useState<ReferralListItem[]>([]);

    // const [isLoading, setIsLoading] = useState<boolean>(true);
    const { data, isLoading, refetch } = useGetReferralsQuery(undefined);
    const dashboardSummary = data?.dashboardSummary || null;
    const referralList = data?.referralList || [];

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            refetch();
        });
        return unsubscribe;
    }, [navigation])

    // const fetchDashboardData = async () => {
    //     setIsLoading(true);
    //     try {
    //         const data = await referralService.getReferralDashbboardData();
    //         setDashboardSummary(data.dashboardSummary);
    //         setReferralList(data.referralList);
    //     } catch (error) {
    //         console.log("Error fetching referral data: ", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }
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
                <Text style={styles.headerTitle}>Referral Program</Text>
            </View>

            {isLoading || !dashboardSummary ? (
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
                            <Text style={styles.rewardAmountText}>${dashboardSummary.totalRewardsEarned}</Text>
                        </View>

                        <View style={styles.coinBadgeContainer}>
                            <Image
                                source={require('../../../assets/images/crownStar.png')}
                                style={styles.crownstar}
                                resizeMode='contain'
                            />
                        </View>
                    </View>

                    <View style={styles.totalReferralsCard}>
                        <Text style={styles.referralsCountLabel}>Total Referrals</Text>
                        <Text style={styles.referralsCountValue}>
                            {dashboardSummary.totalReferralsCount}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.createReferralGlowBtn}
                        onPress={() => navigation.navigate('CreateReferralScreen')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.createBtnText}>Create New Referral</Text>
                    </TouchableOpacity>

                    <View style={styles.referralsListContainer}>
                        {referralList.map((item: ReferralListItem) => (
                            <View key={item.referralId} style={styles.referralCard}>
                                <View style={styles.cardTopRow}>
                                    <Text style={styles.clientNameText}>{item.customerName}</Text>

                                    <View
                                        style={[
                                            styles.statusBadgePill,
                                            item.referralStatus === 'Under Contract'
                                                ? styles.underContractPill
                                                : styles.acceptedPill,
                                        ]}
                                    >
                                        <Text style={styles.statusBadgeText}>{item.referralStatus}</Text>
                                    </View>
                                </View>

                                <View style={styles.locationRow}>
                                    <Image
                                        source={require("../../../assets/images/refLoc.png")}
                                        style={styles.locationPinEmoji}
                                        resizeMode='contain'
                                    />
                                    <Text style={styles.locationText} numberOfLines={1}>
                                        {item.customerLocation}
                                    </Text>
                                </View>

                                <Text style={styles.requirementsText}>{item.customerRequirement}</Text>

                                <Text style={styles.acceptedByFooterText}>
                                    Accepted by {item.acceptedAgentName}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default ReferralProgramScreen

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
        backgroundColor: COLORS.black,
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
    totalReferralsCard: {
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
    referralsCountLabel: {
        color: '#D8D8DC',
        fontSize: 14,
        fontWeight: '500',
    },
    referralsCountValue: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },

    createReferralGlowBtn: {
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
    createBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },

    referralsListContainer: {
        gap: 12,
    },
    referralCard: {
        backgroundColor: '#161618',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#242426',
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    clientNameText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    statusBadgePill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    acceptedPill: {
        backgroundColor: '#2C2C2E',
    },
    underContractPill: {
        backgroundColor: '#FF9500',
    },
    statusBadgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    locationPinEmoji: {
        width: 16,
        height: 16,
        marginRight: 4,
    },
    locationText: {
        color: COLORS.white,
        fontSize: 12,
        flex: 1,
    },
    requirementsText: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginBottom: 14,
    },
    acceptedByFooterText: {
        color: '#636366',
        fontSize: 11,
    },
})