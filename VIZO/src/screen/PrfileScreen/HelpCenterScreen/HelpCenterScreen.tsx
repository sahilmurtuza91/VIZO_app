import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Platform,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../../constants/Color';
import ProfileMenuCard from '../../../components/ProfileMenuCard';

const HelpCenterScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#FF1616', '#FF7A00', 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.topGlowLayer}
            />
            <View style={styles.headerBar}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Image
                        source={require('../../../assets/images/backIcon.png')}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help Center</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.menuList}>
                    <ProfileMenuCard
                        title="Help & Support"
                        iconSource={require('../../../assets/images/call.png')}
                        onPress={() => navigation.navigate('HelpAndSupportScreen')}
                    />

                    <ProfileMenuCard
                        title="Terms & Conditions"
                        iconSource={require('../../../assets/images/document-text.png')}
                        onPress={() => navigation.navigate('TermsAndConditionsScreen')}
                    />

                    <ProfileMenuCard
                        title="Privacy Policy"
                        iconSource={require('../../../assets/images/document-text.png')}
                        onPress={() => navigation.navigate('PrivacyPoliciesScreen')}
                    />

                    <ProfileMenuCard
                        title="FAQ"
                        iconSource={require('../../../assets/images/chat.png')}
                        onPress={() => navigation.navigate('FAQScreen')}
                    />
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default HelpCenterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    topGlowLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 550,
        opacity: 0.25,
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 10,
    },
    backBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        marginRight: 8,
    },
    backIcon: {
        width: 18,
        height: 18,
        tintColor: COLORS.white,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 12,
    },
    menuList: {
        marginBottom: 16,
    },
})


