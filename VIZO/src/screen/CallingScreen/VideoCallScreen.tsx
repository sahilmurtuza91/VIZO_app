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
import { COLORS } from '../../constants/Color';
import { socketService } from '../../services/socketService';

const DEFAULT_AVATAR = require('../../assets/images/profile.png');

const VideoCallScreen = ({ navigation, route }: any) => {
  const { clientData, isIncoming } = route.params || {};
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState(isIncoming ? 'Connected' : 'Connecting...');

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

      {/* Fullscreen Remote Video Feed Placeholder */}
      <View style={styles.remoteVideoContainer}>
        <Image
          source={clientData?.avatarUrl ? { uri: clientData.avatarUrl } : DEFAULT_AVATAR}
          style={styles.remoteVideoFeed}
          resizeMode="cover"
        />
        <View style={styles.videoOverlayDimmer} />
      </View>

      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.clientNameText}>{clientData?.name || 'Client'}</Text>
          <Text style={styles.timerText}>
            {callStatus === 'Connected' ? formatTimer(callDuration) : callStatus}
          </Text>
        </View>

        <TouchableOpacity style={styles.flipCamBtn}>
          <Text style={{ fontSize: 18 }}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Picture-in-Picture (PiP) Self Preview */}
      <View style={styles.pipContainer}>
        {isCameraOff ? (
          <View style={styles.cameraOffBox}>
            <Text style={{ color: '#8E8E93', fontSize: 11 }}>Camera Off</Text>
          </View>
        ) : (
          <Image
            source={DEFAULT_AVATAR}
            style={styles.pipCameraFeed}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Bottom Floating Pill Dock */}
      <View style={styles.controlsDock}>
        <TouchableOpacity
          style={[styles.dockBtn, isCameraOff && styles.dockBtnActive]}
          onPress={() => setIsCameraOff(!isCameraOff)}
        >
          <Text style={styles.dockBtnIcon}>{isCameraOff ? '🚫' : '📹'}</Text>
          <Text style={styles.dockBtnLabel}>{isCameraOff ? 'Cam Off' : 'Cam On'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dockBtn, isMuted && styles.dockBtnActive]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Text style={styles.dockBtnIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
          <Text style={styles.dockBtnLabel}>{isMuted ? 'Muted' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall}>
          <Text style={styles.endCallIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VideoCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'space-between',
  },
  remoteVideoFeed: {
    width: '100%',
    height: '100%',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  clientNameText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  timerText: {
    color: COLORS.orange,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  flipCamBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(30,30,34,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pipContainer: {
    position: 'absolute',
    top: 90,
    right: 20,
    width: 110,
    height: 155,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.orange,
    backgroundColor: '#1E1E22',
  },
  pipCameraFeed: {
    width: '100%',
    height: '100%',
  },
  cameraOffBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E22',
  },
  controlsDock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 34, 0.88)',
    marginHorizontal: 30,
    marginBottom: 36,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#38383E',
  },
  dockBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  dockBtnActive: {
    backgroundColor: '#44444A',
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
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#CC0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallIcon: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  remoteVideoContainer: {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
},
videoOverlayDimmer: {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
},
});