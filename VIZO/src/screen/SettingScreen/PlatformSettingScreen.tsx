import { useState, useEffect } from 'react';
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
    ImageSourcePropType,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useGetProfileQuery, useUpdatePlatformSettingsMutation } from '../../redux/api/profileApi';

import { COLORS } from '../../constants/Color';

interface SettingToggleCardProps {
    iconSource: ImageSourcePropType;
    title: string;
    subText: string;
    value: boolean;
    onValueChange: (val: boolean) => void;
}

const SettingToggleCard: React.FC<SettingToggleCardProps> = ({
    iconSource,
    title,
    subText,
    value,
    onValueChange,
}) => (
    <View style={styles.cardContainer}>
        <View style={styles.leftRow}>
            <View style={styles.iconBgContainer}>
                <Image source={iconSource} style={styles.iconImage} resizeMode="contain" />
            </View>
            <View style={styles.textColumn}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.subText}>{subText}</Text>
            </View>
        </View>
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#2C2C2E', true: '#FF6B00' }}
            thumbColor={'#FFFFFF'}
        />
    </View>
);

const PlatformSettingScreen = ({ navigation }: any) => {
    const { data: profile, isLoading } = useGetProfileQuery(undefined);
    const [updatePlatformSettings] = useUpdatePlatformSettingsMutation();

    const [isGpsEnable, setGpsEnable] = useState<boolean>(true);
    const [isPushEnabled, setIsPushEnabled] = useState<boolean>(false);
    const [isAiChatbotEnabled, setIsAiChatEnableed] = useState<boolean>(false);
    const [isInAppMessagingEnabled, setIsInAppMessagingEnabled] = useState<boolean>(false);

    useEffect(() => {
        if (profile?.settings) {
            setGpsEnable(Boolean(profile.settings.gpsLocationTracking));
            setIsPushEnabled(Boolean(profile.settings.pushNotifications));
            setIsAiChatEnableed(Boolean(profile.settings.aiChatbot));
            setIsInAppMessagingEnabled(Boolean(profile.settings.inAppMessaging));
        }
    }, [profile]);

    const persistSetting = (key: string, value: boolean) => {
        updatePlatformSettings({ [key]: value }).catch(() => { });
    };

    const handleGpsChange = (value: boolean) => {
        setGpsEnable(value);
        persistSetting('gpsLocationTracking', value);
    };
    const handlePushChange = (value: boolean) => {
        setIsPushEnabled(value);
        persistSetting('pushNotifications', value);
    };
    const handleAiChatbotChange = (value: boolean) => {
        setIsAiChatEnableed(value);
        persistSetting('aiChatbot', value);
    };
    const handleInAppMessagingChange = (value: boolean) => {
        setIsInAppMessagingEnabled(value);
        persistSetting('inAppMessaging', value);
    };


    const settingsList = [
        {
            id: 'gps',
            title: 'GPS Location Tracking',
            subText: 'Show nearby agent in real-time',
            icon: require('../../assets/images/gpsLocation.png'),
            value: isGpsEnable,
            onChange: setGpsEnable,
        },
        {
            id: 'push',
            title: 'Push Notifications',
            subText: 'Request responses & updates',
            icon: require('../../assets/images/PushNotifications.png'),
            value: isPushEnabled,
            onChange: setIsPushEnabled,
        },
        {
            id: 'chatbot',
            title: 'AI Chatbot',
            subText: 'Smart assistance & quick answers',
            icon: require('../../assets/images/PushNotifications.png'),
            value: isAiChatbotEnabled,
            onChange: setIsAiChatEnableed,
        },
        {
            id: 'messaging',
            title: 'In-App Messaging',
            subText: 'chat with approved clients',
            icon: require('../../assets/images/PushNotifications.png'),
            value: isInAppMessagingEnabled,
            onChange: setIsInAppMessagingEnabled,
        },
    ];

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
                        source={require('../../assets/images/backIcon.png')}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Platform Setting</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {settingsList.map((item) => (
                    <SettingToggleCard
                        key={item.id}
                        iconSource={item.icon}
                        title={item.title}
                        subText={item.subText}
                        value={item.value}
                        onValueChange={item.onChange}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default PlatformSettingScreen

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
    cardContainer: {
        backgroundColor: '#161618',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#242426',
    },
    leftRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
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
    textColumn: {
        flex: 1,
    },
    titleText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    subText: {
        color: '#8E8E93',
        fontSize: 11,
    },
})