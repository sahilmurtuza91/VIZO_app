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

import { COLORS } from "../../../constants/Color";

export default function HelpAndSupportScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={"light-content"} backgroundColor={COLORS.black} />
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
                <Text style={styles.headerTitle}>Help & Support</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.illustrationSection}>
                    <Image
                        source={require('../../../assets/images/HelpSupprtImage.png')}
                        style={styles.supportImage}
                        resizeMode='contain'
                    />
                    <Text style={styles.facingIssueTitle}>Facing Any Issue?</Text>
                    <Text style={styles.facingIssueSubtext}>
                        Please get in touch and we will be happy to help you
                    </Text>
                </View>

                <View style={styles.listContainer}>
                    <View style={styles.dividerLine} />
                    <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
                        <Image
                            source={require('../../../assets/images/mode_orange.png')}
                            style={styles.rowIcon}
                            resizeMode="contain"
                        />
                        <View style={styles.rowTextCol}>
                            <Text style={styles.rowTitle}>Chat with Us</Text>
                            <Text style={styles.rowSub}>
                                For a better experience, chat from your registered number
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.dividerLine} />

                    <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
                        <Image
                            source={require('../../../assets/images/call.png')}
                            style={styles.rowIcon}
                            resizeMode="contain"
                        />
                        <View style={styles.rowTextCol}>
                            <Text style={styles.rowTitle}>Call Now</Text>
                            <Text style={styles.rowSub}>
                                For a better experience, call from your registered number
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.dividerLine} />

                    <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
                        <Image
                            source={require('../../../assets/images/EditBtn.png')}
                            style={styles.rowIcon}
                            resizeMode="contain"
                        />
                        <View style={styles.rowTextCol}>
                            <Text style={styles.rowTitle}>Write to Us On Email</Text>
                            <Text style={styles.rowSub}>Average response time 24-48 Hrs</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.dividerLine} />

                    <TouchableOpacity
                        style={styles.rowItem}
                        onPress={() => navigation.navigate('MyTicketsScreen')}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require('../../../assets/images/document-text.png')}
                            style={styles.rowIcon}
                            resizeMode="contain"
                        />
                        <View style={styles.rowTextCol}>
                            <Text style={styles.rowTitle}>Ticket Management</Text>
                            <Text style={styles.rowSub}>Create and check ticket request</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

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
        height: 380,
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
    },
    illustrationSection: {
        alignItems: 'center',
        marginTop: 100,
        marginBottom: 20,
    },
    supportImage: {
        width: 246,
        height: 164,
        marginBottom: 14,
    },
    facingIssueTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    facingIssueSubtext: {
        color: '#8E8E93',
        fontSize: 12,
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    listContainer: {
        marginTop: 10,
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    rowIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.white,
        marginRight: 16,
    },
    rowTextCol: {
        flex: 1,
    },
    rowTitle: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    rowSub: {
        color: '#8E8E93',
        fontSize: 11,
        lineHeight: 15,
    },
    dividerLine: {
        height: 1,
        backgroundColor: '#242426',
    },
})