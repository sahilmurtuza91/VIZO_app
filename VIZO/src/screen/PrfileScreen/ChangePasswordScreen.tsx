import React, { useState } from 'react';
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
import { useChangePasswordMutation } from '../../redux/api/authApi';

const ChnagePassowrdSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .trim()
        .required("Current password is required"),
    newPassword: Yup.string()
        .min(6, "Password must be at least 6 character")
        .required("New Password is required"),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Password must match")
        .required("Confirm password is required"),
});

const ChangePasswordScreen = ({ navigation }: any) => {
    // const [isSubminting, setIsSubminting] = useState<boolean>(false);
    const [changePassword, { isLoading: isSubminting }] = useChangePasswordMutation();

    const handlePasswordUpdate = async (values: any, { resetForm }: any) => {
        // setIsSubminting(true);
        // try {
        //     await new Promise<void>(resolve => {
        //         setTimeout(() => {
        //             resolve();
        //         }, 300);
        //     });
        //     Alert.alert(
        //         'Success',
        //         'Your password has been updated successfully!',
        //         [
        //             {
        //                 text: 'OK',
        //                 onPress: () => {
        //                     resetForm();
        //                     navigation.goBack();
        //                 },
        //             },
        //         ]
        //     );
        // } catch (error) {
        //     Alert.alert('Error', 'Failed to update password. Please try again.');
        // } finally {
        //     setIsSubminting(false);
        // }

        try {
            await changePassword({
                oldPassword: values.currentPassword,
                newPassword: values.newPassword,
            }).unwrap();
            Alert.alert(
                'Success',
                'Your password has been updated successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            resetForm();
                            navigation.goBack();
                        },
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to update password. Please try again.');
        }
    }

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
                <View style={styles.headerTopRow}>
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
                    <Text style={styles.headerTitle}>Change Password</Text>
                </View>

                <Text style={styles.headerSubtitle}>
                    Keep your account secure by updating{'\n'}your password.
                </Text>
            </View>

            <Formik
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                }}
                validationSchema={ChnagePassowrdSchema}
                onSubmit={handlePasswordUpdate}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                }) => (
                    <View style={styles.formFlexWrapper}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <CustomInput
                                placeholder="Current Password"
                                value={values.currentPassword}
                                onChangeText={handleChange('currentPassword')}
                                onBlur={handleBlur('currentPassword')}
                                secureTextEntry
                                error={errors.currentPassword}
                                touched={touched.currentPassword}
                            />

                            <CustomInput
                                placeholder="New Password"
                                value={values.newPassword}
                                onChangeText={handleChange('newPassword')}
                                onBlur={handleBlur('newPassword')}
                                secureTextEntry
                                error={errors.newPassword}
                                touched={touched.newPassword}
                            />

                            <CustomInput
                                placeholder="Confirm New Password"
                                value={values.confirmNewPassword}
                                onChangeText={handleChange('confirmNewPassword')}
                                onBlur={handleBlur('confirmNewPassword')}
                                secureTextEntry
                                error={errors.confirmNewPassword}
                                touched={touched.confirmNewPassword}
                            />
                        </ScrollView>

                        <View style={styles.bottomBtnContainer}>
                            <TouchableOpacity
                                style={styles.updateGlowBtn}
                                onPress={() => handleSubmit()}
                                disabled={isSubminting}
                                activeOpacity={0.85}
                            >
                                {isSubminting ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.updateBtnText}>Update Password</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>

        </SafeAreaView>
    )
}

export default ChangePasswordScreen;

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
        opacity: 0.25,
    },
    headerBar: {
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 16,
    },
    headerTopRow: {
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
        width: 20,
        height: 20,
        tintColor: COLORS.white,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 22,
        fontWeight: '700',
    },
    headerSubtitle: {
        color: COLORS.white,
        fontSize: 13,
        lineHeight: 18,
        marginTop: 6,
        marginLeft: 40,
    },
    formFlexWrapper: {
        flex: 1,
        justifyContent: 'space-between',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 20,
    },
    bottomBtnContainer: {
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 20,
        paddingTop: 10,
    },
    updateGlowBtn: {
        backgroundColor: '#FF3B00',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF3B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 10,
        elevation: 8,
    },
    updateBtnText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
});