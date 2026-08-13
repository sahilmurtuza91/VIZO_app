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
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { COLORS } from '../constants/Color';
import { CustomInput } from './CustomInput';
import { useGetAllLookupDataQuery } from '../redux/api/lookupApi';

interface CreateTicketModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (FormData: any) => void;
    isSubmitting?: boolean;
}


const TicketSchema = Yup.object().shape({
    issueType: Yup.string()
        .required("Please select an issue type"),
    description: Yup.string()
        .trim()
        .required("Description is required"),
});


const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
    visible,
    onClose,
    onSubmit,
    isSubmitting = false,
}) => {
    const [isDropdownOpen, setIsDropdoenOpen] = useState<boolean>(false);

    const { data: lookupData } = useGetAllLookupDataQuery(undefined);
    const ISSUE_TYPES: string[] = lookupData?.issueTypes || [
        'Technical Issue',
        'Upload Issue',
        'Notification Issue',
        'Account Issue',
    ];

    const hadleSubmit = (values: { issueType: string; description: string }, { resetForm }: { resetForm: () => void }) => {
        onSubmit(values);
        resetForm();
        setIsDropdoenOpen(false)
        onClose();
    }

    return (
        <Modal
            visible={visible}
            animationType='fade'
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlayContainer}>
                <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>Create Support Ticket</Text>
                    <Formik
                        initialValues={{
                            issueType: '',
                            description: ''
                        }}
                        validationSchema={TicketSchema}
                        onSubmit={hadleSubmit}
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
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContainer}
                            >
                                <Text style={styles.fieldLabel}>Issue Type</Text>
                                <TouchableOpacity
                                    style={styles.dropdownSelector}
                                    onPress={() => setIsDropdoenOpen(!isDropdownOpen)}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownValueText,
                                            !values.issueType && styles.placeholderText,
                                        ]}
                                    >
                                        {values.issueType || 'Select Issue Type'}
                                    </Text>
                                    <Image
                                        source={require('../assets/images/chevronDown.png')}
                                        style={[
                                            styles.chevronIcon,
                                            isDropdownOpen && styles.chevronRotate,
                                        ]}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                {isDropdownOpen && (
                                    <View style={styles.dropdownListContainer}>
                                        {ISSUE_TYPES.map((type) => (
                                            <TouchableOpacity
                                                key={type}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setFieldValue('issueType', type);
                                                    setIsDropdoenOpen(false);
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.dropdownItemText,
                                                        values.issueType === type && styles.activeDropdownItemText,
                                                    ]}
                                                >
                                                    {type}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                                {touched.issueType && errors.issueType && (
                                    <Text style={styles.errorText}>{errors.issueType}</Text>
                                )}
                                <Text style={styles.fieldLabel}>Description</Text>
                                <CustomInput
                                    placeholder="Describe the activity....."
                                    value={values.description}
                                    onChangeText={handleChange('description')}
                                    onBlur={handleBlur('description')}
                                    multiline
                                    numberOfLines={4}
                                    error={errors.description}
                                    touched={touched.description}
                                />
                                <View style={styles.btnRow}>
                                    <TouchableOpacity
                                        style={styles.glowPrimaryBtn}
                                        onPress={() => handleSubmit()}
                                        disabled={isSubmitting}
                                        activeOpacity={0.85}
                                    >
                                        {isSubmitting ? (
                                            <ActivityIndicator size="small" color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.primaryBtnText}>Submit Ticket</Text>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.greyCancelBtn}
                                        onPress={onClose}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.cancelBtnText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}
                    </Formik>
                </View>
            </View>
        </Modal>
    );
};

export default CreateTicketModal;

const styles = StyleSheet.create({
    overlayContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    modalCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxHeight: '85%',
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    modalTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    scrollContainer: {
        paddingBottom: 10,
    },
    fieldLabel: {
        color: COLORS.textMuted || '#8E8E93',
        fontSize: 12,
        marginBottom: 6,
        fontWeight: '500',
    },
    dropdownSelector: {
        backgroundColor: COLORS.inputBg || '#262628',
        borderRadius: 10,
        height: 52,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.borderDark || '#2C2C2E',
        marginBottom: 14,
    },
    dropdownValueText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    placeholderText: {
        color: COLORS.textMuted || '#8E8E93',
    },
    chevronIcon: {
        width: 12,
        height: 12,
        tintColor: '#8E8E93',
    },
    chevronRotate: {
        transform: [{ rotate: '180deg' }],
    },
    dropdownListContainer: {
        backgroundColor: '#262628',
        borderRadius: 10,
        marginTop: -10,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#3A3A3C',
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3C',
    },
    dropdownItemText: {
        color: '#8E8E93',
        fontSize: 14,
    },
    activeDropdownItemText: {
        color: COLORS.orange || '#FF6B00',
        fontWeight: '700',
    },
    errorText: {
        color: COLORS.red || '#FF3B30',
        fontSize: 11,
        marginTop: -10,
        marginBottom: 10,
    },
    btnRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    glowPrimaryBtn: {
        flex: 1,
        backgroundColor: '#FF3B00',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF3B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    greyCancelBtn: {
        flex: 1,
        backgroundColor: '#2C2C2E',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
})