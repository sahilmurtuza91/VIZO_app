// import React, { useState, useEffect } from 'react';
// import {
//     SafeAreaView,
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     ScrollView,
//     StatusBar,
//     Platform,
//     ActivityIndicator,
//     Alert,
//     Image,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// import { COLORS } from '../../constants/Color';
// import { SubscriptionPlan, BillingCycle } from '../../types/subscription';
// // import { subscriptionService } from '../../services/subscriptionService';
// import SubscriptionPlanCard from '../../components/SubscriptionPlanCard';
// import {
//     useGetSubscriptionPlansQuery,
//     useGetCurrentSubscriptionQuery,
//     useCreateCheckoutOrderMutation,
// } from '../../redux/api/subscriptionApi';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';

// let RazorpayCheckout: any = null;
// try {
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     RazorpayCheckout = require('react-native-razorpay').default;
// } catch (e) {
//     // not installed yet
// }

// const SubscriptionPlansScreen = ({ navigation }: any) => {
//     const [activeTab, setActiveTab] = useState<'myPlan' | 'allPlans'>('myPlan');
//     const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

//     // const [activePlanId, setActivePlanId] = useState<string>('plan_ruby');
//     // const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
//     // const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [requestingPlanId, setRequestingPlanId] = useState<string | null>(null);

//     const { data: allPlans = [], isLoading } = useGetSubscriptionPlansQuery(undefined);
//     const { data: currentSubscription } = useGetCurrentSubscriptionQuery(undefined);
//     const [createCheckoutOrder] = useCreateCheckoutOrderMutation();

//     const activePlanId = currentSubscription?.subscription?.plan?._id
//         || currentSubscription?.subscription?.plan
//         || null;

//     // useEffect(() => {
//     //     fetchSubscriptionData();
//     // }, []);

//     // const fetchSubscriptionData = async () => {
//     //     setIsLoading(true);
//     //     try {
//     //         const data = await subscriptionService.getSubscriptionPlans();
//     //         setAllPlans(data.allPlans);
//     //         if (data.activePlan) {
//     //             setActivePlanId(data.activePlan.id);
//     //         }
//     //     } catch (error) {
//     //         console.log('Error fetching subscription plans:', error);
//     //     } finally {
//     //         setIsLoading(false);
//     //     }
//     // };

//     const handleSelectPlan = async (selectedPlan: SubscriptionPlan) => {
//         setRequestingPlanId(selectedPlan.id);
//         try {
//             await createCheckoutOrder({ planId: selectedPlan.id, billingCycle }).unwrap();
//             Alert.alert(
//                 'Checkout Order Created',
//                 `Complete payment for the ${selectedPlan.name} plan to activate it.`
//             );
//         } catch (error: any) {
//             Alert.alert('Error', error?.data?.message || 'Failed to update plan.');
//         } finally {
//             setRequestingPlanId(null);
//         }
//     };

//     const computedPlans: Array<SubscriptionPlan & { isActivePlan: boolean }> = allPlans.map((plan: SubscriptionPlan) => ({
//         ...plan,
//         isActivePlan: plan.id === activePlanId,
//     }));

//     const currentActivePlan = computedPlans.find((plan: SubscriptionPlan & { isActivePlan: boolean }) => plan.isActivePlan);

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

//             <LinearGradient
//                 colors={['#FF1616', '#FF7A00', 'transparent']}
//                 start={{ x: 0.5, y: 0 }}
//                 end={{ x: 0.5, y: 1 }}
//                 style={styles.topGlowLayer}
//             />

//             <View style={styles.headerBar}>
//                 <TouchableOpacity
//                     style={styles.backBtn}
//                     onPress={() => navigation.goBack()}
//                     activeOpacity={0.7}
//                 >
//                     <Image
//                         source={require('../../assets/images/backIcon.png')}
//                         style={styles.backIcon}
//                         resizeMode="contain"
//                     />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Subscription Plans</Text>
//             </View>

