import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants/Color';

interface IncomingCallProps {
    visible: boolean;
    callerName: string;
    calllerAvatar?: string;
    callType: "audio" | "video";
    onAccept: () => void;
    onReject: () => void;
}
const DEFAULT_AVATAR = require('../assets/images/profile.png');
const IncomingCall: React.FC<IncomingCallProps> = ({
    visible,
    callerName,
    calllerAvatar,
    callType,
    onAccept,
    onReject,
}) => {
    return (
        <Modal
            visible={visible}
            transparent animationType='slide'
        >
            <View style={styles.overlay}>
                <View style={styles.cardContainer}>
                    <LinearGradient
                        colors={['#1E1E22', '#121214']}
                        style={styles.cardGradient}
                    >
                        <View style={styles.topGlowRing}>
                            <Image
                                source={calllerAvatar ? { uri: calllerAvatar } : DEFAULT_AVATAR}
                                style={styles.avatarImage}
                            />
                        </View>
                        <Text style={styles.callerNameText}>{callerName || 'unknown user'}</Text>
                        <Text style={styles.callTypeSubtext}>
                            Incoming VIZO {callType === 'video' ? 'Video' : 'Audio'} Call...
                        </Text>
                        <View style={styles.actionsRow}>
                            {/* Decline Button */}
                            <TouchableOpacity style={[styles.actionBtn, styles.declineBtn]} onPress={onReject}>
                                <Text style={styles.btnIcon}>✕</Text>
                                <Text style={styles.btnLabel}>Decline</Text>
                            </TouchableOpacity>

                            {/* Accept Button */}
                            <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={onAccept}>
                                <Text style={styles.btnIcon}>📞</Text>
                                <Text style={styles.btnLabel}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    )
}

export default IncomingCall

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    cardContainer: {
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333338',
    },
    cardGradient: {
        paddingVertical: 32,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    topGlowRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: COLORS.orange,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarImage: {
        width: 86,
        height: 86,
        borderRadius: 43,
    },
    callerNameText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    callTypeSubtext: {
        color: '#8E8E93',
        fontSize: 14,
        marginBottom: 28,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 16,
    },
    actionBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    declineBtn: {
        backgroundColor: '#CC0000',
    },
    acceptBtn: {
        backgroundColor: '#00B050',
    },
    btnIcon: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    btnLabel: {
        color: COLORS.white,
        fontSize: 10,
        marginTop: 2,
        fontWeight: '600',
    },
});