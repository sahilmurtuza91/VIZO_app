import { StyleSheet, View } from 'react-native';
import React, {useEffect} from 'react';
import Video from 'react-native-video';
import { useDispatch, useSelector } from 'react-redux';
import { SplashScreenProps } from "../../navigation/types";
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slice/authSlice';

const Spalsh = ({ navigation }: SplashScreenProps) => {
    const dispatch = useDispatch();
    const rememberMe = useSelector((state: RootState) => state.auth.rememberMe);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated && !rememberMe) {
            dispatch(logout());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleVideoEnd = () => {
        navigation.replace("SplashIntro")
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
