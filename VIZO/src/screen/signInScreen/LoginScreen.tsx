import { useState } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    StatusBar,
    Platform, Alert,
    ActivityIndicator,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, } from 'react-redux';

import { SignInScreenProps } from "../../navigation/types";
import { COLORS } from '../../constants/Color';
import { PrimaryButton } from '../../components/PrimaryButton';
import { CustomInput } from '../../components/CustomInput';
import { CountryCodePicker } from '../../components/CountryCodePicker';
import { socialAuthService } from '../../services/socialAuthService';
import { navigateAfterAuth } from '../../services/authNavigation';

import {
    useLoginWithEmailMutation,
    useLoginWithPhoneMutation,
    useSocialLoginMutation,
} from "../../redux/api/authApi";
import { setCredentials } from '../../redux/slice/authSlice';


const EmailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 character")
        .required("Password is required"),
});

const PhoneSchema = Yup.object().shape({
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number')
        .required('Phone number is required'),
    referralCode: Yup.string().optional(),
})

const LoginScreen = ({ navigation }: SignInScreenProps) => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState<"email" | "phone">("email")
    const [countryCode, setCountryCode] = useState<string>('+91');
    const [rememberMe, setRememberMe] = useState<boolean>(true);

    const [loginWithEmail, { isLoading: isEmailLoading }] = useLoginWithEmailMutation();
    const [loginWithPhone, { isLoading: isPhoneLoading }] = useLoginWithPhoneMutation();
    const [socialLogin] = useSocialLoginMutation();

    const handleTabChange = (tab: "email" | "phone") => {
        setActiveTab(tab);
    }

    const hanldeForgotPassword = () => {
        navigation.navigate("ForgotPassword");
    }

    const handleEmailSignIn = async (values: {
        email: string;
        password: string;
    }) => {
        try {
            const response = await loginWithEmail({
                email: values.email,
                password: values.password,
            }).unwrap();

            dispatch(setCredentials({ token: response.data.token, user: response.data.user, rememberMe }));
            navigateAfterAuth(navigation, response.data.user);
        } catch (error: any) {
            Alert.alert('Login Failed', error?.data?.message || 'Invalid email or password.');
        }
    }

    const handlePhoneSignIn = async (values: {
        phone: string;
        referralCode: string;
    }) => {
        try {
            await loginWithPhone({
                phoneNumber: values.phone,
                countryCode: countryCode,
            }).unwrap();
            navigation.navigate("OtpVerification", {
                target: `${countryCode}${values.phone}`,
                type: "phone",
                flowType: "phone_login",
                countryCode,
                rememberMe,
            });
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to send OTP.');
        }
    }

    const handleSocialAuth = async (
        provider: "google" | "facebook" | "apple"
    ) => {
        try {
            let payload: any = { provider };

            if (provider === "google") {
                const { idToken } = await socialAuthService.signInWithGoogle();
                payload.idToken = idToken;
            } else if (provider === "facebook") {
                const { accessToken } = await socialAuthService.signInWithFacebook();
                payload.accessToken = accessToken;
            } else {
                Alert.alert("Coming Soon", "Apple Login will be configured next.");
                return;
            }

            const response = await socialLogin(payload).unwrap();

            dispatch(
                setCredentials({
                    token: response.data.token,
                    user: response.data.user,
                    rememberMe,
                })
            );

            navigateAfterAuth(navigation, response.data.user);
        } catch (error: any) {
            Alert.alert(
                "Login Failed",
                error?.data?.message ||
                error?.message ||
                "Social login failed."
            );
        }
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
                        Welcome Back!
                    </Text>
                    <Text style={styles.subtitle}>
                        Sign in to manage listings, leads & deals
                    </Text>
                </View>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, activeTab === "email" && styles.activeToggleBtn]}
                        onPress={() => handleTabChange("email")}
                    >
                        <Text style={[styles.toggleText, activeTab === 'email' && styles.activeToggleText]}>
                            Email
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleBtn, activeTab === 'phone' && styles.activeToggleBtn]}
                        onPress={() => handleTabChange("phone")}
                    >
                        <Text style={[styles.toggleText, activeTab === 'phone' && styles.activeToggleText]}>
                            Phone
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab === "email" ? (
                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={EmailSchema}
                        onSubmit={handleEmailSignIn}
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
                                    placeholder="Enter Email"
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    error={errors.email}
                                    touched={touched.email}
                                />

                                <CustomInput
                                    placeholder='Enter password'
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    secureTextEntry
                                    error={errors.password}
                                    touched={touched.password}
                                />

                                <View style={styles.rowBetween}>
                                    <TouchableOpacity
                                        style={styles.checkboxRow}
                                        onPress={() => setRememberMe((prev) => !prev)}
                                    >
                                        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                            {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
                                        </View>
                                        <Text style={styles.rememberText}>Remember me</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={hanldeForgotPassword}>
                                        <Text style={styles.forgotText}>Forgot Password</Text>
                                    </TouchableOpacity>
                                </View>

                                <PrimaryButton
                                    title="sign In"
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
                        validationSchema={PhoneSchema}
                        onSubmit={handlePhoneSignIn}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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
                                    title="Next"
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
                    <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialAuth('google')}>
                        <Image
                            source={require('../../assets/images/google.png')}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialAuth('facebook')}>
                        <Image
                            source={require('../../assets/images/facebook.png')}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialAuth('apple')}>
                        <Image
                            source={require('../../assets/images/appleCalendarIcon.png')}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signUpLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

export default LoginScreen

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
        paddingBottom: 20,
    },
    header: {
        marginBottom: 25,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.white,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.white,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    toggleBtn: {
        flex: 1,
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeToggleBtn: {
        backgroundColor: COLORS.red,
    },
    toggleText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '600',
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
        width: 18,
        height: 18,
        color: "White"
    },
    flexInput: {
        flex: 1,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.textMuted,
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: COLORS.orange,
        borderColor: COLORS.orange,
    },
    checkboxTick: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '700',
        lineHeight: 12,
    },
    rememberText: {
        color: COLORS.white,
        fontSize: 12,
    },
    forgotText: {
        color: COLORS.orange,
        fontSize: 12,
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
        marginTop: 120

    },
    signUpLink: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 13,
        marginTop: 120
    },
})

