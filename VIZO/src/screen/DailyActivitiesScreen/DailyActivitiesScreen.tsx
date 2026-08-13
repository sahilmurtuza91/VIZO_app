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

import { COLORS } from '../../constants/Color';
import { DailyActivityItem } from '../../types/dailyActivity';
// import { dailyActivityService } from '../../services/dailyActivityService';
import AddEditActivityModal from '../../components/AddEditActivityModal';

import {
    useGetActivitiesQuery,
    useCreateActivityMutation,
    useUpdateActivityMutation,
    useDeleteActivityMutation,
    useMarkActivityCompleteMutation,
} from "../../redux/api/dailyActivityApi";

const DailyActivitiesScreen = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState<'Ongoing' | 'Completed'>('Ongoing');
    // const [activities, setActivities] = useState<DailyActivityItem[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // const [activityToEdit, setActivityToEdit] = useState<DailyActivityItem | null>(null);
    const [activityToEdit, setActivityToEdit] = useState<any | null>(null);
    // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // rtk query
    const { data: activities = [], isLoading, refetch } = useGetActivitiesQuery({ status: activeTab });
    const [createActivity, { isLoading: isCreating }] = useCreateActivityMutation();
    const [updateActivity, { isLoading: isUpdating }] = useUpdateActivityMutation();
    const [deleteActivity] = useDeleteActivityMutation();
    const [markCompleteActivity] = useMarkActivityCompleteMutation();

    // useEffect(() => {
    //     fetchActivities();
    // }, []);

    // const fetchActivities = async () => {
    //     setIsLoading(true);
    //     try {
    //         const data = await dailyActivityService.getAllActivity();
    //         setActivities(data);
    //     } catch (error) {
    //         console.log('Error fetching activities:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleToggleStatus = async (id: string) => {
        // try {
        //     await markCompleteActivity(id).unwrap();
        // } catch (error: any) {
        //     Alert.alert('Error', error?.data?.message || 'Failed to update status');
        // }

        try {
            await markCompleteActivity(id).unwrap();
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to update status');
        }
    };

    const handleDeleteActivity = (id: string) => {
        Alert.alert('Delete Activity', 'Are you sure you want to delete this activity?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    // try {
                    //     await deleteActivity(id).unwrap();
                    // } catch (error: any) {
                    //     Alert.alert('Error', error?.data?.message || 'Failed to delete activity');
                    // }

                    try {
                        await deleteActivity(id).unwrap();
                    } catch (error: any) {
                        Alert.alert('Error', error?.data?.message || 'Failed to delete activity');
                    }
                },
            },
        ]);
    };

    const handleModalSubmit = async (formData: any) => {
        // setIsSubmitting(true);
        // try {
        //     if (activityToEdit) {
        //         await dailyActivityService.updateActivity(activityToEdit.id, formData);
        //     } else {
        //         await dailyActivityService.createActivity(formData);
        //     }
        //     setIsModalVisible(false);
        //     setActivityToEdit(null);
        //     fetchActivities();
        // } catch (error) {
        //     console.log('Error saving activity:', error);
        // } finally {
        //     setIsSubmitting(false);
        // }

        try {
            if (activityToEdit) {
                const editId = (activityToEdit as any)._id || activityToEdit.id;
                await updateActivity({ id: editId, ...formData }).unwrap();
            } else {
                await createActivity(formData).unwrap();
            }

            setIsModalVisible(false);
            setActivityToEdit(null);
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to save activity');
        }
    };

    // const filteredActivities = activities.filter((act) => act.status === activeTab);

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
                            source={require('../../assets/images/backIcon.png')}
                            style={styles.backIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Daily Activities</Text>
                </View>

                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => {
                        setActivityToEdit(null);
                        setIsModalVisible(true);
                    }}
                    activeOpacity={0.8}
                >
                    <Image
                        source={require("../../assets/images/AddBtn.png")}
                        style={styles.addBtnIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'Ongoing' && styles.activeTabBtn]}
                    onPress={() => setActiveTab('Ongoing')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.tabText, activeTab === 'Ongoing' && styles.activeTabText]}>
                        Ongoing
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'Completed' && styles.activeTabBtn]}
                    onPress={() => setActiveTab('Completed')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loaderCenter}>
                    <ActivityIndicator size="large" color={COLORS.orange} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {activities.length === 0 ? (
                        <Text style={styles.emptyText}>No {activeTab.toLowerCase()} activities found.</Text>
                    ) : (
                        activities.map((act: any) => {
                            const actId = act._id || act.id;
                            const formattedDate = act.date ? new Date(act.date).toLocaleDateString() : 'N/A';

                            return (
                                <View key={act.id} style={styles.card}>

                                    <View style={styles.cardMainContent}>

                                        <View style={styles.clockCircleBg}>
                                            <Image
                                                source={require("../../assets/images/titleIcon.png")}
                                                style={styles.clockIcon}
                                                resizeMode="contain"
                                            />
                                        </View>

                                        <View style={styles.cardRightContent}>
                                            <View style={styles.pillsGroup}>
                                                <LinearGradient
                                                    colors={['#FF1616', '#FF7A00']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={styles.categoryPill}
                                                >
                                                    <Text style={styles.categoryPillText}>{act.category}</Text>
                                                </LinearGradient>

                                                <View style={styles.statusPill}>
                                                    <Text style={styles.statusPillText}>{act.status}</Text>
                                                </View>
                                            </View>

                                            <Text style={styles.cardTitle}>{act.title}</Text>

                                            {act.clientName ? (
                                                <Text style={styles.metaText}>Client: {act.clientName}</Text>
                                            ) : null}
                                            {act.propertyRef ? (
                                                <Text style={styles.metaText}>Property: {act.propertyRef}</Text>
                                            ) : null}

                                            <View style={styles.calText}>
                                                <Image
                                                    source={require("../../assets/images/calIcon.png")}
                                                    style={styles.calIconBtn}
                                                    resizeMode="contain"
                                                />
                                                <Text style={styles.dateText}>
                                                    {/* {act.date} • Updated {act.updatedTime} */}
                                                    {formattedDate}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.cardDividerLine} />

                                    <View style={styles.cardActionRow}>
                                        {act.status === 'Ongoing' ? (
                                            <TouchableOpacity
                                                style={styles.glowBtnWrapper}
                                                onPress={() => handleToggleStatus(actId)}
                                                activeOpacity={0.8}
                                            >
                                                <LinearGradient
                                                    colors={['#FF1616', '#FF7A00']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={styles.markCompletedBtn}
                                                >
                                                    <Text style={styles.markCompletedBtnText}>Mark as Completed</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.completedBadge}>
                                                <Text style={styles.completedBadgeText}>Completed</Text>
                                            </View>
                                        )}

                                        <View style={styles.iconGroup}>
                                            <TouchableOpacity
                                                style={styles.editIconBtn}
                                                onPress={() => {
                                                    setActivityToEdit(act);
                                                    setIsModalVisible(true);
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                <Image
                                                    source={require("../../assets/images/EditBtn.png")}
                                                    style={styles.editIconImg}
                                                    resizeMode="contain"
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.deleteIconBtn}
                                                onPress={() => handleDeleteActivity(actId)}
                                                activeOpacity={0.7}
                                            >
                                                <Image
                                                    source={require("../../assets/images/DelBtn.png")}
                                                    style={styles.deleteIconImg}
                                                    resizeMode="contain"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    )}
                </ScrollView>
            )}
            <AddEditActivityModal
                visible={isModalVisible}
                activityToEdit={activityToEdit}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleModalSubmit}
                isSubmitting={isCreating || isUpdating}
            />
        </SafeAreaView>
    );
};

