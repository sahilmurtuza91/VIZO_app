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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../constants/Color';
import { UserProfile } from '../../types/profile';
// import { profileService } from '../../services/profileService';
import { useGetProfileQuery } from '../../redux/api/profileApi';

const ProfileDetailsScreen = ({ navigation }: any) => {
  // const [profile, setProfile] = useState<UserProfile | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const {data:profile, isLoading} = useGetProfileQuery(undefined);

  // useEffect(() => {
  //   fetchProfileDetails();
  // }, []);

  // const fetchProfileDetails = async () => {
  //   setIsLoading(true);
  //   try {
  //     const data = await profileService.getUserProfile();
  //     setProfile(data);
  //   } catch (error) {
  //     console.log('Error fetching profile details:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
        <Text style={styles.headerTitle}>Profile Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/images/Hot.png')}
              style={styles.avatarImage}
            />
            <View style={styles.plusBadge}>
              <Text style={styles.plusIconText}>+</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsGroup}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Agent Name</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
              {profile.name}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bio / Summary</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
              {profile.bio}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone number</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
              {profile.countryCode} {profile.phoneNumber}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
              {profile.email}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Years of Experience</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
              {profile.experience}+ Years
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Specialties</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
              {profile.specialties?.join(', ')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Languages Spoken</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
              {profile.language?.join(', ')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>License Document</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
              {profile.licenseNumber}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editProfileGlowBtn}
          onPress={() => navigation.navigate('EditProfileScreen')}
          activeOpacity={0.85}
        >
          <Text style={styles.editProfileBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetailsScreen;

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
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 30,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 18,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  plusBadge: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B00',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#111113',
  },
  plusIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },

  detailsGroup: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  detailLabel: {
    color: '#8E8E93',
    fontSize: 13,
    flex: 1, 
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1.5,
    marginLeft: 10,
  },

  editProfileGlowBtn: {
    backgroundColor: '#FF3B00',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 10,
  },
  editProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});