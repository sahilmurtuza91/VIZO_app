import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    Image,
    StyleSheet,
} from 'react-native';

import { COLORS } from '../constants/Color';

// Generic tap-to-open dropdown used wherever a screen needs to pick from a
// backend-provided options list (designations, license type, state,
// property type, issue type, etc. - all served by GET /lookup) instead of
// a hardcoded local array or a free-text input.

interface SelectFieldProps {
    placeholder: string;
    options: string[];
    value: string | string[]; // string for single-select, string[] for multi-select
    onChange: (value: string | string[]) => void;
    multiSelect?: boolean;
    error?: string;
    touched?: boolean;
}

export const SelectField = ({
    placeholder,
    options,
    value,
    onChange,
    multiSelect = false,
    error,
    touched,
}: SelectFieldProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedValues = multiSelect ? (Array.isArray(value) ? value : []) : [];
    const displayText = multiSelect
        ? (selectedValues.length > 0 ? selectedValues.join(', ') : placeholder)
        : ((value as string) || placeholder);

    const handleSelect = (option: string) => {
        if (multiSelect) {
            const next = selectedValues.includes(option)
                ? selectedValues.filter((item) => item !== option)
                : [...selectedValues, option];
            onChange(next);
        } else {
            onChange(option);
            setIsOpen(false);
        }
    };

    return (
        <View>
            <TouchableOpacity
                style={[styles.field, touched && error ? styles.fieldError : null]}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.8}
            >
                <Text
                    style={[styles.fieldText, !value || (multiSelect && selectedValues.length === 0) ? styles.placeholderText : null]}
                    numberOfLines={1}
                >
                    {displayText}
                </Text>
                <Image
                    source={require('../assets/images/dropdown.png')}
                    style={styles.chevron}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            {touched && error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Modal visible={isOpen} animationType="slide" transparent onRequestClose={() => setIsOpen(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{placeholder}</Text>

                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            style={styles.list}
                            renderItem={({ item }) => {
                                const isSelected = multiSelect
                                    ? selectedValues.includes(item)
                                    : value === item;
                                return (
                                    <TouchableOpacity
                                        style={styles.optionRow}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <Text style={styles.optionText}>{item}</Text>
                                        {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
                                    </TouchableOpacity>
                                );
                            }}
                        />

                        <TouchableOpacity style={styles.closeBtn} onPress={() => setIsOpen(false)}>
                            <Text style={styles.closeBtnText}>{multiSelect ? 'Done' : 'Close'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    field: {
        height: 52,
        backgroundColor: COLORS.inputBg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.borderDark,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    fieldError: {
        borderColor: COLORS.red,
    },
    fieldText: {
        color: COLORS.white,
        fontSize: 14,
        flex: 1,
    },
    placeholderText: {
        color: COLORS.textMuted,
    },
    chevron: {
        width: 14,
        height: 14,
    },
    errorText: {
        color: COLORS.red,
        fontSize: 11,
        marginTop: -10,
        marginBottom: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.cardBg,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
        maxHeight: '70%',
    },
    modalTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    list: {
        maxHeight: 400,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderDark,
    },
    optionText: {
        color: COLORS.white,
        fontSize: 14,
    },
    checkMark: {
        color: COLORS.orange,
        fontWeight: '700',
    },
    closeBtn: {
        marginTop: 12,
        alignSelf: 'center',
    },
    closeBtnText: {
        color: COLORS.orange,
        fontWeight: '600',
    },
});
