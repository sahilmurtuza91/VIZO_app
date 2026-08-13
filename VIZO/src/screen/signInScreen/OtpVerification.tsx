import { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    StatusBar,
    Platform,
    Alert,
    Animated,
    Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import { OTPVerificationScreenProps } from '../../navigation/types';
import { COLORS } from '../../constants/Color';
import { PrimaryButton } from '../../components/PrimaryButton';

import { useVerifyOtpMutation, useResendOtpMutation } from '../../redux/api/authApi';
import { setCredentials } from '../../redux/slice/authSlice';
import { navigateAfterAuth } from '../../services/authNavigation';

// OTP 4-Digit Validation Schema
const OTPSchema = Yup.object().shape({
    otp1: Yup.string().required('Required'),
    otp2: Yup.string().required('Required'),
    otp3: Yup.string().required('Required'),
    otp4: Yup.string().required('Required'),
});

const useOtpAnimation = () => {
    const animationScale = useRef(new Animated.Value(1)).current;

    const startAnimation = () => {
        animationScale.setValue(1);

        Animated.sequence([
            Animated.timing(animationScale, {
                toValue: 1.12,
                duration: 90,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),

            Animated.timing(animationScale, {
                toValue: 1,
                duration: 120,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    };

    return {
        animationScale,
        startAnimation,
    };
};

const OTPVerificationScreen = ({
    navigation,
    route,
}: OTPVerificationScreenProps) => {
    const dispatch = useDispatch();
    const { target, flowType, password, referralCode, countryCode, rememberMe } = route.params as any;

    const [second, setSecond] = useState<number>(59);
    const [canResend, setCanResend] = useState<boolean>(false);

    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
    const [resendOtp] = useResendOtpMutation();

    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ]

    const {
        animationScale: otpScale,
        startAnimation,
    } = useOtpAnimation();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (second > 0) {
            interval = setInterval(() => {
                setSecond((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [second])

    useEffect(() => {
        const t = setTimeout(() => inputRefs[0].current?.focus(), 350);
        return () => clearTimeout(t);
    }, []);

    const handleResend = async () => {
        // console.log('Resending OTP to:', target);
        // Alert.alert("OTP Resent");

        // setSecond(59);
        // setCanResend(false);
        try {
            const isEmail = target.includes("@");
            const purpose = flowType === 'forgot_password' ? 'forgot_password' : flowType === 'signup' ? 'signup' : 'login';

            await resendOtp({
                identifier: target,
                purpose,
                viaEmail: isEmail,
            }).unwrap();
            Alert.alert('OTP Resent', `A new verification code has been sent to ${target}`);
            setSecond(59);
            setCanResend(false);

        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to resend OTP.');
        }
    };

    const handleSubmitOTP = async (values: {
        otp1: string;
        otp2: string;
        otp3: string;
        otp4: string;
    }) => {
        // const fullOtp = `${values.otp1}${values.otp2}${values.otp3}${values.otp4}`;
        // console.log('Submitted OTP:', fullOtp);

        // if (flowType === "forgot_password") {
        //     navigation.navigate("SetPassword");
        // }
        // else if (flowType === "signup") {
        //     navigation.navigate("ProfileSetup");
        // }
        // else if (flowType === "phone_login") {
        //     navigation.navigate("ProfileSetup");
        // }

        const fullOtp = `${values.otp1}${values.otp2}${values.otp3}${values.otp4}`;
        const purpose = flowType === 'forgot_password' ? 'forgot_password' : flowType === 'signup' ? 'signup' : 'login';

        try {
            const response = await verifyOtp({
                identifier: target,
                otp: fullOtp,
                purpose,
                password,
                countryCode,
                referralCode,
            }).unwrap();

            if (flowType === 'forgot_password') {
                // cast to any to satisfy navigation typing for passing params
                navigation.navigate('SetPassword' as any, { email: target });
            } else {
                if (response.data?.token && response.data?.user) {
                    dispatch(setCredentials({ token: response.data.token, user: response.data.user, rememberMe }));
                }
                navigateAfterAuth(navigation, response.data?.user)
            }
        } catch (error: any) {
            Alert.alert('Verification Failed', error?.data?.message || 'Invalid or expired OTP.');
        }
    };

    const fomateTime = (time: number) => {
        return `00:${time < 10 ? `0${time}` : time}`;
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

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>OTP Verification</Text>
                    <Text style={styles.subtitle}>
                        We have just sent you a verification code via{' '}
                        <Text style={styles.targetText}>{target}</Text>
                    </Text>
                </View>

                <Formik
                    initialValues={{ otp1: '', otp2: '', otp3: '', otp4: '' }}
                    validationSchema={OTPSchema}
                    onSubmit={handleSubmitOTP}
                >
                    {({
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        setFieldTouched,
                    }) => {
                        const hasError =
                            (touched.otp1 && errors.otp1) ||
                            (touched.otp2 && errors.otp2) ||
                            (touched.otp3 && errors.otp3) ||
                            (touched.otp4 && errors.otp4);

                        const fields: Array<'otp1' | 'otp2' | 'otp3' | 'otp4'> = [
                            'otp1', 'otp2', 'otp3', 'otp4',
                        ];

                        const handleDigitChange = (index: number, raw: string) => {
                            const digits = raw.replace(/[^0-9]/g, '');

                            if (digits.length > 1) {
                                // pasted / autofilled full code
                                const chars = digits.slice(0, 4).split('');
                                chars.forEach((ch, i) => setFieldValue(fields[i], ch));
                                for (let i = chars.length; i < 4; i++) setFieldValue(fields[i], '');
                                startAnimation();
                                if (chars.length === 4) {
                                    inputRefs[3].current?.blur();
                                    setTimeout(() => handleSubmit(), 150);
                                } else {
                                    inputRefs[Math.min(chars.length, 3)].current?.focus();
                                }
                                return;
                            }

                            setFieldValue(fields[index], digits);
                            if (digits) {
                                startAnimation();
                                if (index < 3) {
                                    inputRefs[index + 1].current?.focus();
                                } else {
                                    // last box filled - auto-submit like native OTP apps
                                    inputRefs[3].current?.blur();
                                    const allValues = { ...values, [fields[index]]: digits };
                                    const complete = fields.every((f) => allValues[f]);
                                    if (complete) {
                                        setTimeout(() => handleSubmit(), 150);
                                    }
                                }
                            }
                        };

                        const handleKeyPress = (index: number, key: string) => {
                            if (key === 'Backspace' && !values[fields[index]] && index > 0) {
                                inputRefs[index - 1].current?.focus();
                                setFieldValue(fields[index - 1], '');
                            }
                        };

                        return (
                            <View>
                                {/* 4-Digit Box Inputs - auto-advance + auto-submit,
                                    like waiting for an SMS code in a real app */}
                                <Animated.View style={[styles.otpRow, { transform: [{ scale: otpScale }] }]}>
                                    {fields.map((field, index) => (
                                        <TextInput
                                            key={field}
                                            ref={inputRefs[index]}
                                            style={[
                                                styles.otpBox,
                                                values[field] && styles.otpBoxFilled,
                                                touched[field] && errors[field] && styles.otpBoxError,
                                            ]}
                                            keyboardType="number-pad"
                                            textContentType="oneTimeCode"
                                            autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
                                            maxLength={4}
                                            value={values[field]}
                                            onChangeText={(text) => handleDigitChange(index, text)}
                                            onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                                            onBlur={() => setFieldTouched(field, true)}
                                        />
                                    ))}
                                </Animated.View>

                                {hasError && (
                                    <Text style={styles.errorText}>
                                        Please enter complete 4-digit verification code
                                    </Text>
                                )}

                                <View style={styles.timerRow}>
                                    <Text style={styles.timerText}>
                                        {canResend ? 'Code expired' : `Code expires in ${fomateTime(second)}`}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={handleResend}
                                        disabled={!canResend}
                                        activeOpacity={canResend ? 0.7 : 1}
                                    >
                                        <Text style={[styles.resendText, canResend && styles.activeResendText]}>Resend</Text>
                                    </TouchableOpacity>
                                </View>

                                <PrimaryButton
                                    title={isVerifying ? 'Verifying...' : 'Submit'}
                                    onPress={() => handleSubmit()}
                                    style={styles.primaryBtnSpacing}
                                    disabled={isVerifying}
                                />
                            </View>
                        );
                    }}
                </Formik>
            </View>
        </SafeAreaView>
    );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    topGlowLayer: {
        // position: 'absolute',
        // top: -100,
        // alignSelf: 'center',
        // width: 445,
        // height: 380,
        // borderRadius: 200,
        // opacity: 0.35,
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
    content: {
        marginTop: 20,
    },
    header: {
        marginBottom: 25,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.white,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.white,
        lineHeight: 18,
    },
    targetText: {
        color: COLORS.orange,
        fontWeight: '500',
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    otpBox: {
        width: 68,
        height: 60,
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
        textAlign: 'center',
        color: COLORS.white,
        fontSize: 22,
        fontWeight: '700',
    },
    otpBoxError: {
        borderColor: COLORS.red,
    },
    errorText: {
        color: COLORS.red,
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center',
    },
    timerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
    },
    timerText: {
        color: COLORS.white,
        fontSize: 12,
    },
    resendText: {
        color: COLORS.white,
        fontSize: 12,
    },
    activeResendText: {
        color: COLORS.orange,
        fontWeight: 700,
        textDecorationLine: "underline",
    },
    primaryBtnSpacing: {
        marginTop: 10,
    },
    otpBoxFilled: {
        borderColor: COLORS.orange,
        backgroundColor: '#2A1508',
    },
});