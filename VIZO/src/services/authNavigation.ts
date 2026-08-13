export const navigateAfterAuth = (navigation: any, user?: { isProfileComplete?: boolean } | null) => {
    if (user?.isProfileComplete) {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
        });
    } else {
        navigation.navigate('ProfileSetup');
    }
};