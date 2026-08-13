import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    StatusBar,
    Platform,
} from 'react-native';
import { IntroScreenProps } from '../../navigation/types';
import { COLORS } from '../../constants/Color';

const SplashIntro = ({ navigation }: IntroScreenProps) => {
    return (
        <ImageBackground
            source={require('../../assets/images/IntroScreen.jpg')}
            style={styles.bg}
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.bottomSection}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Real-Time</Text>
                            <Text style={styles.subtitle}>
                                Real Estate <Text style={styles.lightText}>Starts Here</Text>
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('LoginScreen')}
                        >
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>

                        <Text style={styles.orText}>──── Or login with ────</Text>

                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Image
                                    source={require('../../assets/images/google.png')}
                                    style={styles.socialIcon}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Image
                                    source={require('../../assets/images/facebook.png')}
                                    style={styles.socialIcon}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Image
                                    source={require('../../assets/images/appleCalendarIcon.png')}
                                    style={styles.socialIcon}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.terms}>
                            By creating an account or signing in, you agree to our{' '}
                            <Text style={styles.link}>Terms of Service</Text> and{' '}
                            <Text style={styles.link}>Privacy Policy</Text>.
                        </Text>
                    </View>
                </SafeAreaView>
            </View>
        </ImageBackground>
    );
};

export default SplashIntro;

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    logo: {
        width: 150,
        height: 50,
    },
    bottomSection: {
        marginBottom: 20,
    },
    textContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '400',
        color: COLORS.white,
    },
    subtitle: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.white,
    },
    lightText: {
        fontWeight: '300',
    },
    button: {
        width: '100%',
        height: 54,
        backgroundColor: COLORS.red,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
    orText: {
        color: COLORS.textMuted,
        textAlign: 'center',
        marginVertical: 15,
        fontSize: 14,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 20,
    },
    socialBtn: {
        width: 106,
        height: 48,
        backgroundColor: COLORS.inputBg,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
    terms: {
        color: COLORS.textMuted,
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 16,
    },
    link: {
        color: COLORS.white,
        textDecorationLine: 'underline',
    },
});
