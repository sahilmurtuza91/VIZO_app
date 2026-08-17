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
    Alert,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../constants/Color';
import { SubscriptionPlan, BillingCycle } from '../../types/subscription';
// import { subscriptionService } from '../../services/subscriptionService';
import SubscriptionPlanCard from '../../components/SubscriptionPlanCard';
import {
    useGetSubscriptionPlansQuery,
    useGetCurrentSubscriptionQuery,
    useCreateCheckoutOrderMutation,
    useVerifyPaymentMutation,
} from '../../redux/api/subscriptionApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

let RazorpayCheckout: any = null;
try {
    RazorpayCheckout = require('react-native-razorpay').default;
} catch (e) {
}

const SubscriptionPlansScreen = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState<'myPlan' | 'allPlans'>('myPlan');
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
    const [requestingPlanId, setRequestingPlanId] = useState<string | null>(null);

    const { data: allPlans = [], isLoading } = useGetSubscriptionPlansQuery(undefined);
    const { data: currentSubscription, refetch: refetchCurrentSubscription } = useGetCurrentSubscriptionQuery(undefined);
    const [createCheckoutOrder] = useCreateCheckoutOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();
    const currentUser = useSelector((state: RootState) => state.auth.user);

    const activePlanId = currentSubscription?.subscription?.plan?._id
        || currentSubscription?.subscription?.plan
        || null;

    const handleSelectPlan = async (selectedPlan: SubscriptionPlan) => {
        if (!RazorpayCheckout) {
            Alert.alert(
                'Payment Error',
                'Payment service is not available. Please try again later.'
            );
            return;
        }
        setRequestingPlanId(selectedPlan.id);
        try {
            const order = await createCheckoutOrder({
                planId: selectedPlan.id,
                billingCycle,
            }).unwrap();

            const { orderId, amount, currency, keyId } = order.data;

            const paymentResult = await RazorpayCheckout.open({
                key: keyId,
                order_id: orderId,
                amount: Math.round(amount * 100),
                currency,
                name: 'VIZO',
                description: `${selectedPlan.name} plan (${billingCycle})`,
                prefill: {
                    name: currentUser?.name || '',
                    email: currentUser?.email || '',
                    contact: currentUser?.phone || '',
                },
                theme: { color: COLORS.orange },
            });

            await verifyPayment({
                razorpayOrderId: paymentResult.razorpay_order_id,
                razorpayPaymentId: paymentResult.razorpay_payment_id,
                razorpaySignature: paymentResult.razorpay_signature,
            }).unwrap();

            Alert.alert(
                'Payment Successful',
                `Your ${selectedPlan.name} plan is now active.`
            );

            refetchCurrentSubscription();
            setActiveTab('myPlan');

        } catch (error: any) {
            if (error?.code === 2) {
                Alert.alert(
                    'Payment Cancelled',
                    'You cancelled the payment.'
                );
            } else if (error?.description) {
                Alert.alert(
                    'Payment Failed',
                    'Your payment could not be completed. Please try again.'
                );
            } else {
                Alert.alert(
                    'Error',
                    error?.data?.message || 'Something went wrong. Please try again.'
                );
            }
        } finally {
            setRequestingPlanId(null);
        }
    };

    const computedPlans: Array<SubscriptionPlan & { isActivePlan: boolean }> = allPlans.map((plan: SubscriptionPlan) => ({
        ...plan,
        isActivePlan: plan.id === activePlanId,
    }));

    const currentActivePlan = computedPlans.find((plan: SubscriptionPlan & { isActivePlan: boolean }) => plan.isActivePlan);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

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
                        source={require('../../assets/images/backIcon.png')}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Subscription Plans</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabBtn,
                        activeTab === 'myPlan' && styles.activeTabBtn,
                    ]}
                    onPress={() => setActiveTab('myPlan')}
                    activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'myPlan' && styles.activeTabText,
                        ]}
                    >
                        My Plan
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabBtn,
                        activeTab === 'allPlans' && styles.activeTabBtn,
                    ]}
                    onPress={() => setActiveTab('allPlans')}
                    activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'allPlans' && styles.activeTabText,
                        ]}
                    >
                        All Plans
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loaderCenter}>
                    <ActivityIndicator size="large" color={COLORS.orange} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {activeTab === 'myPlan' ? (
                        currentActivePlan ? (
                            <SubscriptionPlanCard
                                plan={currentActivePlan}
                                billingCycle={billingCycle}
                                onSelectPlan={handleSelectPlan}
                                isSubmitting={requestingPlanId === currentActivePlan.id}
                            />
                        ) : (
                            <Text style={styles.emptyText}>No Active Plan Found</Text>
                        )
                    ) : (
                        <>
                            <View style={styles.toggleContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.togglePill,
                                        billingCycle === 'monthly' && styles.togglePillActive,
                                    ]}
                                    onPress={() => setBillingCycle('monthly')}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.toggleText,
                                            billingCycle === 'monthly' && styles.toggleTextActive,
                                        ]}
                                    >
                                        Monthly
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.togglePill,
                                        billingCycle === 'annual' && styles.togglePillActive,
                                    ]}
                                    onPress={() => setBillingCycle('annual')}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.toggleText,
                                            billingCycle === 'annual' && styles.toggleTextActive,
                                        ]}
                                    >
                                        Annual (Save 20%)
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.noteCalloutBox}>
                                <Text style={styles.noteCalloutText}>
                                    <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>
                                        Note:{' '}
                                    </Text>
                                    To purchase or upgrade your subscription, please contact the
                                    admin team directly. You'll receive activation instructions
                                    via email.
                                </Text>
                            </View>

                            {computedPlans.map((plan) => (
                                <SubscriptionPlanCard
                                    key={plan.id}
                                    plan={plan}
                                    billingCycle={billingCycle}
                                    onSelectPlan={handleSelectPlan}
                                    isSubmitting={requestingPlanId === plan.id}
                                />
                            ))}
                        </>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default SubscriptionPlansScreen;

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
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 10,
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
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTabBtn: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.orange,
    },
    tabText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    activeTabText: {
        color: COLORS.white,
    },
    loaderCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        paddingTop: 6,
    },
    emptyText: {
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: 40,
    },

    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 3,
        marginBottom: 14,
        marginTop: 8,
    },
    togglePill: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    togglePillActive: {
        backgroundColor: '#FF4500',
    },
    toggleText: {
        color: '#8E8E93',
        fontSize: 12,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },

    noteCalloutBox: {
        backgroundColor: '#111113',
        borderWidth: 2,
        borderColor: '#FF7A00',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },
    noteCalloutText: {
        color: COLORS.white,
        fontSize: 13,
        lineHeight: 20,
    },
});