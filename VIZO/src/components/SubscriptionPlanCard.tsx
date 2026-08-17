import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';

import { SubscriptionPlan, BillingCycle } from '../types/subscription';
import { COLORS } from '../constants/Color';

interface SubscriptionPlanCardProps {
    plan: SubscriptionPlan;
    billingCycle: BillingCycle;
    onSelectPlan: (plan: SubscriptionPlan) => void;
    isSubmitting?: boolean;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
    plan,
    billingCycle,
    onSelectPlan,
    isSubmitting = false,
}) => {
    const isCurrentActive = plan.isActivePlan;

    const Price = () => {
        if (billingCycle === 'monthly') {
            return `₹${plan.monthlyPrice}/month`;
        }
        return `₹${plan.annualPricePerMonth}/month`;
    };

    const renderGemIcon = () => {
        switch (plan.iconName) {
            case 'ruby':
                return (
                    <Image
                        source={require('../assets/images/ruby.png')}
                        style={styles.gemImage}
                        resizeMode="contain"
                    />
                );
            case 'diamond':
                return (
                    <Image
                        source={require('../assets/images/diamond.png')}
                        style={styles.gemImage}
                        resizeMode="contain"
                    />
                );
            case 'sapphire':
                return (
                    <Image
                        source={require('../assets/images/sapphire.png')}
                        style={styles.gemImage}
                        resizeMode="contain"
                    />
                );
            case 'emerald':
                return (
                    <Image
                        source={require('../assets/images/emerald.png')}
                        style={styles.gemImage}
                        resizeMode="contain"
                    />
                );
            default:
                return null;
        }
    };

    const FeatureTickIcon = () => {
        if (isCurrentActive) {
            return (
                <Image
                    source={require('../assets/images/whiteCheck.png')}
                    style={styles.featureTickImage}
                    resizeMode="contain"
                />
            );
        }
        return (
            <Image
                source={require('../assets/images/orangeCheck.png')}
                style={styles.featureTickImage}
                resizeMode="contain"
            />
        );
    };

    return (
        <View
            style={[
                styles.cardWrapper,
                isCurrentActive ? styles.activeCardBorder : styles.normalCardBorder,
            ]}
        >
            {isCurrentActive && (
                <View style={styles.activePillBadge}>
                    <Text style={styles.activePillText}>Active Plan</Text>
                </View>
            )}

            {isCurrentActive && (
                <Image
                    source={require('../assets/images/activeCheck.png')}
                    style={styles.topRightActiveBadge}
                    resizeMode="contain"
                />
            )}

            <View style={styles.cardHeaderRow}>
                {renderGemIcon()}

                <View style={styles.headerTitleCol}>
                    <Text style={styles.planTitleText}>{plan.name}</Text>
                    <Text style={styles.priceValueText}>{Price()}</Text>
                    <Text style={styles.taglineSubText}>{plan.tagline}</Text>
                </View>
            </View>

            <View style={styles.featureContainer}>
                {plan.features.map((item, index) => (
                    <View key={index} style={styles.featureItemRow}>
                        {FeatureTickIcon()}
                        <Text style={styles.featureItemText}>{item}</Text>
                    </View>
                ))}
            </View>

            {isCurrentActive && plan.expiryDate && (
                <Text style={styles.expiryDateLabel}>
                    Expiring On: {plan.expiryDate}
                </Text>
            )}

            {isCurrentActive ? (
                <View style={styles.disabledCurrentBtn}>
                    <Text style={styles.disabledCurrentBtnText}>Current Plan</Text>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.contactAdminGlowBtn}
                    onPress={() => onSelectPlan(plan)}
                    disabled={isSubmitting}
                    activeOpacity={0.85}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.contactAdminBtnText}>
                            Contact Admin to Purchase
                        </Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

export default SubscriptionPlanCard;

const styles = StyleSheet.create({
    cardWrapper: {
        backgroundColor: '#111113',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingTop: 22,
        paddingBottom: 16,
        marginBottom: 20,
        marginTop: 14,
        position: 'relative',
    },
    normalCardBorder: {
        borderWidth: 1,
        borderColor: '#242426',
    },
    activeCardBorder: {
        borderWidth: 1.5,
        borderColor: '#FF5500',
    },

    activePillBadge: {
        position: 'absolute',
        top: -17,
        backgroundColor: COLORS.orange,
        alignSelf: 'center',
        justifyContent: "center",
        alignItems: "center",
        width: 122,
        height: 32,
        borderRadius: 36,
        zIndex: 10,
    },
    activePillText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '700',
    },

    topRightActiveBadge: {
        position: 'absolute',
        top: 17,
        left: 311,
        right: 36,
        width: 24,
        height: 24,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    gemImage: {
        width: 45,
        height: 57,
        marginRight: 12,
        marginTop: 2,
    },
    headerTitleCol: {
        flex: 1,
    },
    planTitleText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 2,
    },
    priceValueText: {
        color: COLORS.orange,
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 2,
    },
    taglineSubText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },

    featureContainer: {
        marginBottom: 14,
    },
    featureItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    featureTickImage: {
        width: 13,
        height: 9,
        marginRight: 10,
    },
    featureItemText: {
        color: '#E5E5EA',
        fontSize: 14,
        fontWeight: '400',
    },

    expiryDateLabel: {
        color: COLORS.orange,
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 14,
    },

    disabledCurrentBtn: {
        backgroundColor: '#242428',
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledCurrentBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    contactAdminGlowBtn: {
        backgroundColor: '#FF4500',
        height: 46,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF4500',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    contactAdminBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});