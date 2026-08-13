import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
    Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { CustomInput } from './CustomInput';
import { DailyActivityItem, ActivityCategory } from '../types/dailyActivity';

interface AddEditActivityModalProps {
    visible: boolean;
    activityToEdit?: DailyActivityItem | null;
    onClose: () => void;
    onSubmit: (formData: any) => void;
    isSubmitting?: boolean;
}

const CATEGORIES: ActivityCategory[] = [
    'Property Handling',
    'Client Meeting',
    'Follow Up',
];

const ActivitySchema = Yup.object().shape({
    category: Yup.string()
        .required('Select Activity Type'),
    title: Yup.string()
        .trim()
        .required('Description is required'),
    clientName: Yup.string()
        .optional(),
    propertyRef: Yup.string()
        .optional(),
    date: Yup.string()
        .required('Date is required'),
});

const AddEditActivityModal: React.FC<AddEditActivityModalProps> = ({
    visible,
    activityToEdit,
    onClose,
    onSubmit,
    isSubmitting = false,
}) => {
    const isEditMode = !!activityToEdit;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const initialValues = {
        category: (activityToEdit?.category || 'Property Handling') as ActivityCategory,
        title: activityToEdit?.title || '',
        clientName: activityToEdit?.clientName || '',
        propertyRef: activityToEdit?.propertyRef || '',
        date: activityToEdit?.date || 'May 16, 2026',
    };

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlayContainer}>
                <View style={styles.modalBox}>
                    <Text style={styles.modalTitle}>
                        {isEditMode ? 'Edit Activity' : 'Add New Activity'}
                    </Text>

                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={ActivitySchema}
                        onSubmit={(values, { resetForm }) => {
                            onSubmit(values);
                            resetForm();
                            onClose();
                        }}
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
                            <View style={{ flexShrink: 1 }}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.scrollForm}
                                    nestedScrollEnabled
                                >
                                    <Text style={styles.fieldLabel}>Activity Type</Text>
                                    <TouchableOpacity
                                        style={styles.dropdownSelector}
                                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[
                                            styles.dropdownText,
                                            !values.category && styles.placeholderText
                                        ]}>
                                            {values.category || 'Select Activity Type'}
                                        </Text>
                                        <Image
                                            source={require('../assets/images/dropdown.png')}
                                            style={[
                                                styles.dropdownIcon,
                                                isDropdownOpen && styles.dropdownIconRotated
                                            ]}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                    {isDropdownOpen && (
                                        <View style={styles.dropdownList}>
                                            {CATEGORIES.map((cat) => (
                                                <TouchableOpacity
                                                    key={cat}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setFieldValue('category', cat);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    <Text style={[
                                                        styles.dropdownItemText,
                                                        values.category === cat && styles.dropdownItemTextSelected
                                                    ]}>
                                                        {cat}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}

                                    {touched.category && errors.category && (
                                        <Text style={styles.errorText}>{errors.category}</Text>
                                    )}

                                    <Text style={styles.fieldLabel}>Description</Text>
                                    <CustomInput
                                        placeholder="Describe the activity....."
                                        value={values.title}
                                        onChangeText={handleChange('title')}
                                        onBlur={handleBlur('title')}
                                        multiline
                                        numberOfLines={3}
                                        error={errors.title}
                                        touched={touched.title}
                                    />

                                    <Text style={styles.fieldLabel}>Client Name (Optional)</Text>
                                    <CustomInput
                                        placeholder="Enter Client Name"
                                        value={values.clientName}
                                        onChangeText={handleChange('clientName')}
                                        onBlur={handleBlur('clientName')}
                                        error={errors.clientName}
                                        touched={touched.clientName}
                                    />

                                    <Text style={styles.fieldLabel}>
                                        Property Reference (Optional)
                                    </Text>
                                    <CustomInput
                                        placeholder="Enter Property Reference"
                                        value={values.propertyRef}
                                        onChangeText={handleChange('propertyRef')}
                                        onBlur={handleBlur('propertyRef')}
                                        error={errors.propertyRef}
                                        touched={touched.propertyRef}
                                    />

                                    <Text style={styles.fieldLabel}>Date</Text>
                                    <View style={styles.datePickerContainer}>
                                        <TouchableOpacity
                                            style={styles.dateInputWrapper}
                                            onPress={() => setDatePickerVisibility(true)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={[
                                                styles.dateInputText,
                                                !values.date && styles.placeholderText
                                            ]}>
                                                {values.date || 'mm / dd / yyyy'}
                                            </Text>
                                            <Image
                                                source={require('../assets/images/calIcon.png')}
                                                style={styles.calendarIcon}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>

                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible}
                                            mode="date"
                                            onConfirm={(selectedDate: Date) => {
                                                setDatePickerVisibility(false);
                                                setFieldValue('date', formatDate(selectedDate));
                                            }}
                                            onCancel={() => setDatePickerVisibility(false)}
                                        />
                                    </View>
                                    {touched.date && errors.date && (
                                        <Text style={styles.errorText}>{errors.date}</Text>
                                    )}
                                </ScrollView>

                                <View style={styles.btnRow}>
                                    <TouchableOpacity
                                        style={styles.glowBtnWrapper}
                                        onPress={() => handleSubmit()}
                                        disabled={isSubmitting}
                                        activeOpacity={0.85}
                                    >
                                        <LinearGradient
                                            colors={['#FF1616', '#FF7A00']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.primaryBtn}
                                        >
                                            {isSubmitting ? (
                                                <ActivityIndicator size="small" color="#FFFFFF" />
                                            ) : (
                                                <Text style={styles.primaryBtnText}>
                                                    {isEditMode ? 'Save Changes' : '+ Add Activity'}
                                                </Text>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.cancelBtn}
                                        onPress={onClose}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.cancelBtnText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            </View>
        </Modal>
    );
};

export default AddEditActivityModal;

const styles = StyleSheet.create({
    overlayContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'flex-end',
    },
    modalBox: {
        backgroundColor: '#1B1B1E',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '90%',
        borderWidth: 1,
        borderColor: '#2A2A2E',
    },
    modalTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    scrollForm: {
        paddingBottom: 10,
    },
    fieldLabel: {
        color: '#9A9A9E',
        fontSize: 13,
        marginBottom: 8,
        fontWeight: '400',
    },

    dropdownSelector: {
        backgroundColor: '#28282B',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    dropdownText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    placeholderText: {
        color: '#66666A',
    },
    dropdownIcon: {
        width: 16,
        height: 16,
        tintColor: '#9A9A9E',
    },
    dropdownIconRotated: {
        transform: [{ rotate: '180deg' }],
    },
    dropdownList: {
        backgroundColor: '#222225',
        borderRadius: 12,
        marginBottom: 14,
        marginTop: -6,
        borderWidth: 1,
        borderColor: '#333338',
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2B2B30',
    },
    dropdownItemText: {
        color: '#9A9A9E',
        fontSize: 14,
    },
    dropdownItemTextSelected: {
        color: '#FF6B00',
        fontWeight: '600',
    },
    datePickerContainer: {
        marginBottom: 14,
    },
    dateInputWrapper: {
        backgroundColor: '#28282B',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateInputText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    calendarIcon: {
        width: 18,
        height: 18,
        tintColor: '#9A9A9E',
    },

    errorText: {
        color: '#FF453A',
        fontSize: 12,
        marginTop: -6,
        marginBottom: 10,
    },

    btnRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
        marginBottom: Platform.OS === 'ios' ? 10 : 0,
    },
    glowBtnWrapper: {
        flex: 1,
        borderRadius: 12,
        shadowColor: '#FF3B00',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
    },
    primaryBtn: {
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#35353A',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    },
});