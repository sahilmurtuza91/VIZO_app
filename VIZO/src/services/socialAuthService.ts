const GOOGLE_WEB_CLIENT_ID = '620300201727-dqodgmlmqtbl6fog5k7dkrq2986afgpp.apps.googleusercontent.com';
let GoogleSignin: any = null;
try {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
    GoogleSignin?.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false,
    });
} catch (e) {

}

let AccessToken: any = null;
let LoginManager: any = null;
try {

    const fb = require('react-native-fbsdk-next');
    AccessToken = fb.AccessToken;
    LoginManager = fb.LoginManager;
} catch (e) {

}

export const socialAuthService = {
    // google login
    signInWithGoogle: async (): Promise<{ idToken: string }> => {
        if (!GoogleSignin) {
            throw new Error(
                'Google Sign-In is not available. Please check the Google Sign-In setup.'
            );
        }
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signIn();
        const { idToken } = await GoogleSignin.getTokens();
        if (!idToken) {
            throw new Error('Google ID token not received.');
        }
        return { idToken };
    },

    // facebook login
    signInWithFacebook: async (): Promise<{ accessToken: string }> => {
        if (!LoginManager || !AccessToken) {
            throw new Error(
                'Facebook Login is not available. Please check the Facebook Login setup.'
            );
        }
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
            throw new Error('Facebook login cancelled.');
        }
        const data = await AccessToken.getCurrentAccessToken();
        if (!data?.accessToken) {
            throw new Error('Facebook access token not received.');
        }
        return { accessToken: data.accessToken.toString() };
    },
};