export default DailyActivitiesScreen;

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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 10,
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
    addBtn: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addBtnIcon: {
        width: 35,
        height: 35,
        borderRadius: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTabBtn: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.orange,
    },
    tabText: {
        color: COLORS.textMuted,
        fontSize: 15,
        fontWeight: '600',
    },
    activeTabText: {
        color: COLORS.white,
    },
    loaderCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    emptyText: {
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: 40,
    },

    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#26262A',
    },
    cardMainContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    clockCircleBg: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#352312',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    clockIcon: {
        width: 20,
        height: 20,
    },
    cardRightContent: {
        flex: 1,
    },
    pillsGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    categoryPill: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    categoryPillText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '600',
    },
    statusPill: {
        backgroundColor: '#35353A',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusPillText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '500',
    },
    cardTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 24,
    },
    metaText: {
        color: '#9A9A9E',
        fontSize: 14,
        marginBottom: 4,
    },
    calText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    dateText: {
        color: '#9A9A9E',
        fontSize: 13,
        marginLeft: 8,
    },
    calIconBtn: {
        width: 14,
        height: 14,
        tintColor: '#9A9A9E',
    },
    cardDividerLine: {
        height: 1,
        backgroundColor: '#2A2A2E',
        marginVertical: 14,
    },
    cardActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    glowBtnWrapper: {
        flex: 1,
        marginRight: 10,
        borderRadius: 12,
        shadowColor: '#FF3B00',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
    },
    markCompletedBtn: {
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markCompletedBtnText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
    completedBadge: {
        flex: 1,
        backgroundColor: '#2C2C2E',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    completedBadgeText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    iconGroup: {
        flexDirection: 'row',
        gap: 10,
    },
    editIconBtn: {
        width: 48,
        height: 48,
        backgroundColor: '#2B2C30',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIconImg: {
        width: 18,
        height: 18,
        tintColor: '#FFFFFF',
    },
    deleteIconBtn: {
        width: 48,
        height: 48,
        backgroundColor: '#3A1C20',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIconImg: {
        width: 18,
        height: 18,
        tintColor: '#FF453A',
    },
});