import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Video from 'react-native-video';
import { useDispatch, useSelector } from 'react-redux';
import { SplashScreenProps } from "../../navigation/types";
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slice/authSlice';

const Spalsh = ({ navigation }: SplashScreenProps) => {
    const dispatch = useDispatch();
    const rememberMe = useSelector((state: RootState) => state.auth.rememberMe);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const token = useSelector((state: RootState) => state.auth.token);
    const isRehydrated = useSelector((state: RootState) => Boolean((state.auth as any)._persist?.rehydrated));

    const [videoEnded, setVideoEnded] = useState(false);

    useEffect(() => {
        if (isAuthenticated && !rememberMe) {
            dispatch(logout());
        }
    }, []);

    useEffect(() => {
        if (!videoEnded || !isRehydrated) return;

        if (isAuthenticated && token && rememberMe) {
            navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
        } else {
            navigation.replace('SplashIntro');
        }
    }, [videoEnded, isRehydrated]);

    const handleVideoEnd = () => {
        setVideoEnded(true);
    }

    return (
        <View style={styles.container}>
            <Video
                source={require('../../assets/videos/introVideo.mp4')}
                style={styles.video}
                resizeMode="cover"
                repeat={false}
                muted={false}
                onEnd={handleVideoEnd}
            />
        </View>
    );
};

export default Spalsh;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
