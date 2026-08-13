import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { COLORS } from "../../constants/Color";
import { ClientRequestItem } from "../../types/clientRequests";
// import { clientRequestService } from "../../services/clientRequestService";

import {
  useGetRequestByIdQuery,
  useUpdateRequestStatusMutation,
} from "../../redux/api/clientRequestApi";

const ClientDetailScreen = ({ navigation, route }: any) => {
  const [clientData, setClientData] = useState<ClientRequestItem | undefined>(
    route.params?.clientData
  );

  // const [isLoading, setIsLoading] = useState<boolean>(!route.params?.clientData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const shouldFetchById = !route.params?.clientData && !!route.params?.id;
  const { data: fetchedRequest, isLoading: isFetching } = useGetRequestByIdQuery(
    route.params?.id,
    { skip: !shouldFetchById }
  );
  const [updateRequestStatus] = useUpdateRequestStatusMutation();

  const isLoading = shouldFetchById ? isFetching : false;

  useEffect(() => {
    if (!clientData && fetchedRequest) {
      setClientData(fetchedRequest);
    }
  }, [fetchedRequest]);

  // useEffect(() => {
  //   if (!clientData && route.params?.id) {
  //     fetchClientDetails(route.params.id);
  //   }
  // }, [route.params]);

  // const fetchClientDetails = async (id: string) => {
  //   setIsLoading(true);
  //   try {
  //     const allData = await clientRequestService.getAllRequests();
  //     const detail = allData.find((item) => item.id === id);
  //     if (detail) {
  //       setClientData(detail);
  //     }
  //   } catch (error) {
  //     console.log("Error fetching client detail:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleAcceptRequest = async () => {
  //   if (!clientData?.id) return;

  //   setIsSubmitting(true);
  //   try {
  //     const success = await clientRequestService.acceptRequest(clientData.id);
  //     if (success) {
  //       navigation.goBack();
  //     }
  //   } catch (error) {
  //     console.log("Error accepting request:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleAcceptRequest = async () => {
    if (!clientData?.id) return;

    setIsSubmitting(true);
    try {
      await updateRequestStatus({ id: clientData.id, status: 'approved' }).unwrap();
      navigation.goBack();
    } catch (error) {
      console.log("Error accepting request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleCancelRequest = async () => {
  //   if (!clientData?.id) return;

  //   setIsSubmitting(true);
  //   try {
  //     const success = await clientRequestService.cancleRequest(clientData.id);
  //     if (success) {
  //       navigation.goBack();
  //     }
  //   } catch (error) {
  //     console.log("Error cancelling request:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleCancelRequest = async () => {
    if (!clientData?.id) return;

    setIsSubmitting(true);
    try {
      await updateRequestStatus({ id: clientData.id, status: 'cancelled' }).unwrap();
      navigation.goBack();
    } catch (error) {
      console.log("Error cancelling request:", error);
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
        source={require("../../assets/images/Hot.png")}
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
        <Text style={styles.headerTitle}>Client Detail</Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={COLORS.orange} />
        </View>
      ) : (
        <>
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
                    style={styles.fieldIcon}
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
                style={styles.calenderIcon}
                resizeMode="contain"
              />
              <Text style={styles.boxText}>
                {clientData?.selectedSlot || "Not Selected"}
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
            <TouchableOpacity
              style={[styles.btn, styles.acceptBtn]}
              onPress={handleAcceptRequest}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Image
                    source={require("../../assets/images/Accept.png")}
                    style={styles.btnIconImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.btnText}>Accept request</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={handleCancelRequest}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Image
                    source={require("../../assets/images/reject.png")}
                    style={styles.btnIconImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.btnText}>Cancel request</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default ClientDetailScreen;

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
    paddingTop: 16,
    paddingBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "700",
  },
  loaderCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#141416",
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  clientName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  verifiedIcon: {
    width: 20,
    height: 20,
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
  locationText: {
    color: COLORS.textMuted,
    fontSize: 11,
    flex: 1,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 8,
  },
  readOnlyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E20",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  fieldIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: COLORS.orange,
  },
  calenderIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: COLORS.textMuted,
  },
  boxText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  notesBox: {
    minHeight: 120,
    alignItems: "flex-start",
  },
  notesText: {
    color: COLORS.white,
    fontSize: 13,
    lineHeight: 18,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 24 : 20,
    paddingTop: 10,
    backgroundColor: COLORS.black,
  },
  btn: {
    flex: 0.48,
    height: 44,
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
  btnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
});