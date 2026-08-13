import { useState } from 'react';
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

import { COLORS } from '../../constants/Color';
import ProfileMenuCard from '../../components/ProfileMenuCard';

const SettingScreen = ({ navigation }: any) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
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
                        source={require('../../assets/images/backIcon.png')}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ProfileMenuCard
                    title="Notification Management"
                    iconSource={require('../../assets/images/info-circle.png')}
                    onPress={() => navigation.navigate('NotificationManagementScreen')}
                />

                <ProfileMenuCard
                    title="Platform Setting"
                    iconSource={require('../../assets/images/setting.png')}
                    onPress={() => navigation.navigate('PlatformSettingScreen')}
                />

                <ProfileMenuCard
                    title="Change Password"
                    iconSource={require('../../assets/images/lock.png')}
                    onPress={() => navigation.navigate('ChangePasswordScreen')}
                />

                <ProfileMenuCard
                    title="Working Hours"
                    iconSource={require('../../assets/images/WorkingHours.png')}
                    onPress={() => navigation.navigate('WorkingHoursScreen')}
                />

                <View style={styles.switchRowCard}>
                    <View style={styles.switchLeftGroup}>
                        <View style={styles.iconBgContainer}>
                            <Image
                                source={require('../../assets/images/mode_orange.png')}
                                style={styles.iconImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.switchTitleText}>Light / Dark mode</Text>
                    </View>

                    <Switch
                        value={isDarkMode}
                        onValueChange={setIsDarkMode}
                        trackColor={{ false: '#2C2C2E', true: '#FF3B00' }}
                        thumbColor={'#FFFFFF'}
                    />
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default SettingScreen

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
        fontSize: 20,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 12,
    },
    switchRowCard: {
        backgroundColor: '#161618',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#242426',
    },
    switchLeftGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBgContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: COLORS.orange,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconImage: {
        width: 18,
        height: 18,
        tintColor: COLORS.white,
    },
    switchTitleText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
})
