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
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Calendar, DateData } from 'react-native-calendars';

import { COLORS } from '../../../constants/Color';
import { DailyWorkingHour } from '../../../types/workingHours';
// import { workingHoursService } from '../../../services/workingHoursService';

import {
    useGetWorkingHoursQuery,
    useUpdateWorkingHoursMutation,
} from '../../../redux/api/workingHoursApi';

const WorkingHoursScreen = ({ navigation }: any) => {
    const [workingHours, setWorkingHours] = useState<DailyWorkingHour[]>([]);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [isSaving, setIsSaving] = useState<boolean>(false);


    const { data, isLoading } = useGetWorkingHoursQuery(undefined);
    const [updateWorkingHours, { isLoading: isSaving }] = useUpdateWorkingHoursMutation();

    useEffect(() => {
        // fetchData();
        if (data) {
            setWorkingHours(data.hours || []);
            setSelectedDates(data.selectedDates || []);
        }
    }, [data]);

    // const fetchData = async () => {
    //     setIsLoading(true);
    //     try {
    //         const data = await workingHoursService.getWorkingHoursData();
    //         setWorkingHours(data.hours);
    //         setSelectedDates(data.selectedDates);
    //     } catch (error) {
    //         console.log('Failed to load working hours data:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const toggleDayAvailability = (id: string) => {
        setWorkingHours((prevHours) =>
            prevHours.map((item) => {
                if (item.id === id) {
                    const nextState = !item.isAvailable;
                    return {
                        ...item,
                        isAvailable: nextState,
                        startTime: nextState ? '9:00 AM' : '',
                        endTime: nextState ? '9:00 PM' : '',
                    };
                }
                return item;
            })
        );
    };

    const hadleDayPress = (day: DateData) => {
        const dateString = day.dateString;
        if (selectedDates.includes(dateString)) {
            setSelectedDates(selectedDates.filter((d) => d !== dateString));
        } else {
            setSelectedDates([...selectedDates, dateString]);
        }
    };

    const getMarkDates = () => {
        const markObj: any = {};
        selectedDates.forEach((date, index) => {
            if (index === 0) {
                markObj[date] = {
                    selected: true,
                    selectedColor: '#FF6B00',
                    selectedTextColor: '#FFFFFF',
                };
            } else {
                markObj[date] = {
                    selected: true,
                    customStyles: {
                        container: {
                            borderWidth: 1,
                            borderColor: '#FF6B00',
                            borderRadius: 16,
                            backgroundColor: 'transparent',
                        },
                        text: {
                            color: '#FFFFFF',
                            fontWeight: '600',
                        },
                    },
                };
            }
        });
        return markObj;
    };

    const handleSave = async () => {
        // setIsSaving(true);
        // try {
        //     await workingHoursService.saveWorkingHours(workingHours, selectedDates);
        //     Alert.alert('Success', 'Working hours updated successfully!', [
        //         { text: 'OK', onPress: () => navigation.goBack() },
        //     ]);
        // } catch (error) {
        //     console.log('Failed to save working hours:', error);
        //     Alert.alert('Error', 'Failed to save working hours.');
        // } finally {
        //     setIsSaving(false);
        // }

         try {
            await updateWorkingHours({ hours: workingHours, selectedDate: selectedDates }).unwrap();
            Alert.alert('Success', 'Working hours updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            console.log('Failed to save working hours:', error);
            Alert.alert('Error', error?.data?.message || 'Failed to save working hours.');
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
                    <Text style={styles.headerTitle}>Working Hours</Text>
                </View>

                <TouchableOpacity
                    style={styles.syncCalendarBtn}
                    onPress={() => navigation.navigate('SelectCalendarScreen')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.syncBtnText}>Sync Calendar</Text>
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
                    <View style={styles.scheduleCardWrapper}>
                        {workingHours.map((item) => (
                            <View key={item.id} style={styles.scheduleRow}>
                                <View
                                    style={[
                                        styles.dayCircle,
                                        item.isAvailable
                                            ? styles.activeDayCircle
                                            : styles.inactiveDayCircle,
                                    ]}
                                >
                                    <Text style={styles.dayCircleText}>{item.dayShort}</Text>
                                </View>

                                {item.isAvailable ? (
                                    <View style={styles.timeSlotsRow}>
                                        <View style={styles.timeBox}>
                                            <Text style={styles.timeText}>{item.startTime}</Text>
                                        </View>
                                        <Text style={styles.hyphenText}>—</Text>
                                        <View style={styles.timeBox}>
                                            <Text style={styles.timeText}>{item.endTime}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <Text style={styles.unavailableText}>Unavailable</Text>
                                )}

                                <View style={styles.actionIconsGroup}>
                                    {item.isAvailable && (
                                        <TouchableOpacity
                                            onPress={() => toggleDayAvailability(item.id)}
                                            style={styles.iconActionBtn}
                                            activeOpacity={0.7}
                                        >
                                            <Image
                                                source={require('../../../assets/images/Wremove.png')}
                                                style={styles.actionIconSymbol}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        onPress={() => toggleDayAvailability(item.id)}
                                        style={styles.iconActionBtn}
                                        activeOpacity={0.7}
                                    >
                                        <Image
                                            source={require('../../../assets/images/Wadd.png')}
                                            style={styles.actionIconSymbol}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.sectionHeaderTitle}>Set Date Availability</Text>

                    <View style={styles.calendarContainerCard}>
                        <Calendar
                            current={'2026-12-01'}
                            firstDay={1}
                            onDayPress={hadleDayPress}
                            markingType={'custom'}
                            markedDates={getMarkDates()}
                            theme={{
                                calendarBackground: '#161618',
                                textSectionTitleColor: '#8E8E93',
                                dayTextColor: '#FFFFFF',
                                todayTextColor: '#FF6B00',
                                monthTextColor: '#FFFFFF',
                                textMonthFontWeight: '700',
                                textMonthFontSize: 15,
                                textDayFontSize: 12,
                                textDayHeaderFontSize: 12,
                                arrowColor: '#FFFFFF',
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.saveGlowBtn}
                        onPress={handleSave}
                        disabled={isSaving}
                        activeOpacity={0.85}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.saveBtnText}>Save</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default WorkingHoursScreen;

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
    syncCalendarBtn: {
        backgroundColor: '#FF3B00',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
    },
    syncBtnText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    scheduleCardWrapper: {
        backgroundColor: '#161618',
        borderRadius: 16,
        padding: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#242426',
        gap: 12,
    },
    scheduleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dayCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeDayCircle: {
        backgroundColor: '#FF4500',
    },
    inactiveDayCircle: {
        backgroundColor: '#FF4500',
    },
    dayCircleText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
    timeSlotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    timeBox: {
        width: 81,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.textMuted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },
    hyphenText: {
        color: '#8E8E93',
    },
    unavailableText: {
        color: '#8E8E93',
        fontSize: 13,
        flex: 1,
        marginLeft: 14,
    },
    actionIconsGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconActionBtn: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIconSymbol: {
        width: 22,
        height: 22,
    },
    sectionHeaderTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    calendarContainerCard: {
        backgroundColor: '#161618',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#242426',
        paddingBottom: 10,
        overflow: 'hidden',
        marginBottom: 24,
    },
    saveGlowBtn: {
        backgroundColor: '#FF3B00',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF3B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 8,
        elevation: 6,
    },
    saveBtnText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
});