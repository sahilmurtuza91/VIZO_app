import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    StatusBar,
    Platform,
    Alert,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../constants/Color";
import { ClientRequestItem } from "../../types/clientRequests";
// import { clientRequestService } from "../../services/clientRequestService";
import { useRequestReviewMutation, useUpdateRequestStatusMutation } from "../../redux/api/clientRequestApi";
import { useAccessConversationMutation } from "../../redux/api/chatApi";

const PropertyRequirementsScreen = ({ navigation, route }: any) => {
    const clientData: ClientRequestItem = route.params?.clientData;

    const [isReviewSent, setIsReviewSent] = useState<boolean>(
        clientData?.isReviewRequested || false
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [requestReview] = useRequestReviewMutation();
    const [updateRequestStatus] = useUpdateRequestStatusMutation();
    const [accessConversation, { isLoading: isStartingChat }] = useAccessConversationMutation();

    const handleStartChat = async () => {
        if (!clientData?.clientUserId) {
            Alert.alert(
                'Chat unavailable',
                'This client request has no linked client account to message yet.'
            );
            return;
        }
        try {
            const conversation = await accessConversation({
                receiverId: clientData.clientUserId,
                clientRequestId: clientData.id,
            }).unwrap();

            navigation.navigate('ChatDetailScreen', {
                clientData: {
                    id: conversation.data._id,
                    name: clientData.name,
                    avatarUrl: clientData.avatarUrl,
                    rawConversationData: conversation.data,
                },
            });
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Could not start chat.');
        }
    };

    const handleMarkCompleted = async () => {
        if (!clientData?.id) return;
        try {
            await updateRequestStatus({ id: clientData.id, status: 'completed' }).unwrap();
            navigation.goBack();
        } catch (error: any) {
            console.log("Failed to mark request completed:", error);
        }
    };

    const handleSendReview = async () => {
        if (!clientData?.id) return;

        setIsSubmitting(true);
        try {
            await requestReview(clientData.id).unwrap();
            setIsReviewSent(true);
        } catch (error) {
            console.log("Failed to send review request");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderAvatar = () => {
        if (clientData?.avatarUrl && clientData.avatarUrl.trim() !== "") {
            return (
                <Image
                    source={{ uri: clientData.avatarUrl }}
                    style={styles.avatar}
                    resizeMode="cover"
                />
            );
        }
        return (
            <Image
                source={{ uri: clientData.avatarUrl }}
                style={styles.avatar}
                resizeMode="cover"
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

            <LinearGradient
                colors={["#FF1616", "#FF7A00", "transparent"]}
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
                        source={require("../../assets/images/backIcon.png")}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Property Requirements</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.cardContainer}>
                    {renderAvatar()}

                    <View style={styles.infoCol}>
                        <View style={styles.nameRow}>
                            <Text style={styles.clientName}>
                                {clientData?.name || "Client Name"}
                            </Text>
                            {clientData?.isVerified && (
                                <Image
                                    source={require("../../assets/images/verified.png")}
                                    style={styles.verifiedIcon}
                                    resizeMode="contain"
                                />
                            )}
                        </View>

                        <View style={styles.intentRow}>
                            <Text style={styles.intentLabel}>Property Intent: </Text>
                            <View style={styles.intentBadge}>
                                <Text style={styles.intentText}>
                                    {clientData?.intent || "N/A"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.locationRow}>
                            <Image
                                source={require("../../assets/images/location.png")}
                                style={styles.locationPinIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.locationText} numberOfLines={1}>
                                {clientData?.distance || "0 mi"} | {clientData?.address || "N/A"}
                            </Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionLabel}>Selected Slot</Text>
                <View style={styles.readOnlyBox}>
                    <Image
                        source={require("../../assets/images/calendar.png")}
                        style={styles.boxIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.boxText}>
                        {clientData?.selectedSlot || "Not Selected"}
                    </Text>
                </View>

                <Text style={styles.sectionLabel}>Budget Range</Text>
                <View style={styles.readOnlyBox}>
                    <Image
                        source={require("../../assets/images/dollar.png")}
                        style={styles.boxIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.boxText}>
                        {clientData?.budgetRange || "Not specified"}
                    </Text>
                </View>
                <Text style={styles.sectionLabel}>Property Type</Text>
                <View style={styles.readOnlyBox}>
                    <Text style={styles.boxText}>
                        {clientData?.propertyType || "Not specified"}
                    </Text>
                </View>

                <Text style={styles.sectionLabel}>Configuration</Text>
                <View style={styles.readOnlyBox}>
                    <Text style={styles.boxText}>
                        {clientData?.configuration || "Not specified"}
                    </Text>
                </View>

                <Text style={styles.sectionLabel}>Preferred Area</Text>
                <View style={styles.readOnlyBox}>
                    <Image
                        source={require("../../assets/images/locationPro.png")}
                        style={styles.boxIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.boxText}>
                        {clientData?.preferredArea || "Not specified"}
                    </Text>
                </View>

                <Text style={styles.sectionLabel}>Client Notes</Text>
                <View style={[styles.readOnlyBox, styles.notesBox]}>
                    <Text style={styles.notesText}>
                        {clientData?.clientNotes || "No notes provided."}
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <View style={styles.topBtnRow}>
                    <TouchableOpacity
                        style={[styles.btn, styles.chatBtn]}
                        activeOpacity={0.8}
                        onPress={handleStartChat}
                        disabled={isStartingChat}
                    >
                        {isStartingChat ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <>
                                <Image
                                    source={require("../../assets/images/messagePro.png")}
                                    style={styles.btnIcon}
                                    resizeMode="contain"
                                />
                                <Text style={styles.btnText}>Start Chat</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, styles.markCompletedBtn]}
                        activeOpacity={0.8}
                        onPress={handleMarkCompleted}
                    >
                        <Text style={styles.btnText}>Mark Completed</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[
                        styles.requestReviewBtn,
                        isReviewSent && styles.requestSentBtn,
                    ]}
                    onPress={handleSendReview}
                    disabled={isReviewSent || isSubmitting}
                    activeOpacity={0.8}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                        <View style={styles.requestContent}>
                            {isReviewSent && (
                                <Image
                                    source={require("../../assets/images/requestSent.png")}
                                    style={styles.requestIcon}
                                    resizeMode="contain"
                                />
                            )}

                            <Text
                                style={[
                                    styles.requestReviewText,
                                    isReviewSent && styles.requestSentText,
                                ]}
                            >
                                {isReviewSent ? "Request Sent" : "Request Review"}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default PropertyRequirementsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    topGlowLayer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 350,
        opacity: 0.25,
    },
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 10,
    },
    backBtn: {
        width: 32,
        height: 32,
        justifyContent: "center",
        marginRight: 8,
    },
    backIcon: {
        width: 18,
        height: 18,
        tintColor: COLORS.white,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "700",
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 20,
    },
    cardContainer: {
        flexDirection: "row",
        backgroundColor: "#141416",
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 10,
        marginRight: 12,
    },
    infoCol: {
        flex: 1,
        justifyContent: "center",
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    clientName: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: "700",
    },
    verifiedIcon: {
        width: 14,
        height: 14,
        marginLeft: 6,
    },
    intentRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
    },
    intentLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
    },
    intentBadge: {
        backgroundColor: COLORS.orange,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 4,
    },
    intentText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: "700",
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    locationPinIcon: {
        width: 12,
        height: 12,
        tintColor: COLORS.orange,
        marginRight: 4,
    },
    locationText: {
        color: COLORS.textMuted,
        fontSize: 11,
        flex: 1,
    },
    sectionLabel: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginBottom: 6,
    },
    readOnlyBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E1E20",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
    },
    boxIcon: {
        width: 16,
        height: 16,
        marginRight: 10,
        tintColor: COLORS.textMuted,
    },
    boxText: {
        color: COLORS.white,
        fontSize: 13,
        flex: 1,
    },
    notesBox: {
        minHeight: 85,
        alignItems: "flex-start",
        paddingVertical: 12,
    },
    notesText: {
        color: COLORS.white,
        fontSize: 13,
        lineHeight: 18,
    },
    bottomBar: {
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === "ios" ? 24 : 16,
        paddingTop: 10,
        backgroundColor: COLORS.black,
    },
    topBtnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    btn: {
        flex: 0.48,
        height: 42,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    btnIcon: {
        width: 16,
        height: 16,
        marginRight: 6,
        tintColor: COLORS.white,
    },
    chatBtn: {
        backgroundColor: COLORS.orange,
    },
    markCompletedBtn: {
        backgroundColor: COLORS.red,
    },
    btnText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "700",
    },
    requestReviewBtn: {
        height: 42,
        backgroundColor: "#222224",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    requestSentBtn: {
        backgroundColor: "#1B221C",
        borderWidth: 1,
        borderColor: "#4EAE67",
    },
    requestReviewText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: "600",
    },
    requestContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    requestIcon: {
        width: 18,
        height: 18,
        marginRight: 8,
    },
    requestSentText: {
        color: "#4EAE67",
    },
});