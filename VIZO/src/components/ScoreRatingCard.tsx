import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../constants/Color';
import { PrimaryButton } from '../components/PrimaryButton';

export interface RatingItem {
    stars: number;
    count: number;
    percentage: number;
}

export interface RatingData {
    score: number;
    statusText: string;
    weeklyGrowth: number;
    overallRating: number;
    totalReviews: number;
    breakdown: RatingItem[];
}

const dummyData: RatingData = {
    score: 4.8,
    statusText: 'Excellent',
    weeklyGrowth: 0.3,
    overallRating: 4.9,
    totalReviews: 86,
    breakdown: [
        { stars: 5, count: 76, percentage: 80 },
        { stars: 4, count: 8, percentage: 15 },
        { stars: 3, count: 2, percentage: 5 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
    ],
};

interface CardProps {
    data?: RatingData;
    onRequestReviews?: () => void;
}
export const buildRatingData = (profile?: {
    rating?: number;
    reviewCount?: number;
    ratingBreakdown?: Record<string, number>;
}): RatingData => {
    if (!profile) return dummyData;

    const overallRating = profile.rating ?? 0;
    const totalReviews = profile.reviewCount ?? 0;
    const breakdownCounts = profile.ratingBreakdown || {};

    const breakdown: RatingItem[] = [5, 4, 3, 2, 1].map((stars) => {
        const count = Number(breakdownCounts[stars] ?? breakdownCounts[String(stars)] ?? 0);
        const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        return { stars, count, percentage };
    });

    return {
        score: overallRating,
        statusText: overallRating >= 4.5 ? 'Excellent' : overallRating >= 3.5 ? 'Good' : overallRating >= 2.5 ? 'Average' : 'Needs Improvement',
        weeklyGrowth: 0, 
        overallRating,
        totalReviews,
        breakdown,
    };
};

const RatingCircle = ({ score }: { score: number }) => {
    const size = 110;
    const strokeWidth = 12;

    const radius = (size - strokeWidth) / 2;

    const circumference = 2 * Math.PI * radius;

    const visibleLength = circumference * 0.75;

    const progress = score / 5;

    const dashOffset = visibleLength * (1 - progress);

    return (
        <View style={styles.gaugeContainer}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#2C2C2E"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${visibleLength} ${circumference}`}
                    rotation={135}
                    origin={`${size / 2}, ${size / 2}`}
                    strokeLinecap="round"
                />

                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={COLORS.orange}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${visibleLength} ${circumference}`}
                    strokeDashoffset={dashOffset}
                    rotation={135}
                    origin={`${size / 2}, ${size / 2}`}
                    strokeLinecap="round"
                />
            </Svg>
        </View>
    );
};

export const ScoreRatingCard: React.FC<CardProps> = ({
    data = dummyData,
    onRequestReviews,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Score and Rating</Text>

            <View style={styles.cardContent}>
                <View style={styles.scoreArcBox}>
                    <View style={styles.gaugeWrapper}>
                        <RatingCircle score={data.score} />
                        <View style={styles.scoreOverlay}>
                            <Text style={styles.scoreValue}>{data.score.toFixed(1)}</Text>
                            <Text style={styles.starsText}>★★★★★</Text>
                            <Text style={styles.statusText}>{data.statusText}</Text>
                        </View>
                    </View>

                    <Text style={styles.growthText}>
                        <Text style={{ color: '#4EAE67' }}>
                            {data.weeklyGrowth > 0 ? `${data.weeklyGrowth}` : data.weeklyGrowth}
                        </Text>{' '}
                        this week
                    </Text>
                </View>

                <View style={styles.breakdownBox}>
                    <View style={styles.ratingSummaryRow}>
                        <Text style={styles.overallRating}>
                            {data.overallRating}/5
                        </Text>
                        <Text style={styles.starIcon}>★</Text>
                        <Text style={styles.totalReviews}>({data.totalReviews} reviews)</Text>
                    </View>

                    {data.breakdown.map((item) => (
                        <View key={item.stars} style={styles.barRow}>
                            <Text style={styles.starNum}>{item.stars}</Text>
                            <Text style={styles.starSymbol}>★</Text>
                            <View style={styles.trackBar}>
                                <View
                                    style={[
                                        styles.fillBar,
                                        { width: `${item.percentage}%` },
                                    ]}
                                />
                            </View>
                            <Text style={styles.countText}>{item.count}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <PrimaryButton
                title="Request Reviews From Past Clients"
                onPress={onRequestReviews ? onRequestReviews : () => console.log('Request Reviews Pressed')}
                style={styles.requestBtn}
            />
        </View>
    );
};

export default ScoreRatingCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#141416',
        borderRadius: 16,
        padding: 16,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 14,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    scoreArcBox: {
        width: '46%',
        backgroundColor: '#1C1C1E',
        borderRadius: 14,
        // paddingVertical: 12,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gaugeWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        top: 20,
    },
    gaugeContainer: {
        alignItems: 'center',
    },
    scoreOverlay: {
        position: 'absolute',
        top: 25,
        alignItems: 'center',
    },
    scoreValue: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: '800',
    },
    starsText: {
        color: COLORS.orange,
        fontSize: 10,
        marginVertical: 1,
    },
    statusText: {
        color: COLORS.orange,
        fontSize: 11,
        fontWeight: '600',
    },
    growthText: {
        color: COLORS.textMuted,
        fontSize: 10,
        marginTop: 6,
    },
    breakdownBox: {
        width: '50%',
        justifyContent: 'center',
    },
    ratingSummaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    overallRating: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
    starIcon: {
        color: COLORS.orange,
        fontSize: 13,
        marginHorizontal: 3,
    },
    totalReviews: {
        color: COLORS.textMuted,
        fontSize: 10,
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    starNum: {
        color: COLORS.textMuted,
        fontSize: 10,
        width: 8,
    },
    starSymbol: {
        color: COLORS.orange,
        fontSize: 9,
        marginRight: 4,
    },
    trackBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#2C2C2E',
        borderRadius: 2,
        overflow: 'hidden',
        marginRight: 6,
    },
    fillBar: {
        height: '100%',
        backgroundColor: COLORS.orange,
        borderRadius: 2,
    },
    countText: {
        color: COLORS.textMuted,
        fontSize: 10,
        width: 16,
        textAlign: 'right',
    },
    requestBtn: {
        marginTop: 6,
    },
});