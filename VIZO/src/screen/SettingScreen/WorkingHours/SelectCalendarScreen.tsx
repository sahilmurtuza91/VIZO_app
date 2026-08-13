import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
    Image,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CalendarType } from '../../../types/workingHours';
import { useSyncCalendarMutation } from '../../../redux/api/workingHoursApi';

import { COLORS } from '../../../constants/Color';

const SelectCalendarScreen = ({ navigation }: any) => {
    const [syncCalendar, { isLoading }] = useSyncCalendarMutation();

    const handleCalendarSelect = async(calendarName: CalendarType) => {
        try {
            await syncCalendar(calendarName).unwrap();
            Alert.alert(
                'Calendar Synced',
                `Connected successfully with ${calendarName}!`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to sync calendar.');
        }
    };

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
                        source={require('../../../assets/images/backIcon.png')}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Calendar</Text>
            </View>
            <View style={styles.contentContainer}>
                <TouchableOpacity
                    style={styles.calendarCardBtn}
                    onPress={() => handleCalendarSelect('Google Calendar')}
                    activeOpacity={0.8}
                >
                    <View style={styles.cardItem}>
                        <Image
                            source={require('../../../assets/images/googleCalendarIcon.png')}
                            style={styles.calendarLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.calendarNameText}>Google Calendar</Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.calendarCardBtn}
                    onPress={() => handleCalendarSelect('Outlook Calendar')}
                    activeOpacity={0.8}
                >
                    <View style={styles.cardItem}>
                        <Image
                            source={require('../../../assets/images/outlookCalendarIcon.png')}
                            style={styles.calendarLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.calendarNameText}>Outlook Calendar</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.calendarCardBtn}
                    onPress={() => handleCalendarSelect('Apple Calendar')}
                    activeOpacity={0.8}
                >
                    <View style={styles.cardItem}>
                        <Image
                            source={require('../../../assets/images/appleCalendarIcon.png')}
                            style={styles.calendarLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.calendarNameText}>Apple Calendar</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SelectCalendarScreen;

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
        paddingBottom: 16,
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
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 12,
    },
    calendarCardBtn: {
        backgroundColor: COLORS.black,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
    },
    cardItem: {
        flexDirection: "row",
    },
    calendarLogo: {
        width: 24,
        height: 24,
        marginRight: 16,
    },
    calendarNameText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '600',
    },
});