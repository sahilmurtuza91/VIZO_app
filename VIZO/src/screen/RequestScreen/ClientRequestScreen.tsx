import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    StatusBar,
    Platform,
    ActivityIndicator,
    Alert,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../constants/Color";
import { ClientRequestItem, PropertyIntent } from "../../types/clientRequests";
// import { clientRequestService } from "../../services/clientRequestService";
import {
    useGetAllRequestQuery,
    useUpdateRequestStatusMutation,
} from "../../redux/api/clientRequestApi";
import { useAccessConversationMutation } from "../../redux/api/chatApi";

const ClientRequestScreen = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

    const { data: request = [], isLoading: isloading } = useGetAllRequestQuery(undefined);
    const [updateRequestStatus] = useUpdateRequestStatusMutation();
    const [accessConversation, { isLoading: isStartingChat }] = useAccessConversationMutation();



    const handleStartChat = async (item: ClientRequestItem) => {
        if (!item.clientUserId) {
            Alert.alert(
                "Chat unavailable"
            );
            return;
        }
        try {
            const conversation = await accessConversation({
                receiverId: item.clientUserId,
                clientRequestId: item.id,
            }).unwrap();

            navigation.navigate('ChatDetailScreen', {
                clientData: {
                    id: conversation.data._id,
                    name: item.name,
                    avatarUrl: item.avatarUrl,
                    rawConversationData: conversation.data,
                },
            });
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Could not start chat.');
        }
    }

    const handleAccept = async (id: string) => {
        try {
            await updateRequestStatus({ id, status: 'approved' }).unwrap();
        } catch (error) {
            console.log("Failed to accept client request");
        }
    };

    const handleCancel = async (id: string) => {
        try {
            await updateRequestStatus({ id, status: 'cancelled' }).unwrap();
        } catch (error) {
            console.log("Failed to cancel client request");
        }
    };

    const filteredData = (request as ClientRequestItem[]).filter(
        (item: ClientRequestItem) => item.status === activeTab
    );

    const renderIntentBadge = (intent: PropertyIntent) => {
        const badgeColors: Record<PropertyIntent, string> = {
            Buy: COLORS.orange || "#FF7A00",
            Rent: "#E06D12",
            Sell: "#E03612",
        };

        return (
            <View
                style={[
                    styles.intentBadge,
                    { backgroundColor: badgeColors[intent] || COLORS.orange },
                ]}
            >
                <Text style={styles.intentText}>{intent}</Text>
            </View>
        );
    };

    const renderAvatar = (avatarUrl?: string) => {
        if (avatarUrl && avatarUrl.trim() !== "") {
            return (
                <Image
                    source={{ uri: avatarUrl }}
                    style={styles.avatar}
                    resizeMode="cover"
                />
            );
        }
        return (
            <Image
                source={require("../../assets/images/Hot.png")}
                style={styles.avatar}
                resizeMode="cover"
            />
        );
    };

    const renderItem = ({ item }: { item: ClientRequestItem }) => (
        <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.9}
            onPress={() => {
                if (item.status === "pending") {
                    navigation.navigate("ClientDetail", { clientData: item });
                } else {
                    navigation.navigate("PropertyRequirements", { clientData: item });
                }
            }}
        >
            <View style={styles.cardHeader}>
                {renderAvatar(item.avatarUrl)}

                <View style={styles.infoCol}>
                    <Text style={styles.clientName}>{item.name}</Text>
                    <View style={styles.intentRow}>
                        <Text style={styles.intentLabel}>Property Intent: </Text>
                        {renderIntentBadge(item.intent)}
                    </View>
                    <View style={styles.locationRow}>
                        <Image
                            source={require("../../assets/images/location.png")}
                            style={styles.pinIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.locationText} numberOfLines={1}>
                            {item.distance} | {item.address}
                        </Text>
                    </View>
                </View>
            </View>

            {activeTab === "pending" ? (
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.btn, styles.acceptBtn]}
                        onPress={() => handleAccept(item.id)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require("../../assets/images/Accept.png")}
                            style={styles.btnIconImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.btnText}>Accept request</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, styles.cancelBtn]}
                        onPress={() => handleCancel(item.id)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require("../../assets/images/reject.png")}
                            style={styles.btnIconImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.btnText}>Cancel request</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.btn, styles.chatBtn]}
                        onPress={() => handleStartChat(item)}
                        activeOpacity={0.8}
                        disabled={isStartingChat}
                    >
                        {isStartingChat ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <>
                                <Image
                                    source={require("../../assets/images/messagePro.png")}
                                    style={styles.btnIconImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.btnText}>Start Chat</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, styles.detailsBtn]}
                        onPress={() =>
                            navigation.navigate("PropertyRequirements", { clientData: item })
                        }
                        activeOpacity={0.8}
                    >
                        <Text style={styles.detailsBtnText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

            <LinearGradient
                colors={["#FF1616", "#FF7A00", "transparent"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.topGlowLayer}
            />

            <View style={styles.header}>
                <Text style={styles.screenTitle}>Client Requests</Text>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tabBtn,
                            activeTab === "pending" && styles.activeTabBtn,
                        ]}
                        onPress={() => setActiveTab("pending")}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "pending" && styles.activeTabText,
                            ]}
                        >
                            Pending
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tabBtn,
                            activeTab === "approved" && styles.activeTabBtn,
                        ]}
                        onPress={() => setActiveTab("approved")}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "approved" && styles.activeTabText,
                            ]}
                        >
                            Approved
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {isloading ? (
                <View style={styles.loaderCenter}>
                    <ActivityIndicator size="large" color={COLORS.orange} />
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            No requests found in {activeTab}
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default ClientRequestScreen;

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
        height: 550,
        opacity: 0.25,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    screenTitle: {
        color: COLORS.white,
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 16,
    },
    tabContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
        marginBottom: 12,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
    },
    activeTabBtn: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.orange,
    },
    tabText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: "600",
    },
    activeTabText: {
        color: COLORS.white,
    },
    loaderCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    emptyText: {
        color: COLORS.textMuted,
        textAlign: "center",
        marginTop: 40,
        fontSize: 14,
    },
    cardContainer: {
        backgroundColor: "#141416",
        borderRadius: 16,
        padding: 14,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
    },
    cardHeader: {
        flexDirection: "row",
        marginBottom: 14,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 12,
    },
    infoCol: {
        flex: 1,
        justifyContent: "center",
    },
    clientName: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 4,
    },
    intentRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    intentLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
    },
    intentBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    intentText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: "700",
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    pinIcon: {
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
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    btn: {
        flex: 0.48,
        height: 40,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    btnIconImage: {
        width: 16,
        height: 16,
        marginRight: 6,
        tintColor: COLORS.white,
    },
    acceptBtn: {
        backgroundColor: COLORS.orange,
    },
    cancelBtn: {
        backgroundColor: COLORS.red,
    },
    chatBtn: {
        backgroundColor: COLORS.orange,
    },
    detailsBtn: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#3A3A3C",
    },
    btnText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "600",
    },
    detailsBtnText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "600",
    },
});