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
    Image,
    Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from "../../../constants/Color";
import { NotificationSettings, NotificationSettingItem } from '../../../types/notificationSettings';
import { useGetProfileQuery, useUpdateNotificationSettingsMutation } from '../../../redux/api/profileApi';


const SETTING_ITEMS: NotificationSettingItem[] = [
    { id: 'newClientRequest', title: 'New Client Requests' },
    { id: 'newMessage', title: 'New Messages' },
    { id: 'reviewsRatings', title: 'Reviews & Ratings' },
    { id: 'meetingReminders', title: 'Meeting Reminders' },
    { id: 'licenseExpiryAlerts', title: 'License Expiry Alerts' },
    { id: 'platformUpdates', title: 'Platform Updates' },
    { id: 'marketingPromotions', title: 'Marketing & Promotions' },
];

const NotificationManagementScreen = ({ navigation }: any) => {
    const { data: profile } = useGetProfileQuery(undefined);
    const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        newClientRequest: true,
        newMessage: true,
        reviewsRatings: true,
        meetingReminders: true,
        licenseExpiryAlerts: true,
        platformUpdates: false,
        marketingPromotions: false
    })

    useEffect(() => {
        if (profile?.notificationPreferences) {
            setNotificationSettings((prev) => ({
                ...prev,
                ...profile.notificationPreferences,
            }));
        }
    }, [profile]);

    const handleToggle = (key: keyof NotificationSettings) => {
        // setNotificationSettings((prev) => ({
        //     ...prev,
        //     [key]: !prev[key],
        // }));
        const newValue = !notificationSettings[key];
        setNotificationSettings((prev) => ({
            ...prev,
            [key]: newValue,
        }));
        updateNotificationSettings({ [key]: newValue }).catch(() => { });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={"light-content"} backgroundColor={COLORS.black} />
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
                        source={require('../../../assets/images/backIcon.png')}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification Management</Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {SETTING_ITEMS.map((item, index) => (
                    <View key={item.id} style={styles.rowContainer}>
                        <View style={styles.contentRow}>
                            <Text style={styles.titleText}>{item.title}</Text>
                            <Switch
                                value={notificationSettings[item.id]}
                                onValueChange={() => handleToggle(item.id)}
                                trackColor={{ false: '#2C2C2E', true: '#FF6B00' }}
                                thumbColor={'#FFFFFF'}
                            />
                        </View>

                        {index < SETTING_ITEMS.length - 1 && (
                            <View style={styles.dividerLine} />
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default NotificationManagementScreen

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
        height: 380,
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
        fontSize: 14,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 30,
    },
    rowContainer: {
        width: '100%',
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
    },
    titleText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    dividerLine: {
        height: 1,
        backgroundColor: '#262628',
        width: '100%',
    },
})