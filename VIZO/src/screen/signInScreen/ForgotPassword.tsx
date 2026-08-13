import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    StatusBar,
    Platform,
    Alert,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from "yup";

import { ForgotPasswordScreenProps } from "../../navigation/types";
import { COLORS } from "../../constants/Color";
import { CustomInput } from '../../components/CustomInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useForgotPasswordMutation } from '../../redux/api/authApi';


const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email")
        .required("Email is required"),
});

const ForgotPassword = ({ navigation }: ForgotPasswordScreenProps) => {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSendOtp = async (values: {
        email: string
    }) => {
        // console.log('Send OTP to Email:', values.email);
        // navigation.navigate("OtpVerification", {
        //     target: values.email,
        //     type: "email",
        //     flowType:"forgot_password"
        // })
        try {
            await forgotPassword({ email: values.email }).unwrap();
            navigation.navigate("OtpVerification", {
                target: values.email,
                type: "email",
                flowType: "forgot_password"
            })
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to send OTP.');
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

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>
                        Please provide your email address to reset your password
                    </Text>
                </View>

                <Formik
                    initialValues={{ email: '' }}
                    validationSchema={ForgotPasswordSchema}
                    onSubmit={handleSendOtp}
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
                                placeholder='Email Address'
                                value={values.email}
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                error={errors.email}
                                touched={touched.email}
                            />
                            <PrimaryButton
                                title='Send Otp'
                                onPress={handleSubmit}
                                style={styles.primaryBtnSpacing}
                            />
                        </View>
                    )}

                </Formik>
            </View>
        </SafeAreaView>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    topGlowLayer: {
        // position: "absolute",
        // top: -100,
        // alignSelf: "center",
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
        justifyContent: "center",
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
        fontWeight: 700,
        color: COLORS.white,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.white,
        lineHeight: 18,
    },
    primaryBtnSpacing: {
        marginTop: 15,
    },
});