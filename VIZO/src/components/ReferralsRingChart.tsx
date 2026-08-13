// import React, { useState } from "react"
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity
// } from "react-native";

// import Svg, { Circle } from "react-native-svg";
// import { COLORS } from "../constants/Color";

// type TimeFilter = "1M" | "6M" | "1Y";

// export interface ReferralData {
//     inProgress: number;
//     pending: number;
//     closed: number;
// }

// const dummyRefferalData: ReferralData = {
//     inProgress: 19,
//     pending: 10,
//     closed: 6,
// };

// const ReferralsRingChart: React.FC<{ data?: ReferralData }> = ({
//     data = dummyRefferalData,
// }) => {
//     const [activeFilter, setActiveFilter] = useState<TimeFilter>("1Y");

//     const size = 130;
//     const strokeWidth = 8;
//     const center = size / 2;

//     // Outer Ring (In Progress - Green)
//     const r1 = 52;
//     const circ1 = 2 * Math.PI * r1;

//     // Middle Ring (Pending - Purple)
//     const r2 = 40;
//     const circ2 = 2 * Math.PI * r2;

//     // Inner Ring (Closed - Orange)
//     const r3 = 28;
//     const circ3 = 2 * Math.PI * r3;

//     return (
//         <View style={styles.container}>
//             {/* Header Row */}
//             <View style={styles.headerRow}>
//                 <Text style={styles.title}>Referrals Overview</Text>

//                 <View style={styles.filterContainer}>
//                     {(['1M', '6M', '1Y'] as TimeFilter[]).map((filter) => (
//                         <TouchableOpacity
//                             key={filter}
//                             style={[
//                                 styles.filterBtn,
//                                 activeFilter === filter && styles.activeFilterBtn,
//                             ]}
//                             onPress={() => setActiveFilter(filter)}
//                         >
//                             <Text
//                                 style={[
//                                     styles.filterText,
//                                     activeFilter === filter && styles.activeFilterText,
//                                 ]}
//                             >
//                                 {filter}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             </View>

//             {/* Chart & Legend Row */}
//             <View style={styles.contentRow}>
//                 {/* Multi-Ring SVG Chart */}
//                 <View style={styles.chartBox}>
//                     <Svg width={size} height={size}>
//                         {/* Background Tracks */}
//                         <Circle cx={center} cy={center} r={r1} stroke="#2C2C2E" strokeWidth={strokeWidth} fill="none" />
//                         <Circle cx={center} cy={center} r={r2} stroke="#2C2C2E" strokeWidth={strokeWidth} fill="none" />
//                         <Circle cx={center} cy={center} r={r3} stroke="#2C2C2E" strokeWidth={strokeWidth} fill="none" />

//                         {/* Active Rings */}
//                         {/* Outer: In Progress (Green) */}
//                         <Circle
//                             cx={center}
//                             cy={center}
//                             r={r1}
//                             stroke="#82C43C"
//                             strokeWidth={strokeWidth}
//                             fill="none"
//                             strokeDasharray={circ1}
//                             strokeDashoffset={circ1 * 0.3}
//                             strokeLinecap="round"
//                             rotation={-90}
//                             origin={`${center}, ${center}`}
//                         />
//                         {/* Middle: Pending (Purple) */}
//                         <Circle
//                             cx={center}
//                             cy={center}
//                             r={r2}
//                             stroke="#A06EC4"
//                             strokeWidth={strokeWidth}
//                             fill="none"
//                             strokeDasharray={circ2}
//                             strokeDashoffset={circ2 * 0.45}
//                             strokeLinecap="round"
//                             rotation={-90}
//                             origin={`${center}, ${center}`}
//                         />
//                         {/* Inner: Closed (Orange) */}
//                         <Circle
//                             cx={center}
//                             cy={center}
//                             r={r3}
//                             stroke={COLORS.orange}
//                             strokeWidth={strokeWidth}
//                             fill="none"
//                             strokeDasharray={circ3}
//                             strokeDashoffset={circ3 * 0.55}
//                             strokeLinecap="round"
//                             rotation={-90}
//                             origin={`${center}, ${center}`}
//                         />
//                     </Svg>
//                 </View>

//                 {/* Legend Stats Column */}
//                 <View style={styles.statsCol}>
//                     <View style={styles.statRow}>
//                         <View style={[styles.dot, { backgroundColor: '#82C43C' }]} />
//                         <Text style={styles.statLabel}>In - Progress</Text>
//                         <Text style={styles.statValue}>{data.inProgress}</Text>
//                     </View>

