import { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    StatusBar,
    Platform,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ProfileSetupScreenProps } from '../../navigation/types';
import { COLORS } from '../../constants/Color';
import { PrimaryButton } from '../../components/PrimaryButton';
import { CustomInput } from '../../components/CustomInput';
import { CountryCodePicker } from '../../components/CountryCodePicker';
import { SelectField } from '../../components/SelectField';
import { useGetAllLookupDataQuery } from '../../redux/api/lookupApi';
import { useSetupProfileMutation } from '../../redux/api/profileApi';

const profileSetupSchema = Yup.object().shape({
    agentName: Yup.string()
        .required("Agent name is required"),
    reDesignations: Yup.array()
        .min(1, "Select at least one designation")
        .required("Select at least one designation"),
    licenseType: Yup.string()
        .required('License type is required'),
    licenseNumber: Yup.string()
        .required('License number is required'),
    state: Yup.string()
        .required('State is required'),
    bio: Yup.string()
        .min(10, 'Bio must be at least 10 characters')
        .required('Bio is required'),
    phone: Yup.string()
        .required('Phone number is required'),
    email: Yup.string()
        .email('Valid email required')
        .required('Email is required'),
})

const ProfileSetupScreen = ({ navigation }: ProfileSetupScreenProps) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [headShotImage, setHeadShotImage] = useState<string | null>(null);
    const [licenseDoc, setLicenseDoc] = useState<string | null>(null);
    const [countryCode, setCountryCode] = useState<string>('+1');

    // rtk query: dropdown options now come from the backend (GET /lookup)
    // instead of being typed into a free-text field.
    const { data: lookupData } = useGetAllLookupDataQuery(undefined);
    const [setupProfile, { isLoading: isSubmitting }] = useSetupProfileMutation();

    const handlePickProfileImage = () => {
        console.log("Pick Profile image trigger")
        // NOTE: wiring a real image picker (e.g. react-native-image-picker)
        // is a native-module task outside the scope of this backend-connect
        // pass - the upload path below (FormData -> /profile/setup) is real
        // and ready for whatever URI this handler eventually produces.
    }

    const handlePickHeadshotImage = () => {
        console.log('Pick Headshot Image trigger');
    };

    const handleUploadDocument = () => {
        console.log('Upload License Document trigger');
    };

    const handleProfileSubmit = async (values: {
        agentName: string
        reDesignations: string[]
        licenseType: string
        licenseNumber: string
        state: string
        bio: string
        phone: string
        email: string
    }) => {
        try {
            // backend PUT /profile/setup expects multipart/form-data (it uses
            // multer for the profile/headshot/licenseDocument files).
            const formData = new FormData();
            formData.append('agentName', values.agentName);
            formData.append('reDesignations', JSON.stringify(values.reDesignations));
            formData.append('licenseType', values.licenseType);
            formData.append('licenseNumber', values.licenseNumber);
            formData.append('state', values.state);
            formData.append('bio', values.bio);

            if (profileImage) {
                formData.append('profile', { uri: profileImage, name: 'profile.jpg', type: 'image/jpeg' } as any);
            }
            if (headShotImage) {
                formData.append('headshot', { uri: headShotImage, name: 'headshot.jpg', type: 'image/jpeg' } as any);
            }
            if (licenseDoc) {
                formData.append('licenseDocument', { uri: licenseDoc, name: 'license.jpg', type: 'image/jpeg' } as any);
            }

            await setupProfile(formData).unwrap();

            // phone/email aren't part of /profile/setup (they're set during
            // signup) - persisted locally to state only, kept for the UI.
            navigation.navigate("Dashboard");
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to save profile.');
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FF1616', '#FF7A00', 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.topGlowLayer}
            />
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
            >
                <Image
                    source={require("../../assets/images/backIcon.png")}
                    style={styles.backIcon}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile Setup</Text>
                    <Text style={styles.subtitle}>Set up your profile and preferences</Text>
                </View>

                <View style={styles.photoRow}>
                    <View style={styles.photoContainer}>
                        <TouchableOpacity style={styles.avatarCircle} onPress={handlePickProfileImage}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                            ) : (
                                <Image
                                    source={require('../../assets/images/profile.png')}
                                    style={styles.avatarPlaceholderIcon}
                                    resizeMode="contain"
                                />
                            )}
                            <View style={styles.plusBadge}>
                                <Text style={styles.plusText}>+</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.photoContainer}>
                        <TouchableOpacity style={styles.avatarCircle} onPress={handlePickHeadshotImage}>
                            {headShotImage ? (
                                <Image source={{ uri: headShotImage }} style={styles.avatarImage} />
                            ) : (
                                <Image
                                    source={require('../../assets/images/headshot.png')}
                                    style={styles.avatarPlaceholderIcon}
                                    resizeMode="contain"
                                />
                            )}
                            <View style={styles.plusBadge}>
                                <Text style={styles.plusText}>+</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.infoBanner}>
                    <Image
                        source={require('../../assets/images/warning.png')}
                        style={styles.shieldIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.infoBannerText}>
                        Your photo will appear blurred to clients until identity verification is complete.
                    </Text>
                </View>
                <Formik
                    initialValues={{
                        agentName: '',
                        reDesignations: [] as string[],
                        licenseType: '',
                        licenseNumber: '',
                        state: '',
                        bio: '',
                        phone: '',
                        email: '',
                    }}
                    validationSchema={profileSetupSchema}
                    onSubmit={handleProfileSubmit}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                        values,
                        errors,
                        touched,
                    }) => (
                        <View>
                            <CustomInput
                                placeholder="Agent name"
                                value={values.agentName}
                                onChangeText={handleChange('agentName')}
                                onBlur={handleBlur('agentName')}
                                error={errors.agentName}
                                touched={touched.agentName}
                            />

                            {/* was a free-text input - now a real multi-select
                                pulling designations from the backend's /lookup endpoint */}
                            <SelectField
                                placeholder="RE Designations (select all that apply)"
                                options={lookupData?.designations || []}
                                value={values.reDesignations}
                                onChange={(v) => setFieldValue('reDesignations', v)}
                                multiSelect
                                error={errors.reDesignations as any}
                                touched={touched.reDesignations as any}
                            />

                            <SelectField
                                placeholder="License Type"
                                options={lookupData?.licenseTypes || []}
                                value={values.licenseType}
                                onChange={(v) => setFieldValue('licenseType', v)}
                                error={errors.licenseType}
                                touched={touched.licenseType}
                            />

                            <CustomInput
                                placeholder="License number"
                                value={values.licenseNumber}
                                onChangeText={handleChange('licenseNumber')}
                                onBlur={handleBlur('licenseNumber')}
                                error={errors.licenseNumber}
                                touched={touched.licenseNumber}
                            />

                            <SelectField
                                placeholder="State"
                                options={lookupData?.states || []}
                                value={values.state}
                                onChange={(v) => setFieldValue('state', v)}
                                error={errors.state}
                                touched={touched.state}
                            />

                            <CustomInput
                                placeholder="Write a short bio about your experience, specialties, and what clients can expect working with you..."
                                value={values.bio}
                                onChangeText={handleChange('bio')}
                                onBlur={handleBlur('bio')}
                                multiline
                                numberOfLines={4}
                                error={errors.bio}
                                touched={touched.bio}
                            />

                            <TouchableOpacity style={styles.uploadBox} onPress={handleUploadDocument}>
                                <View style={styles.cloudIconContainer}>
                                    <Image
                                        source={require('../../assets/images/cloud_upload.png')}
                                        style={styles.cloudIcon}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text style={styles.uploadTitle}>Upload License Document</Text>
                                <Text style={styles.uploadSubtitle}>
                                    Please take a clear photo with a maximum file size of 2 MB.
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.phoneInputRow}>
                                {/* was a static "+1" Text - now backed by the backend country list */}
                                <CountryCodePicker value={countryCode} onSelect={setCountryCode} />
                                <View style={styles.flexInput}>
                                    <CustomInput
                                        placeholder="Phone number"
                                        value={values.phone}
                                        onChangeText={handleChange('phone')}
                                        onBlur={handleBlur('phone')}
                                        keyboardType="phone-pad"
                                        error={errors.phone}
                                        touched={touched.phone}
                                    />
                                </View>
                            </View>

                            <CustomInput
                                placeholder="Email Address"
                                value={values.email}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={errors.email}
                                touched={touched.email}
                            />

                            <PrimaryButton
                                title="Submit"
                                onPress={() => handleSubmit()}
                                style={styles.primaryBtnSpacing}
                                disabled={isSubmitting}
                            />
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileSetupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    topGlowLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 550,
        opacity: 0.35,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backIcon: {
        width: 20,
        height: 20,
    },
    scrollContent: {
        paddingTop: 10,
        paddingBottom: 30,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        color: COLORS.white,
        marginBottom: 9,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.white,
    },
    photoRow: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        marginBottom: 20,
    },
    photoContainer: {
        alignItems: 'center',
        marginHorizontal: 15,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1.5,
        borderColor: COLORS.red,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        position: 'relative',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
    },
    avatarPlaceholderIcon: {
        width: 52,
        height: 52,
    },
    plusBadge: {
        position: 'absolute',
        top: 65,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.red,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: -2,
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#261412',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#3D1A18',
    },
    shieldIcon: {
        width: 13,
        height: 13,
        marginRight: 10,
        tintColor: COLORS.orange,
    },
    infoBannerText: {
        flex: 1,
        color: COLORS.white,
        // fontWeight:400,
        fontSize: 11,
        lineHeight: 16,
    },
    uploadBox: {
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
        borderStyle: 'dashed',
        padding: 20,
        alignItems: 'center',
        marginVertical: 10,
    },
    cloudIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2C1D18',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    cloudIcon: {
        width: 22,
        height: 22,
        tintColor: COLORS.orange,
    },
    uploadTitle: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    uploadSubtitle: {
        color: COLORS.textMuted,
        fontSize: 11,
        textAlign: 'center',
    },
    phoneInputRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 10,
    },
    countryCodeBox: {
        height: 52,
        backgroundColor: COLORS.inputBg,
        borderRadius: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
    },
    countryCodeText: {
        color: COLORS.white,
        marginRight: 6,
    },
    downArrow: {
        width: 12,
        height: 12,
    },
    flexInput: {
        flex: 1,
    },
    primaryBtnSpacing: {
        marginVertical: 15,
    },
})