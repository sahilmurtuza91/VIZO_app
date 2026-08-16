import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Keyboard,
  Image,
  StyleSheet,
} from 'react-native';

import { COLORS } from '../constants/Color';
import {
  LocationSearchResult,
  createLocationName,
  searchLocation,
  getCurrentLocation,
  CurrentLocation,
} from '../services/locationService';

interface LocationData {
  lat: number;
  lng: number;
  cityLabel: string;
}

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (location: LocationData) => Promise<void> | void;
  onClear: () => Promise<void> | void;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
  onSave,
  onClear,
}) => {
  const [searchText, setSearchText] = useState('');
  const [locationList, setLocationList] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSearchText('');
      setLocationList([]);
      setIsSearching(false);
      setIsGettingLocation(false);
      setIsSaving(false);
    }
  }, [visible]);

  // Direct Search without Debounce
  const handleSearchSubmit = async () => {
    const query = searchText.trim();
    if (query.length < 2) {
      setLocationList([]);
      return;
    }

    try {
      Keyboard.dismiss();
      setIsSearching(true);
      const results = await searchLocation(query);
      setLocationList(results || []);
    } catch (error) {
      console.log('Location search error:', error);
      setLocationList([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = async (item: LocationSearchResult) => {
    try {
      Keyboard.dismiss();
      setIsSaving(true);

      const latitude = Number(item.lat);
      const longitude = Number(item.lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        Alert.alert('Invalid Location', 'This location does not have valid coordinates.');
        return;
      }

      const locationName = createLocationName(item.address);

      await onSave({
        lat: latitude,
        lng: longitude,
        cityLabel: locationName,
      });

      setSearchText('');
      setLocationList([]);
      onClose();
    } catch (error) {
      console.log('Location save error:', error);
      Alert.alert('Error', 'Could not save this location. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (isGettingLocation || isSaving) return;

    setIsGettingLocation(true);
    try {
      const currentLoc: CurrentLocation = await getCurrentLocation();

      await onSave({
        lat: currentLoc.lat,
        lng: currentLoc.lng,
        cityLabel: currentLoc.locationName,
      });

      onClose();
    } catch (error: any) {
      console.log('Current location error:', error);

      if (error?.code === 1) {
        Alert.alert('Permission Denied', 'Please allow location permission in your settings.');
      } else if (error?.code === 2) {
        Alert.alert('Location Unavailable', 'Please turn on your GPS/Location and try again.');
      } else if (error?.code === 3) {
        Alert.alert('Location Timeout', 'Could not get location in time. Please try again.');
      } else {
        Alert.alert('Location Error', 'Could not get your current location. Please try again.');
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleClearLocation = async () => {
    if (isSaving || isGettingLocation) return;

    try {
      setIsSaving(true);
      await onClear();
      setSearchText('');
      setLocationList([]);
      onClose();
    } catch (error) {
      console.log('Clear location error:', error);
      Alert.alert('Error', 'Could not clear your location.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderLocationItem = ({ item }: { item: LocationSearchResult }) => {
    const shortTitle = createLocationName(item.address);

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handleSelectLocation(item)}
        disabled={isSaving || isGettingLocation}
        activeOpacity={0.7}
      >
        <View style={styles.resultContent}>
          <Text style={styles.resultTitle} numberOfLines={1}>
            {shortTitle}
          </Text>
          <Text style={styles.resultAddress} numberOfLines={2}>
            {item.display_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Select Location</Text>
              <Text style={styles.subtitle}>Use GPS or search your location</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Current Location Button*/}
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={handleUseCurrentLocation}
            disabled={isGettingLocation || isSaving}
            activeOpacity={0.8}
          >
            {isGettingLocation ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.currentLocationButtonText}>Use Current Location</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Search Location</Text>

          {/* Search Box  */}
          <View style={styles.searchBox}>
            <Image
              source={require('../assets/images/searchIcon.png')}
              style={styles.searchIconImg}
              resizeMode="contain"
            />

            <TextInput
              style={styles.searchInput}
              placeholder="Search city, area or place"
              placeholderTextColor="#77777C"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              onSubmitEditing={handleSearchSubmit}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="search"
            />

            {isSearching && (
              <ActivityIndicator size="small" color={COLORS.orange} />
            )}

            {searchText.length > 0 && !isSearching && (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                  setLocationList([]);
                }}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.resultsContainer}>
            {searchText.trim().length >= 2 && !isSearching && locationList.length === 0 && (
              <Text style={styles.noResultsText}>No location found</Text>
            )}

            {locationList.length > 0 && (
              <FlatList
                data={locationList}
                keyExtractor={(item, index) => String(item.place_id || index)}
                renderItem={renderLocationItem}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              />
            )}

            {!searchText.trim() && (
              <Text style={styles.helperText}>Search for a city, area or place</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.clearLocationButton}
            onPress={handleClearLocation}
            disabled={isSaving || isGettingLocation}
          >
            <Text style={styles.clearLocationText}>Clear Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LocationPickerModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  sheet: {
    backgroundColor: '#141416',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  title: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#242428',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  currentLocationButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 13,
    minHeight: 50,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentLocationButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  searchBox: {
    height: 50,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  searchIconImg: {
    width: 16,
    height: 16,
    tintColor: '#77777C',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: COLORS.white,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearSearchText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  resultsContainer: {
    marginTop: 10,
    minHeight: 70,
    maxHeight: 260,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#29292C',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
  resultAddress: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  noResultsText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
  helperText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 20,
  },
  clearLocationButton: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 4,
  },
  clearLocationText: {
    color: '#E74C3C',
    fontSize: 13,
    fontWeight: '600',
  },
});