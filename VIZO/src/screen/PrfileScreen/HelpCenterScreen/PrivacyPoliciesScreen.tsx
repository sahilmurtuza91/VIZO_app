import React from 'react';
import ContentScreen, { ContentItem } from '../../../components/ContentScreen';

const PRIVACY_DATA: ContentItem[] = [
    { id: '1', heading: '1. Information Collection', description: 'We collect information such as your name, contact details, property listings, and business information to provide platform services.' },
    { id: '2', heading: '2. Data Usage', description: 'Your information is used to manage listings, connect with clients, improve services, and provide platform notifications.' },
    { id: '3', heading: '3. Data Protection', description: 'We use secure systems and industry-standard measures to protect your personal and business data.' },
    { id: '4', heading: '4. Information Sharing', description: 'Your information is never sold to third parties. Data may only be shared when required for platform operations or legal compliance.' },
    { id: '5', heading: '5. Cookies & Analytics', description: 'The platform may use cookies and analytics tools to improve user experience and system performance.' },
    { id: '6', heading: '6. User Responsibility', description: 'Agents are responsible for keeping account credentials secure and maintaining accurate information.' },
];

const PrivacyPoliciesScreen = ({ navigation }: any) => (
    <ContentScreen
        navigation={navigation}
        screenTitle="Privacy Policies"
        data={PRIVACY_DATA}
    />
);

export default PrivacyPoliciesScreen;