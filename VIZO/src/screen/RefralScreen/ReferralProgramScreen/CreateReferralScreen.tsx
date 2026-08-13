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

import { COLORS } from "../../../constants/Color";
import { CustomInput } from '../../../components/CustomInput';
import { PropertyType } from '../../../types/referral';
// import { referralService } from '../../../services/referralService';

import { useCreateReferralMutation } from '../../../redux/api/referralApi';

const createReferralSchema = Yup.object().shape({
    location: Yup.string()
        .trim()
        .required("Location is required"),
    clientName: Yup.string()
        .trim()
        .required("Client name is requied"),
    budget: Yup.string()
        .trim()
        .required("Budget is required"),
    referralFee: Yup.string()
        .trim()
        .required("Referral fee is required"),
});

const PROPERTY_TYPES: PropertyType[] = ["Apartment", "Villa", "House", "Land"];


const CreateReferralScreen = ({ navigation }: any) => {
    const [selecetdPropertyType, setSelecetdPropertyType] = useState<PropertyType>("Apartment");
    // const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
    const [createReferral, { isLoading: isSubmiting }] = useCreateReferralMutation();

    const hanldeFormSubmit = async (values: any) => {
        // setIsSubmiting(true);
        // try {
        //     await referralService.createReferral({
        //         customerLocation: values.location,
        //         customerName: values.clientName,
        //         selectedPropertyType: selecetdPropertyType,
        //         customerBudget: values.budget,
        //         referralCommission: values.referralFee,
        //         notes: values.notes,
        //     });
        //     Alert.alert('Success', 'Referral created successfully!', [
        //         { text: 'OK', onPress: () => navigation.goBack() },
        //     ]);
        // } catch (error) {
        //     Alert.alert('Error', 'Failed to create referral.');
        // } finally {
        //     setIsSubmiting(false);
        // }
        try {
            await createReferral({
                customerName: values.clientName,
                customerLocation: values.location,
                propertyType: selecetdPropertyType,
                budget: values.budget ? Number(values.budget) : undefined,
                referralFeePercent: values.referralFee ? Number(values.referralFee) : undefined,
                notes: values.notes,
            }).unwrap();
            Alert.alert('Success', 'Referral created successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error?.data?.message || 'Failed to create referral.');
        }
    };
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
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Image
                        source={require('../../../assets/images/backIcon.png')}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create New Referral</Text>
            </View>
            <Formik
                initialValues={{
                    location: 'Jakarta, Indonesia',
                    clientName: '',
                    budget: '',
                    referralFee: '25',
                    notes: '',
                }}
                validationSchema={createReferralSchema}
                onSubmit={hanldeFormSubmit}
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
                        <Text style={styles.sectionLabel}>Location</Text>
                        <View style={styles.locationInputBox}>
                            <View style={styles.pinBgCircle}>
                                <Image
                                    source={require("../../../assets/images/refLoc.png")}
                                    style={styles.pinIconEmoji}
                                    resizeMode='contain'
                                />
                            </View>
                            <View style={{ flex: 1, marginBottom: -14 }}>
                                <CustomInput
                                    placeholder="Location"
                                    value={values.location}
                                    onChangeText={handleChange('location')}
                                    onBlur={handleBlur('location')}
                                    error={errors.location}
                                    touched={touched.location}
                                />
                            </View>
                        </View>
                        <Text style={styles.sectionLabel}>Client Name</Text>
                        <CustomInput
                            placeholder="Enter here"
                            value={values.clientName}
                            onChangeText={handleChange('clientName')}
                            onBlur={handleBlur('clientName')}
                            error={errors.clientName}
                            touched={touched.clientName}
                        />
                        <Text style={styles.sectionLabel}>Property Type</Text>
                        <View style={styles.propertyPillsRow}>
                            {PROPERTY_TYPES.map((type) => {
                                const isSelected = selecetdPropertyType === type;
                                return (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.typePillBtn,
                                            isSelected
                                                ? styles.pillOrangeActive
                                                : styles.pillGrayInactive,
                                        ]}
                                        onPress={() => setSelecetdPropertyType(type)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.pillText}>{type}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <Text style={styles.sectionLabel}>Budget</Text>
                        <CustomInput
                            placeholder="e.g., 750000"
                            value={values.budget}
                            onChangeText={handleChange('budget')}
                            onBlur={handleBlur('budget')}
                            keyboardType="numeric"
                            error={errors.budget}
                            touched={touched.budget}
                        />
                        <Text style={styles.sectionLabel}>Referral Fee</Text>
                        <CustomInput
                            placeholder="25"
                            value={values.referralFee}
                            onChangeText={handleChange('referralFee')}
                            onBlur={handleBlur('referralFee')}
                            keyboardType="numeric"
                            error={errors.referralFee}
                            touched={touched.referralFee}
                        />
                        <Text style={styles.referralFeeSubtext}>
                            Standard is 25% of your commission
                        </Text>
                        <Text style={[styles.sectionLabel, { marginTop: 14 }]}>
                            Additional Notes
                        </Text>
                        <CustomInput
                            placeholder="Looking for waterfront condo, 2-3 bedrooms"
                            value={values.notes}
                            onChangeText={handleChange('notes')}
                            onBlur={handleBlur('notes')}
                            multiline
                            numberOfLines={3}
                            error={errors.notes}
                            touched={touched.notes}
                        />

                        <TouchableOpacity
                            style={styles.submitGlowBtn}
                            onPress={() => handleSubmit()}
                            disabled={isSubmiting}
                            activeOpacity={0.85}
                        >
                            {isSubmiting ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={styles.submitBtnText}>Submit</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </Formik>
        </SafeAreaView>
    )
}

export default CreateReferralScreen

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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 16,
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
        paddingBottom: 40,
    },

    sectionLabel: {
        color: '#8E8E93',
        fontSize: 12,
        marginBottom: 6,
        fontWeight: '500',
    },

    locationInputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
        height: 52,
        paddingLeft: 12,
        borderWidth: 1,
        borderColor: '#2C2C2E',
        marginBottom: 14,
        overflow: 'hidden',
    },
    pinBgCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    pinIconEmoji: {
        width: 20,
        height: 20,
    },

    propertyPillsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 14,
    },
    typePillBtn: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
    },
    pillOrangeActive: {
        backgroundColor: '#FF6B00',
    },
    pillGrayInactive: {
        backgroundColor: '#2C2C2E',
    },
    pillText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },

    referralFeeSubtext: {
        color: '#8E8E93',
        fontSize: 11,
        marginTop: -8,
    },

    submitGlowBtn: {
        backgroundColor: '#FF3B00',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF3B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 10,
        elevation: 8,
        marginTop: 24,
    },
    submitBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
})