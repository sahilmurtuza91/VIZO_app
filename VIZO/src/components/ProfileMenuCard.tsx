import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Image,
    ImageSourcePropType,
} from 'react-native';
import { COLORS } from '../constants/Color';

interface ProfileMenuCardProps {
    iconSource: ImageSourcePropType;
    title: string;
    onPress: () => void;
    LiveLocation?: string;
    rightSideIcon?: boolean;

}

const ProfileMenuCard: React.FC<ProfileMenuCardProps> = ({
    iconSource,
    title,
    onPress,
    LiveLocation,
    rightSideIcon = true,
}) => {
    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={onPress}
            activeOpacity={0.75}
        >
            <View style={styles.leftRow}>
                <View style={styles.iconBgContainer}>
                    <Image
                        source={iconSource}
                        style={styles.iconImage}
                        resizeMode='contain'
                    />
                </View>
                <Text style={styles.menuTitleText}>
                    {title}
                </Text>
            </View>

            <View style={styles.rightRow}>
                {LiveLocation && (
                    <View style={styles.badgePill}>
                        <Text style={styles.badgeText}>{LiveLocation}</Text>
                    </View>
                )}

                {rightSideIcon && (
                    <Image
                        source={require("../assets/images/rightOpenIcon.png")}
                        style={styles.rightIcon}
                        resizeMode='contain'
                    />
                )}
            </View>
        </TouchableOpacity>
    )
}

export default ProfileMenuCard

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#161618',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: '#242426',
    },
    leftRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconBgContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: COLORS.orange,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },

    iconImage: {
        width: 18,
        height: 18,
        tintColor: COLORS.white,
    },
    menuTitleText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
    rightRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    badgePill: {
        backgroundColor: COLORS.orange,
        alignItems: "center",
        width: 42,
        height: 19,
        borderRadius: 5,
        marginRight: 8,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 700,
    },
    rightIcon: {
        width: 14,
        height: 14,
        tintColor: COLORS.white,
    }
})