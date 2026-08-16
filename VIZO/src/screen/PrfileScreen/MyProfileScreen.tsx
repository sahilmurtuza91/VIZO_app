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
    ActivityIndicator,
    Image,
    Switch,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';

import { COLORS } from '../../constants/Color';
import { UserProfile } from '../../types/profile';
// import { profileService } from '../../services/profileService';
import ProfileMenuCard from '../../components/ProfileMenuCard';

import { useGetProfileQuery, useToggleAvailabilityMutation } from '../../redux/api/profileApi';
import { logout } from '../../redux/slice/authSlice';

const MyProfileScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { data: profile, isLoading } = useGetProfileQuery(undefined);
    const [toggleAvailability, { isLoading: isUpdatingStatus }] = useToggleAvailabilityMutation();

    const handleOnlineOfflineStatus = async (value: boolean) => {
        try {
            await toggleAvailability(value).unwrap();
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to update online status.');
        }
    }

    const handelLogout = async () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: () => {
                    dispatch(logout());
                    navigation.navigate("LoginScreen");
                },
            },
        ]);
    };
    if (isLoading || !profile) {
        return (
            <View style={styles.loaderCenter}>
                <ActivityIndicator size="large" color={COLORS.orange} />
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

            <LinearGradient
                colors={['#FF1616', '#FF7A00', 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.topGlowLayer}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>My Profile</Text>

                    <TouchableOpacity
                        style={styles.editProfileBtn}
                        onPress={() => navigation.navigate('EditProfileScreen')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.editProfileLink}>Edit Profile</Text>

                        <Image
                            source={require('../../assets/images/rightEditProfile.png')}
                            style={styles.rightEditProfile}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: profile.avatarUrl }}
                            style={styles.avatarImage}
                        />
                        <TouchableOpacity
                            style={styles.cameraBadge}
                            onPress={() => navigation.navigate('ProfileDetailsScreen')}
                            activeOpacity={0.8}
                        >
                            <Image
                                source={require('../../assets/images/cameraIcon.png')}
                                style={styles.cameraIcon}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.nameRow}>
                        <Text style={styles.userNameText}>{profile.name}</Text>
                        <View style={styles.ratingBadge}>
                            <Image
                                source={require("../../assets/images/Star.png")}
                                style={styles.starIcon}
                                resizeMode='contain'
                            />
                            <Text style={styles.ratingText}>{profile.rating}</Text>
                        </View>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.specialtyScrollRow}
                    >
                        {profile.specialties.map((tag: string, idx: number) => (
                            <View
                                key={idx}
                                style={[
                                    styles.tagPill,
                                    tag === 'Luxury'
                                        ? styles.tagOrange
                                        : tag === 'Residential'
                                            ? styles.tagRed
                                            : styles.tagDark,
                                ]}
                            >
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.experienceRow}>
                        <Image
                            source={require("../../assets/images/medal-star.png")}
                            style={styles.experienceIcon}
                            resizeMode='contain'
                        />
                        <Text style={styles.experienceText}>
                            {profile.experience}+ years
                        </Text>
                    </View>
                </View>

                <View style={styles.completionCard}>
                    <View style={styles.completionHeaderRow}>
                        <Text style={styles.completionLabel}>Profile Completion</Text>
                        <Text style={styles.completionValue}>
                            {profile.profileCompletePercentage}%
                        </Text>
                    </View>

                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${profile.profileCompletePercentage}%` },
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.activeSwitchCard}>
                    <View>
                        <Text style={styles.activeSwitchTitle}>
                            {profile.isOnline ? 'You are Active' : 'You are Offline'}
                        </Text>
                        <Text style={styles.activeSwitchSubtext}>
                            {profile.isOnline ? 'Go Offline' : 'Go Online'}
                        </Text>
                    </View>

                    <Switch
                        value={profile.isOnline}
                        onValueChange={handleOnlineOfflineStatus}
                        trackColor={{ false: '#2C2C2E', true: '#FF4500' }}
                        thumbColor={'#FFFFFF'}
                        disabled={isUpdatingStatus}
                    />
                </View>

                <View style={styles.menuList}>
                    <ProfileMenuCard
                        title="Share my Location"
                        iconSource={require('../../assets/images/location.png')}
                        LiveLocation="Live"
                        onPress={() => navigation.navigate('ShareMyShowingScreen')}
                    />

                    <ProfileMenuCard
                        title="Help Center"
                        iconSource={require('../../assets/images/call.png')}
                        onPress={() => navigation.navigate('HelpCenterScreen')}
                    />

                    <ProfileMenuCard
                        title="Settings"
                        iconSource={require('../../assets/images/setting.png')}
                        onPress={() => navigation.navigate('SettingScreen')}
                    />

                    <ProfileMenuCard
                        title="Referrals"
                        iconSource={require('../../assets/images/groupPeope.png')}
                        onPress={() => navigation.navigate('RefralScreen')}
                    />

                    <ProfileMenuCard
                        title="Daily Activities"
                        iconSource={require('../../assets/images/dailyActivity.png')}
                        onPress={() => navigation.navigate('DailyActivitiesScreen')}
                    />

                    <ProfileMenuCard
                        title='Subscription plan'
                        iconSource={require("../../assets/images/Hot.png")}
                        onPress={() => navigation.navigate("SubscriptionPlansScreen")}
                    />
                </View>

                <View style={styles.bottomActionRow}>
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={handelLogout}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.logoutBtnText}>Log out</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteAccountBtn}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.deleteBtnText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MyProfileScreen

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
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 12,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: '700',
    },
    editProfileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },

    editProfileLink: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '400',
    },

    rightEditProfile: {
        width: 12,
        height: 12,
        marginLeft: 6,
        tintColor: COLORS.white,
    },

    avatarSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 12,
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        opacity: 1,
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 31,
        height: 31,
        borderRadius: 15,
        backgroundColor: '#FF4500',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#111113',
    },
    cameraIcon: {
        width: 16,
        height: 16,
        tintColor: '#FFFFFF',
    },

    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userNameText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginRight: 6,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        color: '#FFCC00',
        marginRight: 2,
        width: 9,
        height: 9,
    },
    ratingText: {
        color: COLORS.textMuted,
        fontSize: 12,
        fontWeight: '600',
    },

    specialtyTagsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    // NEW: horizontal-scroll row for specialty tags (see render above).
    specialtyScrollRow: {
        marginBottom: 8,
    },
    tagPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,
    },
    tagOrange: {
        backgroundColor: '#FF6B00',
    },
    tagRed: {
        backgroundColor: '#CC0000',
    },
    tagDark: {
        backgroundColor: '#2C2C2E',
    },
    tagText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
    experienceRow: {
        marginTop: 2,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
    },
    experienceIcon: {
        width: 16,
        height: 16
    },
    experienceText: {
        color: COLORS.white,
        fontSize: 12,
        marginLeft: 6,
    },

    completionCard: {
        backgroundColor: '#161618',
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#242426',
    },
    completionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    completionLabel: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    completionValue: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#2C2C2E',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FF6B00',
        borderRadius: 3,
    },

    activeSwitchCard: {
        backgroundColor: '#161618',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#242426',
    },
    activeSwitchTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    activeSwitchSubtext: {
        color: COLORS.textMuted,
        fontSize: 12,
    },

    menuList: {
        marginBottom: 16,
    },

    bottomActionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    logoutBtn: {
        flex: 1,
        backgroundColor: '#FF6B00',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 5,
    },
    logoutBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    deleteAccountBtn: {
        flex: 1,
        backgroundColor: '#D32F2F',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 5,
    },
    deleteBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
})