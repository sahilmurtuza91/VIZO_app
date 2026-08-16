import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Switch } from 'react-native';
import { COLORS } from "../constants/Color";
import { useNavigation } from '@react-navigation/native';
import LocationPickerModal from './LocationPickerModal';
import { useUpdateLocationMutation } from '../redux/api/profileApi';

interface HeaderSectionProps {
    location?: string;
    onNotificationPress?: () => void;
    isAvailable?: boolean;
    onToggleAvailability?: (value: boolean) => void;
    unreadCount?: number;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
    location = 'Set your location',
    onNotificationPress,
    isAvailable: isAvailableProp,
    onToggleAvailability,
    unreadCount = 0,
}) => {
    const [localIsAvailable, setLocalIsAvailable] = useState<boolean>(true);
    const isAvailable = isAvailableProp !== undefined ? isAvailableProp : localIsAvailable;

    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [updateLocation] = useUpdateLocationMutation();


    const toggleSwitch = () => {
        if (onToggleAvailability) {
            onToggleAvailability(!isAvailable);
        } else {
            setLocalIsAvailable((prev) => !prev);
        }
    }

    const handleSaveLocation = async (payload: { lat?: number; lng?: number; cityLabel: string }) => {
        await updateLocation({
            lat: payload.lat ?? 0,
            lng: payload.lng ?? 0,
            cityLabel: payload.cityLabel,
        }).unwrap();
    }

    const handleClearLocation = async () => {
        await updateLocation({ lat: 0, lng: 0, cityLabel: "" }).unwrap();
    }

    return (
        <View style={styles.container}>
            <View style={styles.locationPill}>
                <Image
                    source={require("../assets/images/location.png")}
                    style={styles.pinIcon}
                    resizeMode='contain'
                />
                <Text style={styles.locationText}>{location}</Text>
                <TouchableOpacity>
                    <Image
                        source={require('../assets/images/Arrow - Down 3.png')}
                        style={styles.downArrow}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.switchRow}>
                <Text style={styles.availableText}>
                    {isAvailable ? 'Available' : 'Offline'}
                </Text>
                <Switch
                    trackColor={{ false: '#3A3A3C', true: COLORS.red }}
                    thumbColor={COLORS.white}
                    onValueChange={toggleSwitch}
                    value={isAvailable}
                    style={styles.switch}
                />
            </View>
            <TouchableOpacity
                style={styles.iconBtn}
                onPress={onNotificationPress}
            >
                <Image
                    source={require("../assets/images/notification.png")}
                    style={styles.controlIcon}
                    resizeMode='contain'
                />
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
                <Image
                    source={require('../assets/images/crown.png')}
                    style={styles.controlIcon}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <LocationPickerModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
                onSave={handleSaveLocation}
                onClear={handleClearLocation}
            />
        </View>
    );
};

export default HeaderSection

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
        marginHorizontal:10,
    },
    locationPill: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#1E1E20',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        // borderColor: COLORS.borderDark,
    },
    pinIcon: {
        width: 14,
        height: 14,
        tintColor: COLORS.orange,
        marginRight: 6,
    },
    locationText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '500',
        marginRight: 6,
    },
    downArrow: {
        width: 10,
        height: 10,
        tintColor: COLORS.textMuted,
    },
    rightControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    availableText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
        marginRight: 6,
    },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    iconBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
        position: 'relative',
    },
    controlIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.white,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: COLORS.orange,
        borderRadius: 8,
        width: 14,
        height: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 9,
        fontWeight: 'bold',
    },
})