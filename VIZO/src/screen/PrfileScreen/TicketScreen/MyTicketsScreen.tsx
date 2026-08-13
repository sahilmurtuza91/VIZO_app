import React, { useEffect, useState } from 'react';
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
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../../constants/Color';
// import { TicketItem, TicketCategory } from '../../../types/ticket';
import { TicketCategory } from '../../../types/ticket';
// import { ticketService } from '../../../services/ticketService';\

import {
  useGetMyTicketQuery,
  useCreateTicketMutation,
} from "../../../redux/api/ticketApi";
import CreateTicketModal from '../../../components/CreateTicketModal';


const MyTicketsScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<TicketCategory>('Active');
  // const [ticketList, setTicketList] = useState<TicketItem[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // const [isSubmiting, setIsSubminting] = useState<boolean>(false);

  const { data: ticketList = [], isLoading } = useGetMyTicketQuery({
    status: activeTab === 'Active' ? 'In Progress' : 'Resolved'
  });
  const [createTicket, { isLoading: isCreating }] =
    useCreateTicketMutation();

  // useEffect(() => {
  //   fetchTickets();
  // }, []);

  // const fetchTickets = async () => {
  //   setIsLoading(true);

  //   try {
  //     const data = await ticketService.getAllTicket();
  //     setTicketList(data);
  //   } catch (error) {
  //     console.log('Failed to load ticket data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleCreateTicket = async (formData: any) => {
    // setIsSubminting(true);
    // try {
    //   await ticketService.createTicket({
    //     issueType: formData.issueType,
    //     description: formData.description,
    //   });
    //   setIsModalVisible(false);
    //   fetchTickets(); // this is for the new Updated ticket list
    // } catch (error) {
    //   console.log("Faild to create the ticket: ", error);
    // } finally {
    //   setIsSubminting(false);
    // }

    try {
      await createTicket({
        issueType: formData.issueType,
        description: formData.description,
      }).unwrap();

      setIsModalVisible(false);
      Alert.alert('Success', 'Support ticket created successfully!');
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to create ticket.');
    }
  };

  // const filterTicket = ticketList.filter((ticket) => ticket.tabCategory === activeTab);
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
          <Text style={styles.headerTitle}>My Tickets</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../../assets/images/AddBtn.png")}
            style={styles.plusIcon}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View>

      {/* Tabs Row: Active vs Inactive */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'Active' && styles.activeTabBtn]}
          onPress={() => setActiveTab('Active')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Active' && styles.activeTabText,
            ]}
          >
            Active Tickets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'Inactive' && styles.activeTabBtn]}
          onPress={() => setActiveTab('Inactive')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Inactive' && styles.activeTabText,
            ]}
          >
            Inactive Tickets
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loader / Content ScrollView */}
      {isLoading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={COLORS.orange} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {ticketList.length === 0 ? (
            <Text style={styles.emptyText}>
              No {activeTab.toLowerCase()} tickets found.
            </Text>
          ) : (
            ticketList.map((item: any) => {
              const ticketId = item._id || item.id;
              const issueType = item.issueType || "Support Issue";
              const status = item.status || "In Progress";
              const description = item.description || item.descriptiotn || "";
              const ticketNum = item.ticketNumber;

              return (
                <View key={item.id} style={styles.ticketCard}>
                  <View style={styles.cardHeaderRow}>
                  
                    <View style={styles.titleLeftGroup}>
                      <View style={styles.docIconBg}>
                        <Image
                          source={require('../../../assets/images/document-text.png')}
                          style={styles.docIcon}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.ticketTitleText}>{issueType}</Text>
                    </View>

                    
                    <View
                      style={[
                        styles.statusPillBadge,
                        item.status === 'Resolved'
                          ? styles.resolvedPill
                          : styles.inProgressPill,
                      ]}
                    >
                      <Text style={styles.statusPillText}>{status}</Text>
                    </View>
                  </View>

                  <Text style={styles.descriptionText}>{description}</Text>

                  <Text style={styles.footerMetaText}>
                    Ticket {ticketNum} • {item.timeAgo}
                  </Text>
                </View>
              )
            })
          )}
        </ScrollView>
      )}

      <CreateTicketModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateTicket}
        isSubmitting={isCreating}
      />
    </SafeAreaView>
  )
}

export default MyTicketsScreen

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
    height: 380,
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    width: 35,
    height: 35,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabBtn: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B00',
  },
  tabText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  emptyText: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 40,
  },
  ticketCard: {
    backgroundColor: '#161618',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#242426',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  docIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  docIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  ticketTitleText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  statusPillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inProgressPill: {
    backgroundColor: COLORS.orange,
  },
  resolvedPill: {
    backgroundColor: COLORS.orange,
  },
  statusPillText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  descriptionText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  footerMetaText: {
    color: '#8E8E93',
    fontSize: 11,
  },
})