import React, { useMemo, useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";

import Svg, { Circle } from "react-native-svg";
import { COLORS } from "../constants/Color";

type TimeFilter = "1M" | "6M" | "1Y";

export interface ReferralItem {
    referralStatus: string;
    createdAt?: string;
}

const STATUS_BUCKET: Record<string, "inProgress" | "pending" | "closed" | null> = {
    Accepted: "inProgress",
    "Under Contract": "inProgress",
    Pending: "pending",
    Closed: "closed",
};
const buildRingData = (referrals: ReferralItem[], filter: TimeFilter) => {
    const now = new Date();
    const cutoff = new Date(now);
    if (filter === "1M") cutoff.setMonth(cutoff.getMonth() - 1);
    else if (filter === "6M") cutoff.setMonth(cutoff.getMonth() - 6);
    else cutoff.setFullYear(cutoff.getFullYear() - 1);

    const inWindow = referrals.filter((r) => {
        if (!r.createdAt) return false;
        return new Date(r.createdAt) >= cutoff;
    });

    const counts = { inProgress: 0, pending: 0, closed: 0 };
    inWindow.forEach((r) => {
        const bucket = STATUS_BUCKET[r.referralStatus];
        if (bucket) counts[bucket] += 1;
    });
    return counts;
};

const ReferralsRingChart: React.FC<{ referrals?: ReferralItem[] }> = ({
    referrals = [],
}) => {
    const [activeFilter, setActiveFilter] = useState<TimeFilter>("1Y");

    const data = useMemo(() => buildRingData(referrals, activeFilter), [referrals, activeFilter]);

    const size = 130;
    const strokeWidth = 8;
    const center = size / 2;

    const r1 = 52;
    const circ1 = 2 * Math.PI * r1;

    const r2 = 40;
    const circ2 = 2 * Math.PI * r2;

    const r3 = 28;
    const circ3 = 2 * Math.PI * r3;

    const total = Math.max(1, data.inProgress + data.pending + data.closed);
    const inProgressRatio = data.inProgress / total;
    const pendingRatio = data.pending / total;
    const closedRatio = data.closed / total;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Referrals Overview</Text>

                <View style={styles.filterContainer}>
                    {(['1M', '6M', '1Y'] as TimeFilter[]).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterBtn,
                                activeFilter === filter && styles.activeFilterBtn,
                            ]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === filter && styles.activeFilterText,
                                ]}
                            >
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.contentRow}>
                <View style={styles.chartBox}>
                    <Svg width={size} height={size}>
                        <Circle cx={center} cy={center} r={r1} stroke="#2C2C2E" strokeWidth={strokeWidth} fill="none" />
                        <Circle cx={center} cy={center} r={r2} stroke="#2C2C2E" strokeWidth={strokeWidth} fill="none" />
                        <Circle cx={center} cy={center} r={r3} stroke="#2C2C2E" strokeWidth={strokeWidth} fill="none" />

                        <Circle
                            cx={center}
                            cy={center}
                            r={r1}
                            stroke="#82C43C"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circ1}
                            strokeDashoffset={circ1 * (1 - inProgressRatio)}
                            strokeLinecap="round"
                            rotation={-90}
                            origin={`${center}, ${center}`}
                        />
                        <Circle
                            cx={center}
                            cy={center}
                            r={r2}
                            stroke="#A06EC4"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circ2}
                            strokeDashoffset={circ2 * (1 - pendingRatio)}
                            strokeLinecap="round"
                            rotation={-90}
                            origin={`${center}, ${center}`}
                        />
                        <Circle
                            cx={center}
                            cy={center}
                            r={r3}
                            stroke={COLORS.orange}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circ3}
                            strokeDashoffset={circ3 * (1 - closedRatio)}
                            strokeLinecap="round"
                            rotation={-90}
                            origin={`${center}, ${center}`}
                        />
                    </Svg>
                </View>

                <View style={styles.statsCol}>
                    <View style={styles.statRow}>
                        <View style={[styles.dot, { backgroundColor: '#82C43C' }]} />
                        <Text style={styles.statLabel}>In - Progress</Text>
                        <Text style={styles.statValue}>{data.inProgress}</Text>
                    </View>

                    <View style={styles.statRow}>
                        <View style={[styles.dot, { backgroundColor: '#A06EC4' }]} />
                        <Text style={styles.statLabel}>Pending</Text>
                        <Text style={styles.statValue}>{data.pending}</Text>
                    </View>

                    <View style={styles.statRow}>
                        <View style={[styles.dot, { backgroundColor: COLORS.orange }]} />
                        <Text style={styles.statLabel}>Closed</Text>
                        <Text style={styles.statValue}>{data.closed}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ReferralsRingChart

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#141416',
        borderRadius: 16,
        padding: 16,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E1E20',
        borderRadius: 8,
        padding: 2,
    },
    filterBtn: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    activeFilterBtn: {
        backgroundColor: COLORS.orange,
    },
    filterText: {
        color: COLORS.textMuted,
        fontSize: 10,
        fontWeight: '600',
    },
    activeFilterText: {
        color: COLORS.white,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chartBox: {
        width: '45%',
        alignItems: 'center',
    },
    statsCol: {
        width: '50%',
        justifyContent: 'center',
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statLabel: {
        flex: 1,
        color: COLORS.textMuted,
        fontSize: 12,
    },
    statValue: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
})