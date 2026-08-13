import React, { useMemo, useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";

import { LineChart } from "react-native-gifted-charts";
import { COLORS } from "../constants/Color";

type TimeFilter = "1M" | "6M" | "1Y";

export interface PerformanceChartProps {
    requests?: Array<{ createdAt?: string }>;
    onFilterChnage?: (filter: TimeFilter) => void;
}

const MONTH_LABELS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const buildSeriesFromRequests = (
    requests: Array<{ createdAt?: string }>,
    filter: TimeFilter
) => {
    const now = new Date();

    if (filter === "1M") {
        const days = 30;
        const buckets: { value: number; label: string }[] = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const count = requests.filter((r) => {
                if (!r.createdAt) return false;
                const rd = new Date(r.createdAt);
                return rd.getDate() === d.getDate() && rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear();
            }).length;
            const showLabel = i % 5 === 0;
            buckets.push({ value: count, label: showLabel ? `${d.getDate()}/${MONTH_LABELS[d.getMonth()]}` : '' });
        }
        return buckets;
    }

    // 6M / 1Y -> bucketed by month
    const monthsBack = filter === "6M" ? 6 : 12;
    const buckets: { value: number; label: string }[] = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const count = requests.filter((r) => {
            if (!r.createdAt) return false;
            const rd = new Date(r.createdAt);
            return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear();
        }).length;
        buckets.push({ value: count, label: `${MONTH_LABELS[d.getMonth()]}/${String(d.getFullYear()).slice(2)}` });
    }
    return buckets;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({
    requests = [],
    onFilterChnage,
}) => {
    const [activeFilter, setActiveFilter] = useState<TimeFilter>("1Y");

    const handleFilterSelect = (filter: TimeFilter) => {
        setActiveFilter(filter);
        if (onFilterChnage) {
            onFilterChnage(filter);
        }
    };

    const chartData = useMemo(
        () => buildSeriesFromRequests(requests, activeFilter),
        [requests, activeFilter]
    );

    const maxValue = Math.max(4, ...chartData.map((d) => d.value)) + 2;
    const totalLeads = chartData.reduce((sum, d) => sum + d.value, 0);

    return (
        <View style={styles.container}>
            {/* headre */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>Performance</Text>

                <View style={styles.filterContainer}>
                    {(["1M", "6M", "1Y"] as TimeFilter[]).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterBtn,
                                activeFilter === filter && styles.activeFilterBtn,
                            ]}
                            onPress={() => handleFilterSelect(filter)}
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

            {totalLeads === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>No leads yet in this period.</Text>
                </View>
            ) : (
                <View style={styles.chartWrapper}>
                    <LineChart
                        data={chartData}
                        curved
                        color={COLORS.orange}
                        thickness={3}
                        startFillColor="rgba(255, 122, 0, 0.2)"
                        endFillColor="transparent"
                        startOpacity={0.4}
                        endOpacity={0.0}
                        areaChart
                        yAxisColor="transparent"
                        xAxisColor="#2C2C2E"
                        yAxisTextStyle={{ color: COLORS.textMuted, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: COLORS.textMuted, fontSize: 9 }}
                        noOfSections={4}
                        maxValue={maxValue}
                        rulesColor="#222224"
                        rulesType="solid"
                        hideDataPoints={false}
                        dataPointsColor={COLORS.white}
                        dataPointsRadius={4}
                        pointerConfig={{
                            pointerStripUptoDataPoint: true,
                            pointerStripColor: COLORS.orange,
                            pointerStripWidth: 1,
                            strokeDashArray: [2, 5],
                            radius: 5,
                            pointerColor: COLORS.white,
                            pointerComponent: (items: any) => (
                                <View style={styles.pointerTooltip}>
                                    <View style={styles.pointerDot} />
                                    <Text style={styles.pointerText}>Leads {items?.[0]?.value ?? 0}</Text>
                                </View>
                            ),
                        }}
                    />
                </View>
            )}
        </View>
    )
}

export default PerformanceChart

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#141416",
        borderRadius: 16,
        padding: 16,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: 700,
    },
    filterContainer: {
        flexDirection: "row",
        backgroundColor: "#1E1E20",
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
        fontWeight: 600,
    },
    activeFilterText: {
        color: COLORS.white,
    },
    chartWrapper: {
        marginLeft: -10,
        paddingRight: 10,
    },
    emptyBox: {
        paddingVertical: 30,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textMuted,
        fontSize: 12,
    },
    pointerTooltip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A1810',
        borderColor: COLORS.orange,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        position: 'absolute',
        top: -30,
        left: -35,
    },
    pointerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.orange,
        marginRight: 4,
    },
    pointerText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: '600',
    },
})
