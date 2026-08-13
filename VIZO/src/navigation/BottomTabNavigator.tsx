import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screen/Dashboard/DashboardScreen';
import ClientRequestScreen from '../screen/RequestScreen/ClientRequestScreen';
import ChatScreen from '../screen/ChatScreen/ChatScreen';
import MyProfileScreen from '../screen/PrfileScreen/MyProfileScreen';
import { COLORS } from '../constants/Color';



const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: COLORS.white,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            <Tab.Screen
                name="Home"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Image
                                source={require("../assets/images/home.png")}
                                style={[
                                    styles.tabIcon,
                                    { tintColor: focused ? COLORS.white : COLORS.textMuted },
                                ]}
                                resizeMode='contain'
                            />
                            {focused && <View style={styles.activeDot} />}
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Requests"
                component={ClientRequestScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('../assets/images/request.png')}
                                style={[
                                    styles.tabIcon,
                                    { tintColor: focused ? COLORS.white : COLORS.textMuted },
                                ]}
                                resizeMode="contain"
                            />
                            {focused && <View style={styles.activeDot} />}
                        </View>

                    ),
                }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('../assets/images/chat.png')}
                                style={[
                                    styles.tabIcon,
                                    { tintColor: focused ? COLORS.white : COLORS.textMuted },
                                ]}
                                resizeMode="contain"
                            />
                            {focused && <View style={styles.activeDot} />}
                        </View>

                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={MyProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('../assets/images/tab_profile.png')}
                                style={[
                                    styles.tabIcon,
                                    { tintColor: focused ? COLORS.white : COLORS.textMuted },
                                ]}
                                resizeMode="contain"
                            />
                            {focused && <View style={styles.activeDot} />}
                        </View>

                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigator

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#121214',
        borderTopWidth: 1,
        borderTopColor: COLORS.borderDark,
        height: 70,
        paddingBottom: 10,
        // paddingBottom: 40,
        paddingTop: 8,
    },
    tabBarLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    iconContainer: {
        alignItems: 'center',
    },
    tabIcon: {
        width: 22,
        height: 22,
    },
    activeDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: COLORS.orange,
        marginTop: 4,
    },
    center: {
        flex: 1,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: COLORS.white,
    },
})