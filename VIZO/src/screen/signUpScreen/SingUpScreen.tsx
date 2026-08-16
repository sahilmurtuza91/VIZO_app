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

import { SignUpScreenProps } from '../../navigation/types';
import { COLORS } from '../../constants/Color';
import { PrimaryButton } from '../../components/PrimaryButton';
import { CustomInput } from '../../components/CustomInput';
import { CountryCodePicker } from '../../components/CountryCodePicker';

import {
    useSignupWithEmailMutation,
    useSignupWithPhoneMutation,
    useSocialLoginMutation,
} from '../../redux/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slice/authSlice';
import { socialAuthService } from '../../services/socialAuthService';
import { navigateAfterAuth } from '../../services/authNavigation';


const EmailSignUpSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email")
        .required("Email is required!"),
    password: Yup.string()
        .min(6, "PAssword must be at least 6 character")
        .required("Password is required!"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Password must matched")
        .required("Confirm password required!"),
    referralCode: Yup.string().optional(),
});

const PhoneSignUpSchema = Yup.object().shape({
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number')
        .required('Phone number is required'),
    referralCode: Yup.string().optional(),
});

const SingUpScreen = ({ navigation }: SignUpScreenProps) => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
    const [countryCode, setCountryCode] = useState<string>('+91');

    const [signupWithEmail, { isLoading: isEmailLoading }] = useSignupWithEmailMutation();
    const [signupWithPhone, { isLoading: isPhoneLoading }] = useSignupWithPhoneMutation();
    const [socialLogin] = useSocialLoginMutation();

    const hanldeTabChnage = (tab: "email" | "phone") => {
        setActiveTab(tab);
    }

    const handleEmailSignUp = async (values: {
        email: string;
        password: string;
        confirmPassword: string;
        referalCode: string;
    }) => {
        try {
            await signupWithEmail({ email: values.email }).unwrap();
            navigation.navigate("OtpVerification", {
                target: values.email,
                type: "email",
                flowType: "signup",
                password: values.password,
                referralCode: values.referalCode,
            });
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to send OTP.');
        }
    }

    const handlePhoneSignUp = async (values: {
        phone: string;
        referalCode?: string;
    }) => {
        try {
            await signupWithPhone({
                phoneNumber: values.phone,
                countryCode,
                referralCode: values.referalCode,
            }).unwrap();
            navigation.navigate("OtpVerification", {
                target: `${countryCode}${values.phone}`,
                type: "phone",
                flowType: "signup",
                countryCode,
                referralCode: values.referalCode,
            });
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to send OTP.');
        }
    };

    const handleSocialAuth = async (provider: "google" | "facebook" | "apple") => {
        try {
            let payload: any = { provider };

            if (provider === 'google') {
                const { idToken } = await socialAuthService.signInWithGoogle();
                payload.idToken = idToken;
            } else if (provider === 'facebook') {
                const { accessToken } = await socialAuthService.signInWithFacebook();
                payload.accessToken = accessToken;
            } else {
                Alert.alert('Coming Soon', 'Apple Sign-In will be configured next.');
                return;
            }

            const response = await socialLogin(payload).unwrap();
            dispatch(setCredentials({ token: response.data.token, user: response.data.user }));
            navigateAfterAuth(navigation, response.data.user);
        } catch (error: any) {
            Alert.alert('Social Sign Up Failed', error?.message || error?.data?.message || 'Failed to sign up.');
        }
    }

    const handleSignInNavigation = () => {
        navigation.navigate("LoginScreen");
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FF1616', '#FF7A00', 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.topGlowLayer}
            />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Welcome
                    </Text>
                    <Text style={styles.subtitle}>Sign up to manage listings, leads & deals</Text>
                </View>

                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, activeTab === 'email' && styles.activeToggleBtn]}
                        onPress={() => hanldeTabChnage("email")}
                    >
                        <Text style={[styles.toggleText, activeTab === 'email' && styles.activeToggleText]}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleBtn, activeTab === 'phone' && styles.activeToggleBtn]}
                        onPress={() => hanldeTabChnage('phone')}
                    >
                        <Text style={[styles.toggleText, activeTab === 'phone' && styles.activeToggleText]}>
                            Phone
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab === "email" ? (
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                            confirmPassword: '',
                            referalCode: '',
                        }}
                        validationSchema={EmailSignUpSchema}
                        onSubmit={handleEmailSignUp}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                        }) => (
                            <View>
                                <CustomInput
                                    placeholder='Enter Email'
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    error={errors.email}
                                    touched={touched.email}
                                />

                                <CustomInput
                                    placeholder="Enter Password"
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    secureTextEntry
                                    error={errors.password}
                                    touched={touched.password}
                                />

                                <CustomInput
                                    placeholder="Enter New Password"
                                    value={values.confirmPassword}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    secureTextEntry
                                    error={errors.confirmPassword}
                                    touched={touched.confirmPassword}
                                />

                                <CustomInput
                                    placeholder='Referral code'
                                    value={values.referalCode}
                                    onChangeText={handleChange("referalCode")}
                                    onBlur={handleBlur("referalCode")}
                                />

                                <PrimaryButton
                                    title='Sign Up'
                                    onPress={handleSubmit}
                                    style={styles.primaryBtnSpacing}
                                    loading={isEmailLoading}
                                />
                            </View>
                        )}
                    </Formik>
                ) : (
                    <Formik
                        initialValues={{ phone: '', referralCode: '' }}
                        validationSchema={PhoneSignUpSchema}
                        onSubmit={handlePhoneSignUp}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                        }) => (
                            <View>
                                <View style={styles.phoneInputRow}>
                                    <CountryCodePicker value={countryCode} onSelect={setCountryCode} />
                                    <View style={styles.flexInput}>
                                        <CustomInput
                                            placeholder="Enter Phone Number"
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
                                    placeholder="Referral Code"
                                    value={values.referralCode}
                                    onChangeText={handleChange('referralCode')}
                                    onBlur={handleBlur('referralCode')}
                                />

                                <PrimaryButton
                                    title="Sign up"
                                    onPress={() => handleSubmit()}
                                    style={styles.primaryBtnSpacing}
                                    loading={isPhoneLoading}
                                />
                            </View>
                        )}
                    </Formik>
                )}
                <Text style={styles.orText}>──── Or login with ────</Text>

                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Image
                            source={require('../../assets/images/google.png')}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Image
                            source={require('../../assets/images/facebook.png')}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Image
                            source={require('../../assets/images/appleCalendarIcon.png')}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={handleSignInNavigation}>
                        <Text style={styles.signUpLink}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SingUpScreen

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
        opacity: 0.35,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20
    },
    header: {
        marginTop: 25,
    },
    title: {
        fontSize: 26,
        fontWeight: 700,
        color: COLORS.white,
        marginBottom: 6
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.white,
    },
    toggleContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        marginTop: 20
    },
    toggleBtn: {
        flex: 1,
        height: 44,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    activeToggleBtn: {
        backgroundColor: COLORS.red,
    },
    toggleText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: 600,
    },
    activeToggleText: {
        color: COLORS.white,
    },
    phoneInputRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
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
        marginVertical: 10,
    },
    orText: {
        color: COLORS.white,
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 14,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 14,
        marginBottom: 20,
    },
    socialBtn: {
        flex: 1,
        height: 52,
        backgroundColor: '#1E1E22',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2C2C30',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: COLORS.textMuted,
        fontSize: 13,
    },
    signUpLink: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 13,
    },
})