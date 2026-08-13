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

import { COLORS } from '../constants/Color';

export interface ContentItem {
    id: string;
    heading: string;
    description: string
}

interface ContentScreenProps {
    navigation: any;
    screenTitle: string;
    data: ContentItem[];
}

const ContentScreen: React.FC<ContentScreenProps> = ({
    navigation,
    screenTitle,
    data,
}) => {
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
                        source={require('../assets/images/backIcon.png')}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{screenTitle}</Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {data.map((item) => (
                    <View key={item.id} style={styles.itemBlock}>
                        <Text style={styles.headingText}>{item.heading}</Text>
                        <Text style={styles.descriptionText}>{item.description}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}
export default ContentScreen;
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
        paddingTop: 12,
        paddingBottom: 40,
    },
    itemBlock: {
        marginBottom: 20,
    },
    headingText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 6,
        lineHeight: 20,
    },
    descriptionText: {
        color: '#8E8E93',
        fontSize: 13,
        lineHeight: 18,
    },
})