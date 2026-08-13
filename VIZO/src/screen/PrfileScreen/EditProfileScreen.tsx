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
import { Formik } from 'formik';
import * as Yup from 'yup';

import { COLORS } from '../../constants/Color';
import { CustomInput } from '../../components/CustomInput';
import { CountryCodePicker } from '../../components/CountryCodePicker';
import { UserProfile, SpecialtyTag } from '../../types/profile';
// import { profileService } from '../../services/profileService';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../redux/api/profileApi';
import { useGetAllLookupDataQuery } from '../../redux/api/lookupApi';

const EditProfileSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required('Agent name is required'),
    bio: Yup.string()
        .trim()
        .required('Bio/Summary is required'),
    phoneNumber: Yup.string()
        .trim()
        .required('Phone number is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    licenseNumber: Yup.string()
        .trim()
        .required('License number is required'),
});

const EditProfileScreen = ({ navigation }: any) => {
    // const [profile, setProfile] = useState<UserProfile | null>(null);
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [isSaving, setIsSaving] = useState<boolean>(false);

    // rtk query: fetch the real profile and expose an update mutation
    const { data: profile, isLoading } = useGetProfileQuery(undefined);
    const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

    // specialties/languages options now come from the backend (GET /lookup)
    // instead of the hardcoded ALL_SPECIALTIES/ALL_LANGUAGES arrays that used
    // to live here.
    const { data: lookupData } = useGetAllLookupDataQuery(undefined);
    const ALL_SPECIALTIES: string[] = lookupData?.specialties || [];
    const ALL_LANGUAGES: string[] = lookupData?.languages || [];

    const [isSpecialtiesOpen, setIsSpecialtiesOpen] = useState<boolean>(false);
    const [isLanguagesOpen, setIsLanguagesOpen] = useState<boolean>(false);

    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [expYears, setExpYears] = useState<number>(8);
    const [countryCode, setCountryCode] = useState<string>('+1');


    useEffect(() => {
        if (profile) {
            setSelectedSpecialties(profile.specialties || []);
            setSelectedLanguages(profile.language || []);
            setExpYears(profile.experience || 8);
            if (profile.countryCode) {
                setCountryCode(profile.countryCode);
            }
        }
    }, [profile]);

    // const fetchProfileData = async () => {
    //     setIsLoading(true);
    //     try {
    //         const data = await profileService.getUserProfile();
    //         setProfile(data);
    //         setSelectedSpecialties(data.specialties || ['Luxury', 'Residential', 'Flats']);
    //         setSelectedLanguages(data.language || ['English', 'Spanish']);
    //         setExpYears(data.experience || 8);
    //     } catch (error) {
    //         console.log('Error fetching profile:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const toggleSpecialty = (tag: string) => {
        if (selectedSpecialties.includes(tag)) {
            setSelectedSpecialties(selectedSpecialties.filter((item) => item !== tag));
        } else {
            setSelectedSpecialties([...selectedSpecialties, tag]);
        }
    };

    const toggleLanguage = (lang: string) => {
        if (selectedLanguages.includes(lang)) {
            setSelectedLanguages(selectedLanguages.filter((item) => item !== lang));
        } else {
            setSelectedLanguages([...selectedLanguages, lang]);
        }
    };

    const handleFormSubmit = async (values: any) => {
        if (selectedSpecialties.length === 0) {
            Alert.alert('Validation Error', 'Please select at least one specialty.');
            return;
        }

        // setIsSaving(true);
        try {
            // backend /profile/edit (updateProfile) expects: name, bio, phone,
            // experienceYears, specialties, languagesSpoken — mapped from the
            // UI's phoneNumber/experience/language field names below.
            const updatedPayload = {
                name: values.name,
                bio: values.bio,
                phone: values.phoneNumber,
                countryCode: countryCode,
                email: values.email,
                experienceYears: expYears,
                specialties: selectedSpecialties,
                languagesSpoken: selectedLanguages,
            };

            // await profileService.updateProfile(updatedPayload);
            await updateProfile(updatedPayload).unwrap();
            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to save changes.');
        }
        // finally {
        //     setIsSaving(false);
        // }
    };

    if (isLoading || !profile) {
        return (
            <View style={styles.loaderCenter}>
                <ActivityIndicator size="large" color={COLORS.orange || '#FF7A00'} />
            </View>
        );
    }

    const initialValues = {
        name: profile.name || '',
        bio: profile.bio || '',
        phoneNumber: profile.phoneNumber || '',
        email: profile.email || '',
        licenseNumber: profile.licenseNumber || 'RE-2024-12345',
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.black || '#000000'} />

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
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <Formik
                initialValues={initialValues}
                validationSchema={EditProfileSchema}
                onSubmit={handleFormSubmit}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                }) => (
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
                                <TouchableOpacity style={styles.plusBadge} activeOpacity={0.8}>
                                    <Text style={styles.plusIconText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <CustomInput
                            placeholder="Agent name"
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            error={errors.name}
                            touched={!!touched.name}
                        />
                        <CustomInput
                            placeholder="Write Your Bio / Summary"
                            value={values.bio}
                            onChangeText={handleChange('bio')}
                            onBlur={handleBlur('bio')}
                            multiline
                            numberOfLines={3}
                            error={errors.bio}
                            touched={!!touched.bio}
                        />
                        <View style={styles.phoneFieldCard}>
                            {/* was a static "+1" Text with no picker behavior */}
                            <CountryCodePicker value={countryCode} onSelect={setCountryCode} />

                            <View style={styles.verticalDivider} />

                            <View style={styles.phoneInputFlex}>
                                <CustomInput
                                    placeholder="567 886 245"
                                    value={values.phoneNumber}
                                    onChangeText={handleChange('phoneNumber')}
                                    onBlur={handleBlur('phoneNumber')}
                                    keyboardType="phone-pad"
                                    error={errors.phoneNumber}
                                    touched={!!touched.phoneNumber}
                                />
                            </View>
                        </View>

                        <CustomInput
                            placeholder="admin@gmail.com"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                            touched={!!touched.email}
                        />
                        <View style={styles.expCounterCard}>
                            <Text style={styles.expLabel}>Year Of Experience</Text>

                            <View style={styles.counterControls}>
                                <TouchableOpacity
                                    style={styles.counterBtn}
                                    onPress={() => setExpYears(Math.max(1, expYears - 1))}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.counterBtnText}>-</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.counterBtn}
                                    onPress={() => setExpYears(expYears + 1)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.counterBtnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.sectionLabel}>Specialties</Text>
                        <TouchableOpacity
                            style={styles.dropdownSelector}
                            onPress={() => setIsSpecialtiesOpen(!isSpecialtiesOpen)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.dropdownPlaceholder}>Choose Specialties</Text>
                            <Image
                                source={require('../../assets/images/dropdown.png')}
                                style={[
                                    styles.dropdownIcon,
                                    isSpecialtiesOpen && styles.dropdownIconRotated
                                ]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        {isSpecialtiesOpen && (
                            <View style={styles.dropdownListMenu}>
                                {ALL_SPECIALTIES.map((tag) => {
                                    const isSelected = selectedSpecialties.includes(tag);
                                    return (
                                        <TouchableOpacity
                                            key={tag}
                                            style={styles.dropdownMenuItem}
                                            onPress={() => toggleSpecialty(tag)}
                                        >
                                            <Text style={[
                                                styles.dropdownMenuText,
                                                isSelected && styles.activeDropdownMenuText
                                            ]}>
                                                {tag}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                        <View style={styles.pillsRow}>
                            {selectedSpecialties.map((tag) => (
                                <LinearGradient
                                    key={tag}
                                    colors={['#FF1616', '#FF7A00']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.pillSelectedGradient}
                                >
                                    <TouchableOpacity onPress={() => toggleSpecialty(tag)} activeOpacity={0.8}>
                                        <Text style={styles.pillText}>{tag}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            ))}
                        </View>
                        <Text style={styles.sectionLabel}>Languages Spoken</Text>
                        <TouchableOpacity
                            style={styles.dropdownSelector}
                            onPress={() => setIsLanguagesOpen(!isLanguagesOpen)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.dropdownPlaceholder}>Choose Language</Text>
                            <Image
                                source={require('../../assets/images/dropdown.png')}
                                style={[
                                    styles.dropdownIcon,
                                    isLanguagesOpen && styles.dropdownIconRotated
                                ]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        {isLanguagesOpen && (
                            <View style={styles.dropdownListMenu}>
                                {ALL_LANGUAGES.map((lang) => {
                                    const isSelected = selectedLanguages.includes(lang);
                                    return (
                                        <TouchableOpacity
                                            key={lang}
                                            style={styles.dropdownMenuItem}
                                            onPress={() => toggleLanguage(lang)}
                                        >
                                            <Text style={[
                                                styles.dropdownMenuText,
                                                isSelected && styles.activeDropdownMenuText
                                            ]}>
                                                {lang}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                        <View style={styles.pillsRow}>
                            {selectedLanguages.map((lang) => (
                                <LinearGradient
                                    key={lang}
                                    colors={['#FF1616', '#FF7A00']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.pillSelectedGradient}
                                >
                                    <TouchableOpacity onPress={() => toggleLanguage(lang)} activeOpacity={0.8}>
                                        <Text style={styles.pillText}>{lang}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            ))}
                        </View>
                        <Text style={styles.sectionLabel}>License Document</Text>
                        <View style={styles.licenseCard}>
                            <View>
                                <Text style={styles.licenseTitle}>License Number</Text>
                                <Text style={styles.licenseSubtitle}>{values.licenseNumber}</Text>
                            </View>
                            <View style={styles.verifiedBadge}>
                                <Text style={styles.verifiedText}>Verified</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.saveBtnWrapper}
                            onPress={() => handleSubmit()}
                            disabled={isSaving}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={['#FF1616', '#FF7A00']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveBtnGradient}
                            >
                                {isSaving ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.saveBtnText}>Save Changes</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default EditProfileScreen;

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
        width: 20,
        height: 20,
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
    },
    avatarSection: {
        alignItems: 'center',
        marginVertical: 16,
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
        bottom: -2,
        alignSelf: 'center',
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FF3B00',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#121214',
    },
    plusIconText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: -2,
    },

    phoneFieldCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#28282B',
        borderRadius: 12,
        height: 52,
        paddingLeft: 14,
        marginBottom: 14,
        overflow: 'hidden',
    },
    countryDropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginRight: 10,
    },
    countryCodeText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '500',
    },
    smallChevronIcon: {
        width: 10,
        height: 10,
        tintColor: '#9A9A9E',
    },
    verticalDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#3A3A3C',
        marginRight: 6,
    },
    phoneInputFlex: {
        flex: 1,
        marginBottom: -14,
    },

    expCounterCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#28282B',
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 14,
    },
    expLabel: {
        color: '#9A9A9E',
        fontSize: 14,
    },
    counterControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    counterBtn: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterBtnText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '600',
    },
    sectionLabel: {
        color: '#9A9A9E',
        fontSize: 13,
        marginBottom: 8,
        marginTop: 4,
    },
    dropdownSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#28282B',
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    dropdownPlaceholder: {
        color: '#66666A',
        fontSize: 14,
    },
    dropdownIcon: {
        width: 14,
        height: 14,
        tintColor: COLORS.textMuted,
    },
    dropdownIconRotated: {
        transform: [{ rotate: '180deg' }],
    },

    dropdownListMenu: {
        backgroundColor: '#222225',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333338',
        overflow: 'hidden',
    },
    dropdownMenuItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2B2B30',
    },
    dropdownMenuText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    activeDropdownMenuText: {
        color: COLORS.orange,
        fontWeight: '600',
    },

    pillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 14,
    },
    pillSelectedGradient: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    pillText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '600',
    },

    licenseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#28282B',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 20,
    },
    licenseTitle: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    licenseSubtitle: {
        color: COLORS.textMuted,
        fontSize: 13,
    },
    verifiedBadge: {
        backgroundColor: '#1B3B2B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    verifiedText: {
        color: '#34C759',
        fontSize: 12,
        fontWeight: '600',
    },

    saveBtnWrapper: {
        marginTop: 10,
        borderRadius: 12,
        shadowColor: COLORS.red,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
    },
    saveBtnGradient: {
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});