//                     <View style={styles.statRow}>
//                         <View style={[styles.dot, { backgroundColor: '#A06EC4' }]} />
//                         <Text style={styles.statLabel}>Pending</Text>
//                         <Text style={styles.statValue}>{data.pending}</Text>
//                     </View>

//                     <View style={styles.statRow}>
//                         <View style={[styles.dot, { backgroundColor: COLORS.orange }]} />
//                         <Text style={styles.statLabel}>Closed</Text>
//                         <Text style={styles.statValue}>{data.closed}</Text>
//                     </View>
//                 </View>
//             </View>
//         </View>
//     )
// }

// export default ReferralsRingChart

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: '#141416',
//         borderRadius: 16,
//         padding: 16,
//         marginVertical: 10,
//         borderWidth: 1,
//         borderColor: COLORS.borderDark,
//     },
//     headerRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 16,
//     },
//     title: {
//         color: COLORS.white,
//         fontSize: 15,
//         fontWeight: '700',
//     },
//     filterContainer: {
//         flexDirection: 'row',
//         backgroundColor: '#1E1E20',
//         borderRadius: 8,
//         padding: 2,
//     },
//     filterBtn: {
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 6,
//     },
//     activeFilterBtn: {
//         backgroundColor: COLORS.orange,
//     },
//     filterText: {
//         color: COLORS.textMuted,
//         fontSize: 10,
//         fontWeight: '600',
//     },
//     activeFilterText: {
//         color: COLORS.white,
//     },
//     contentRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     chartBox: {
//         width: '45%',
//         alignItems: 'center',
//     },
//     statsCol: {
//         width: '50%',
//         justifyContent: 'center',
//     },
//     statRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 6,
//     },
//     dot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         marginRight: 8,
//     },
//     statLabel: {
//         flex: 1,
//         color: COLORS.textMuted,
//         fontSize: 12,
//     },
//     statValue: {
//         color: COLORS.white,
//         fontSize: 15,
//         fontWeight: '700',
//     },
// })

import React, { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";

import Svg, { Circle } from "react-native-svg";
import { COLORS } from "../constants/Color";

type TimeFilter = "1M" | "6M" | "1Y";

export interface ReferralData {
    inProgress: number;
    pending: number;
    closed: number;
}

const dummyRefferalData: ReferralData = {
    inProgress: 19,
    pending: 10,
    closed: 6,
};

const ReferralsRingChart: React.FC<{ data?: ReferralData }> = ({
    data = dummyRefferalData,
}) => {
    const [activeFilter, setActiveFilter] = useState<TimeFilter>("1Y");

    const size = 130;
    const strokeWidth = 8;
    const center = size / 2;

    // Outer Ring (In Progress - Green)
    const r1 = 52;
    const circ1 = 2 * Math.PI * r1;

    // Middle Ring (Pending - Purple)
    const r2 = 40;
    const circ2 = 2 * Math.PI * r2;

    // Inner Ring (Closed - Orange)
    const r3 = 28;
    const circ3 = 2 * Math.PI * r3;

    const total = Math.max(1, data.inProgress + data.pending + data.closed);
    const inProgressRatio = data.inProgress / total;
    const pendingRatio = data.pending / total;
    const closedRatio = data.closed / total;

    return (
        <View style={styles.container}>
            {/* Header Row */}
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

            {/* Chart & Legend Row */}
            <View style={styles.contentRow}>
                {/* Multi-Ring SVG Chart */}
                <View style={styles.chartBox}>
                    <Svg width={size} height={size}>
                        {/* Background Tracks */}
                        <Circle cx={center} cy={center} r={r1} stroke="#2C2C2E" strokeWidth={strokeWidth} fill="none" />
                        <Circle cx={center} cy={center} r={r2} stroke="#2C2C2E" strokeWidth={strokeWidth} fill="none" />
                        <Circle cx={center} cy={center} r={r3} stroke="#2C2C2E" strokeWidth={strokeWidth} fill="none" />

                        {/* Active Rings */}
                        {/* Outer: In Progress (Green) */}
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
                        {/* Middle: Pending (Purple) */}
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
                        {/* Inner: Closed (Orange) */}
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

                {/* Legend Stats Column */}
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