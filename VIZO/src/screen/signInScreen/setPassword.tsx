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
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { SetPasswordScreenProps } from '../../navigation/types';
import { COLORS } from '../../constants/Color';
import { PrimaryButton } from '../../components/PrimaryButton';
import { CustomInput } from '../../components/CustomInput';
import { useResetPasswordMutation } from '../../redux/api/authApi';
import { setCredentials } from '../../redux/slice/authSlice';

const setPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, "Password must be at least 6 character")
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "password must match")
        .required('Confirm Password is required'),
});

const setPassword = ({ navigation, route }: SetPasswordScreenProps) => {
    const dispatch = useDispatch();
    const email = route.params?.email;

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleSavePassword = async (values: {
        password: string;
        confirmPassword: string;
    }) => {
        // console.log("New password: ", values.password);
        // navigation.navigate("LoginScreen");
        if (!email) {
            Alert.alert('Error', 'Missing account email. Please restart the forgot password flow.');
            return;
        }
        try {
            const response = await resetPassword({
                email,
                newPassword: values.password,
            }).unwrap();

            if (response.data?.token && response.data?.user) {
                dispatch(setCredentials({ token: response.data.token, user: response.data.user }));
            }
            Alert.alert('Success', 'Password updated successfully!');
            navigation.navigate("LoginScreen");
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to set password.');
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
                    <Text style={styles.title}>Set Password</Text>
                    <Text style={styles.subtitle}>
                        Create a secure password to protect your account.
                    </Text>
                </View>

                <Formik
                    initialValues={{ password: '', confirmPassword: '' }}
                    validationSchema={setPasswordSchema}
                    onSubmit={handleSavePassword}
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
                                placeholder='Set password'
                                value={values.password}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                secureTextEntry
                                error={errors.password}
                                touched={touched.password}
                            />

                            <CustomInput
                                placeholder='Confirm Password'
                                value={values.confirmPassword}
                                onChangeText={handleChange("confirmPassword")}
                                onBlur={handleBlur("confirmPassword")}
                                secureTextEntry
                                error={errors.confirmPassword}
                                touched={touched.confirmPassword}
                            />

                            <PrimaryButton
                                title='Save'
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

export default setPassword

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