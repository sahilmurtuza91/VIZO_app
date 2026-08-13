const GOOGLE_WEB_CLIENT_ID ='620300201727-dqodgmlmqtbl6fog5k7dkrq2986afgpp.apps.googleusercontent.com';
let GoogleSignin: any = null;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
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
    signInWithGoogle: async (): Promise<{ idToken: string }> => {
        if (!GoogleSignin) {
            throw new Error(
                'Google Sign-In not installed. Run `npm install @react-native-google-signin/google-signin`, configure it (see CHANGELOG.md), then rebuild the app.'
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

    signInWithFacebook: async (): Promise<{ accessToken: string }> => {
        if (!LoginManager || !AccessToken) {
            throw new Error(
                'Facebook Login not installed. Run `npm install react-native-fbsdk-next`, configure it (see CHANGELOG.md), then rebuild the app.'
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
