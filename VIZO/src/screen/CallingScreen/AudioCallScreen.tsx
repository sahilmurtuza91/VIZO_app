import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../constants/Color';
import { socketService } from '../../services/socketService';

const DEFAULT_AVATAR = require('../../assets/images/profile.png');

const AudioCallScreen = ({ navigation, route }: any) => {
    const { clientData, isIncoming } = route.params || {};
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [callStatus, setCallStatus] = useState(isIncoming ? 'Connected' : 'Ringing...');

    const targetUserId = clientData?.partnerId || clientData?.id || clientData?._id;

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (callStatus === 'Connected') {
            timer = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [callStatus]);

    useEffect(() => {
        socketService.on('call_answered', () => {
            setCallStatus('Connected');
        });

        socketService.on('call_rejected', () => {
            navigation.goBack();
        });

        socketService.on('call_ended', () => {
            navigation.goBack();
        });

        return () => {
            socketService.off('call_answered');
            socketService.off('call_rejected');
            socketService.off('call_ended');
        };
    }, [navigation]);

    const handleEndCall = () => {
        socketService.emit('end_call', { toUserId: targetUserId });
        navigation.goBack();
    };

    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

            <LinearGradient
                colors={['#FF1616', '#FF7A00', 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.8 }}
                style={styles.topGlowLayer}
            />

            <View style={styles.headerBar}>
                <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.headerBackIcon}>↓</Text>
                </TouchableOpacity>
                <Text style={styles.encryptionBadge}>🔒 End-to-End Encrypted</Text>
            </View>

            <View style={styles.centerAvatarContainer}>
                <View style={styles.pulseOuterCircle}>
                    <View style={styles.pulseInnerCircle}>
                        <Image
                            source={clientData?.avatarUrl ? { uri: clientData.avatarUrl } : DEFAULT_AVATAR}
                            style={styles.mainAvatar}
                        />
                    </View>
                </View>

                <Text style={styles.userNameText}>{clientData?.name || 'Client'}</Text>
                <Text style={styles.callStatusText}>
                    {callStatus === 'Connected' ? `Connected • ${formatTimer(callDuration)}` : callStatus}
                </Text>
            </View>

            {/* Bottom Floating Control Bar */}
            <View style={styles.controlsDock}>
                {/* Mute Button */}
                <TouchableOpacity
                    style={[styles.dockBtn, isMuted && styles.dockBtnActive]}
                    onPress={() => setIsMuted(!isMuted)}
                >
                    <Text style={styles.dockBtnIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
                    <Text style={styles.dockBtnLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
                </TouchableOpacity>

                {/* Speaker Button */}
                <TouchableOpacity
                    style={[styles.dockBtn, isSpeakerOn && styles.dockBtnActive]}
                    onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                >
                    <Text style={styles.dockBtnIcon}>🔊</Text>
                    <Text style={styles.dockBtnLabel}>Speaker</Text>
                </TouchableOpacity>

                {/* Chat Shortcut */}
                <TouchableOpacity style={styles.dockBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.dockBtnIcon}>💬</Text>
                    <Text style={styles.dockBtnLabel}>Chat</Text>
                </TouchableOpacity>

                {/* End Call Button */}
                <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall}>
                    <Text style={styles.endCallIcon}>✕</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default AudioCallScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        justifyContent: 'space-between',
    },
    topGlowLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 480,
        opacity: 0.2,
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    headerBackBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBackIcon: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    encryptionBadge: {
        color: '#8E8E93',
        fontSize: 12,
    },
    centerAvatarContainer: {
        alignItems: 'center',
    },
    pulseOuterCircle: {
        width: 190,
        height: 190,
        borderRadius: 95,
        backgroundColor: 'rgba(255, 110, 0, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    pulseInnerCircle: {
        width: 146,
        height: 146,
        borderRadius: 73,
        borderWidth: 3,
        borderColor: COLORS.orange,
        overflow: 'hidden',
    },
    mainAvatar: {
        width: '100%',
        height: '100%',
    },
    userNameText: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    callStatusText: {
        color: COLORS.orange,
        fontSize: 15,
        fontWeight: '500',
    },
    controlsDock: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1E1E22',
        marginHorizontal: 20,
        marginBottom: 36,
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#2A2A2E',
    },
    dockBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    dockBtnActive: {
        backgroundColor: '#323236',
    },
    dockBtnIcon: {
        fontSize: 20,
        marginBottom: 2,
    },
    dockBtnLabel: {
        color: '#8E8E93',
        fontSize: 10,
    },
    endCallBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#CC0000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    endCallIcon: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
});