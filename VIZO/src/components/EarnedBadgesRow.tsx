import React from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageSourcePropType,
} from "react-native";

import { COLORS } from "../constants/Color";

export interface BadgeItem {
    id: string;
    title: string;
    icon: ImageSourcePropType;
}

interface EarnBadgesProps {
    badges?: BadgeItem[];
    onViewAllPress?: () => void;
}

const dummyBadges: BadgeItem[] = [
    {
        id: "1",
        title: "Hot",
        icon: require("../assets/images/Hot.png")
    },
    {
        id: "2",
        title: "Top",
        icon: require("../assets/images/Top.png"),
    },
    {
        id: "3",
        title: "Deal",
        icon: require("../assets/images/Deal.png"),
    },
    {
        id: "4",
        title: "Review",
        icon: require("../assets/images/Review.png"),
    },
];

const EarnedBadgesRow: React.FC<EarnBadgesProps> = ({
    badges = dummyBadges,
    onViewAllPress,
}) => {
    return (
        <View style={styles.container}>

            <View style={styles.headerRow}>
                <Text style={styles.title}>Earned Badges</Text>
                <TouchableOpacity
                    onPress={onViewAllPress}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.badgeGrid}>
                {badges.map((badge) => (
                    <View
                        key={badge.id}
                        style={styles.badgeBox}
                    >
                        <View style={styles.badgeIconContainer}>
                            <Image
                                source={badge.icon}
                                style={styles.badgeIcon}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.badgeTitle}>{badge.title}</Text>

                    </View>
                ))}
            </View>
        </View>
    )
}

export default EarnedBadgesRow

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
        marginBottom: 16,
    },
    title: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: 700,
    },
    viewAllText: {
        color: COLORS.textMuted,
        fontSize: 12,
        textDecorationLine: "underline",
    },
    badgeGrid:{
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center",
    },
    badgeBox:{
        alignItems:"center",
    },
    badgeIconContainer:{
        width:56,
        height:56,
        justifyContent:"center",
        alignItems:"center",
        marginBlock:6,
    },
    badgeIcon:{
        width:48,
        height:48,
    },
    badgeTitle:{
        color:COLORS.textMuted,
        fontSize:11,
        fontWeight:"500",
    },
});