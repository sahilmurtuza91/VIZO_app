// npm install react-native-image-picker
import { Alert } from 'react-native';

let launchImageLibrary: any = null;
let launchCamera: any = null;
try {
    const picker = require('react-native-image-picker');
    launchImageLibrary = picker.launchImageLibrary;
    launchCamera = picker.launchCamera;
} catch (e) {
}

export interface PickedFile {
    uri: string;
    name: string;
    type: string;
}

const NOT_INSTALLED_MSG =
    'Run `npm install react-native-image-picker` in the app project and rebuild (native module — Metro reload alone will not pick it up).';


export const pickImageFromLibrary = async (): Promise<PickedFile | null> => {
    if (!launchImageLibrary) {
        Alert.alert('Photo picker not installed', NOT_INSTALLED_MSG);
        return null;
    }

    const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
    });

    if (result.didCancel || !result.assets?.length) return null;

    const asset = result.assets[0];
    return {
        uri: asset.uri!,
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
    };
};

export const pickImageFromCamera = async (): Promise<PickedFile | null> => {
    if (!launchCamera) {
        Alert.alert('Camera not installed', NOT_INSTALLED_MSG);
        return null;
    }

    const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
    });

    if (result.didCancel || !result.assets?.length) return null;

    const asset = result.assets[0];
    return {
        uri: asset.uri!,
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
    };
};


export const pickDocumentImage = pickImageFromLibrary;
