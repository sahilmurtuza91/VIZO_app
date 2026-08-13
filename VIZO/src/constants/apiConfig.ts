import { Platform } from 'react-native';

const PRODUCTION_API_URL = 'https://vizo-app-suv9.onrender.com/api/v1';

const DEV_URL = Platform.select({
    android: 'http://10.0.2.2:8000',
    ios: 'http://localhost:8000',
    default: 'http://10.0.2.2:8000',
});

const USE_PRODUCTION = false;

export const API_ROOT_URL = USE_PRODUCTION ? PRODUCTION_API_URL : DEV_URL;