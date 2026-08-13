import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { COLORS } from '../constants/Color';

interface MetricItems {
    id: string;
    title: string;
    value: string;
    icon: ImageSourcePropType;
    //   bgColor: string;
}
interface OverviewCardsProps {
    agentName?: string;
    totalRequests?: number;
    todayRequests?: number;
    profileViews?: number;
    messageCount?: number;
}

const OverviewCards: React.FC<OverviewCardsProps> = ({
    agentName = 'Alex',
    totalRequests,
    todayRequests,
    profileViews,
    messageCount,
}) => {
    const formatCount = (n?: number) => {
        if (n === undefined) return '0';
        if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
        return String(n);
    };

    const metrics: MetricItems[] = [
        {
            id: '1',
            title: 'Total Requests',
            value: totalRequests !== undefined ? String(totalRequests) : '0',
            icon: require('../assets/images/total_request.png'),
            //   bgColor: '#FF7A00',
        },
        {
            id: '2',
            title: 'Today Requests',
            value: todayRequests !== undefined ? String(todayRequests) : '0',
            icon: require('../assets/images/today_request.png'),
            //   bgColor: '#FF1616',
        },
        {
            id: '3',
            title: 'Profile View',
            value: formatCount(profileViews),
            icon: require('../assets/images/profile_view.png'),
            //   bgColor: '#FF7A00',
        },
        {
            id: '4',
            title: 'Messages',
            value: formatCount(messageCount),
            icon: require('../assets/images/message.png'),
            //   bgColor: '#FF1616',
        },
    ];

    return (
        <View style={styles.cardContainer}>
            <Text style={styles.greetingTitle}>Good morning, {agentName} 👋</Text>
            <Text style={styles.greetingSubtitle}>Here's your performance overview</Text>

            <View style={styles.gridRow}>
                {metrics.map((item) => (
                    <View key={item.id} style={styles.metricBox}>
                        <Image
                            source={item.icon}
                            style={styles.cardImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.valueText}>{item.value}</Text>
                        <Text style={styles.titleText}>{item.title}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default OverviewCards;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#141416',
        borderRadius: 16,
        padding: 16,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
    },
    greetingTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    greetingSubtitle: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginBottom: 16,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metricBox: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 2,
    },
    cardImage: {
        width: 42,
        height: 42,
        marginBottom: 6,
    },
    valueText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2,
    },
    titleText: {
        color: COLORS.textMuted,
        fontSize: 10,
        textAlign: 'center',
    },
});