import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { COLORS } from '../constants/Color';
import { useGetAllLookupDataQuery } from '../redux/api/lookupApi';

type Country = {
    name: string;
    isoCode: string;
    phoneCode: string;
    flag?: string;
};

interface CountryCodePickerProps {
    value: string;
    onSelect: (dialCode: string) => void;
}

export const CountryCodePicker = ({ value, onSelect }: CountryCodePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data, isLoading } = useGetAllLookupDataQuery(undefined);
    const countries: Country[] = data?.countries || [];

    const selectedCountry = useMemo(
        () => countries.find((c) => `+${c.phoneCode}` === value),
        [countries, value],
    );

    return (
        <>
            <TouchableOpacity
                style={styles.countryCodeBox}
                activeOpacity={0.8}
                onPress={() => setIsOpen(true)}
            >
                {selectedCountry?.flag ? (
                    <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                ) : null}
                <Text style={styles.countryCodeText}>{value || '+1'}</Text>
                <Image
                    source={require('../assets/images/Arrow - Down 3.png')}
                    style={styles.downArrow}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            <Modal visible={isOpen} animationType="slide" transparent onRequestClose={() => setIsOpen(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Country Code</Text>

                        {isLoading ? (
                            <ActivityIndicator color={COLORS.orange} style={{ marginVertical: 20 }} />
                        ) : (
                            <FlatList
                                data={countries}
                                keyExtractor={(item) => item.isoCode}
                                style={styles.list}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.countryRow}
                                        onPress={() => {
                                            onSelect(`+${item.phoneCode}`);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <Text style={styles.flagText}>{item.flag}</Text>
                                        <Text style={styles.countryName}>{item.name}</Text>
                                        <Text style={styles.countryDial}>+{item.phoneCode}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}

                        <TouchableOpacity style={styles.closeBtn} onPress={() => setIsOpen(false)}>
                            <Text style={styles.closeBtnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
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
    flagText: {
        fontSize: 16,
        marginRight: 6,
    },
    downArrow: {
        width: 18,
        height: 18,
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
    countryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderDark,
    },
    countryName: {
        color: COLORS.white,
        flex: 1,
        fontSize: 14,
    },
    countryDial: {
        color: COLORS.textMuted,
        fontSize: 14,
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
