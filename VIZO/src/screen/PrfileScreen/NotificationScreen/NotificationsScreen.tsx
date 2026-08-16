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
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from "../../../constants/Color";
import { NotificationItems } from '../../../types/notification';
// import { notificationService } from '../../../services/notificationService';
import NotificationCard from '../../../components/NotificationCard';
import {
    useGetNotificationQuery,
    useMarkAllReadMutation,
    useMarkSingleReadMutation,
} from "../../../redux/api/notificationApi";

const NotificationsScreen = ({ navigation }: any) => {
    const { data: notification = [], isLoading } = useGetNotificationQuery({ isRead: false });
    const [markAllRead] = useMarkAllReadMutation();
    const [markSingleRead] = useMarkSingleReadMutation();
    const handleMarlAllRead = async () => {
        try {
            await markAllRead(undefined).unwrap();
        } catch (error) {
            console.log("Faild to update the mark all notification");
        }
    }

    const singleItemRead = async (item: NotificationItems) => {
        try {
            await markSingleRead(item.id).unwrap();
            if (item.targetScreen) {
                navigation.navigate(item.targetScreen, { id: item.targetId });
            }
        } catch (error) {
            console.log("faild to handle the single item: ", error);
        }
    }

    const todayNotification = notification.filter((item: NotificationItems) => item.section === "Today");

    const olderNotification = notification.filter((item: NotificationItems) => item.section === "Older notifications");
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
                <View style={styles.headerLeftRow}>
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
                    <Text style={styles.headerTitle}>Notifications</Text>
                </View>
                <TouchableOpacity
                    onPress={handleMarlAllRead}
                    activeOpacity={0.7}
                    style={styles.markReadBtn}
                >
                    <Image
                        source={require("../../../assets/images/markRead.png")}
                        style={styles.checkMarkIcon}
                        resizeMode='contain'
                    />
                    <Text style={styles.markReadText}>Mark all read</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loaderCenter}>
                    <ActivityIndicator size="large" color={COLORS.orange || '#FF6B00'} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {todayNotification.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionHeaderTitle}>Today</Text>
                            {todayNotification.map((item: NotificationItems) => (
                                <NotificationCard
                                    key={item.id}
                                    item={item}
                                    onPress={singleItemRead}
                                />
                            ))}
                        </View>
                    )}

                    {olderNotification.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionHeaderTitle}>Older notifications</Text>
                            {olderNotification.map((item: NotificationItems) => (
                                <NotificationCard
                                    key={item.id}
                                    item={item}
                                    onPress={singleItemRead}
                                />
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default NotificationsScreen

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
        height: 550,
        opacity: 0.25,
    },
    loaderCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 16,
    },
    headerLeftRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
        fontSize: 20,
        fontWeight: '700',
    },
    markReadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    checkMarkIcon: {
        color: COLORS.white,
        width: 16,
        height: 16,
    },
    markReadText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '500',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    sectionContainer: {
        marginBottom: 16,
    },
    sectionHeaderTitle: {
        color: '#8E8E93',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 12,
    },
})