//             <View style={styles.tabContainer}>
//                 <TouchableOpacity
//                     style={[
//                         styles.tabBtn,
//                         activeTab === 'myPlan' && styles.activeTabBtn,
//                     ]}
//                     onPress={() => setActiveTab('myPlan')}
//                     activeOpacity={0.8}
//                 >
//                     <Text
//                         style={[
//                             styles.tabText,
//                             activeTab === 'myPlan' && styles.activeTabText,
//                         ]}
//                     >
//                         My Plan
//                     </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[
//                         styles.tabBtn,
//                         activeTab === 'allPlans' && styles.activeTabBtn,
//                     ]}
//                     onPress={() => setActiveTab('allPlans')}
//                     activeOpacity={0.8}
//                 >
//                     <Text
//                         style={[
//                             styles.tabText,
//                             activeTab === 'allPlans' && styles.activeTabText,
//                         ]}
//                     >
//                         All Plans
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             {isLoading ? (
//                 <View style={styles.loaderCenter}>
//                     <ActivityIndicator size="large" color={COLORS.orange} />
//                 </View>
//             ) : (
//                 <ScrollView
//                     contentContainerStyle={styles.scrollContent}
//                     showsVerticalScrollIndicator={false}
//                 >
//                     {activeTab === 'myPlan' ? (
//                         currentActivePlan ? (
//                             <SubscriptionPlanCard
//                                 plan={currentActivePlan}
//                                 billingCycle={billingCycle}
//                                 onSelectPlan={handleSelectPlan}
//                                 isSubmitting={requestingPlanId === currentActivePlan.id}
//                             />
//                         ) : (
//                             <Text style={styles.emptyText}>No Active Plan Found</Text>
//                         )
//                     ) : (
//                         <>
//                             <View style={styles.toggleContainer}>
//                                 <TouchableOpacity
//                                     style={[
//                                         styles.togglePill,
//                                         billingCycle === 'monthly' && styles.togglePillActive,
//                                     ]}
//                                     onPress={() => setBillingCycle('monthly')}
//                                     activeOpacity={0.8}
//                                 >
//                                     <Text
//                                         style={[
//                                             styles.toggleText,
//                                             billingCycle === 'monthly' && styles.toggleTextActive,
//                                         ]}
//                                     >
//                                         Monthly
//                                     </Text>
//                                 </TouchableOpacity>

//                                 <TouchableOpacity
//                                     style={[
//                                         styles.togglePill,
//                                         billingCycle === 'annual' && styles.togglePillActive,
//                                     ]}
//                                     onPress={() => setBillingCycle('annual')}
//                                     activeOpacity={0.8}
//                                 >
//                                     <Text
//                                         style={[
//                                             styles.toggleText,
//                                             billingCycle === 'annual' && styles.toggleTextActive,
//                                         ]}
//                                     >
//                                         Annual (Save 20%)
//                                     </Text>
//                                 </TouchableOpacity>
//                             </View>

//                             <View style={styles.noteCalloutBox}>
//                                 <Text style={styles.noteCalloutText}>
//                                     <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>
//                                         Note:{' '}
//                                     </Text>
//                                     To purchase or upgrade your subscription, please contact the
//                                     admin team directly. You'll receive activation instructions
//                                     via email.
//                                 </Text>
//                             </View>

//                             {computedPlans.map((plan) => (
//                                 <SubscriptionPlanCard
//                                     key={plan.id}
//                                     plan={plan}
//                                     billingCycle={billingCycle}
//                                     onSelectPlan={handleSelectPlan}
//                                     isSubmitting={requestingPlanId === plan.id}
//                                 />
//                             ))}
//                         </>
//                     )}
//                 </ScrollView>
//             )}
//         </SafeAreaView>
//     );
// };

// export default SubscriptionPlansScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.black,
//         paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//     },
//     topGlowLayer: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         height: 550,
//         opacity: 0.25,
//     },
//     headerBar: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingTop: 14,
//         paddingBottom: 10,
//     },
//     backBtn: {
//         width: 32,
//         height: 32,
//         justifyContent: 'center',
//         marginRight: 8,
//     },
//     backIcon: {
//         width: 18,
//         height: 18,
//         tintColor: COLORS.white,
//     },
//     headerTitle: {
//         color: COLORS.white,
//         fontSize: 20,
//         fontWeight: '700',
//     },
//     tabContainer: {
//         flexDirection: 'row',
//         borderBottomWidth: 1,
//         borderBottomColor: '#2C2C2E',
//         paddingHorizontal: 16,
//         marginBottom: 8,
//     },
//     tabBtn: {
//         flex: 1,
//         paddingVertical: 12,
//         alignItems: 'center',
//     },
//     activeTabBtn: {
//         borderBottomWidth: 2,
//         borderBottomColor: COLORS.orange,
//     },
//     tabText: {
//         color: COLORS.textMuted,
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     activeTabText: {
//         color: COLORS.white,
//     },
//     loaderCenter: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     scrollContent: {
//         paddingHorizontal: 16,
//         paddingBottom: 30,
//         paddingTop: 6,
//     },
//     emptyText: {
//         color: COLORS.textMuted,
//         textAlign: 'center',
//         marginTop: 40,
//     },

//     toggleContainer: {
//         flexDirection: 'row',
//         backgroundColor: '#1C1C1E',
//         borderRadius: 12,
//         padding: 3,
//         marginBottom: 14,
//         marginTop: 8,
//     },
//     togglePill: {
//         flex: 1,
//         paddingVertical: 10,
//         borderRadius: 10,
//         alignItems: 'center',
//     },
//     togglePillActive: {
//         backgroundColor: '#FF4500',
//     },
//     toggleText: {
//         color: '#8E8E93',
//         fontSize: 12,
//         fontWeight: '600',
//     },
//     toggleTextActive: {
//         color: '#FFFFFF',
//         fontWeight: '700',
//     },

//     noteCalloutBox: {
//         backgroundColor: '#111113',
//         borderWidth: 2,
//         borderColor: '#FF7A00',
//         borderRadius: 12,
//         padding: 12,
//         marginBottom: 10,
//     },
//     noteCalloutText: {
//         color: COLORS.white,
//         fontSize: 13,
//         lineHeight: 20,
//     },
// });

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

// NEW: real Razorpay Checkout. Native module — `npm install react-native-razorpay`
// + rebuild (see CHANGELOG.md). Falls back to a clear message instead of a
// silent no-op if it isn't installed yet.
let RazorpayCheckout: any = null;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    RazorpayCheckout = require('react-native-razorpay').default;
} catch (e) {
    // not installed yet
}

const SubscriptionPlansScreen = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState<'myPlan' | 'allPlans'>('myPlan');
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

    // const [activePlanId, setActivePlanId] = useState<string>('plan_ruby');
    // const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    const [requestingPlanId, setRequestingPlanId] = useState<string | null>(null);

    const { data: allPlans = [], isLoading } = useGetSubscriptionPlansQuery(undefined);
    const { data: currentSubscription, refetch: refetchCurrentSubscription } = useGetCurrentSubscriptionQuery(undefined);
    const [createCheckoutOrder] = useCreateCheckoutOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();
    const currentUser = useSelector((state: RootState) => state.auth.user);

    const activePlanId = currentSubscription?.subscription?.plan?._id
        || currentSubscription?.subscription?.plan
        || null;

    // useEffect(() => {
    //     fetchSubscriptionData();
    // }, []);

    // const fetchSubscriptionData = async () => {
    //     setIsLoading(true);
    //     try {
    //         const data = await subscriptionService.getSubscriptionPlans();
    //         setAllPlans(data.allPlans);
    //         if (data.activePlan) {
    //             setActivePlanId(data.activePlan.id);
    //         }
    //     } catch (error) {
    //         console.log('Error fetching subscription plans:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // FIX: this used to stop after `createCheckoutOrder` and just show an
    // Alert saying the order was created — it never actually opened
    // Razorpay Checkout, so no real (even test-mode) payment ever
    // happened and the button looked broken. Now it: 1) creates the
    // order on the backend (unchanged), 2) opens the real Razorpay
    // Checkout sheet with that order's id/amount/key, 3) on success,
    // sends the payment id + signature to /subscriptions/verify so the
    // backend can activate the subscription (this endpoint already
    // existed — it just was never called from here).
    const handleSelectPlan = async (selectedPlan: SubscriptionPlan) => {
        if (!RazorpayCheckout) {
            Alert.alert(
                'Payments not installed',
                'Run `npm install react-native-razorpay` in the app project, link it, and rebuild to enable checkout.'
            );
            return;
        }

        setRequestingPlanId(selectedPlan.id);
        try {
            const order = await createCheckoutOrder({ planId: selectedPlan.id, billingCycle }).unwrap();
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

            Alert.alert('Payment Successful', `Your ${selectedPlan.name} plan is now active.`);
            refetchCurrentSubscription();
            setActiveTab('myPlan');
        } catch (error: any) {
            if (error?.code === 2 || error?.description) {
                // user cancelled the Razorpay sheet or payment failed on their side
                Alert.alert('Payment Cancelled', error?.description || 'Payment was not completed.');
            } else {
                Alert.alert('Error', error?.data?.message || 'Failed to update plan.');
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