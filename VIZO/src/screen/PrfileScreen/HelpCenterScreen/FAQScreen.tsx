import React from 'react';
import ContentScreen, { ContentItem } from '../../../components/ContentScreen';

const FAQ_DATA: ContentItem[] = [
    { id: '1', heading: 'Q1. How do I add a new property listing?', description: 'Go to the Listings section and tap "Add Property" to create a new property listing.' },
    { id: '2', heading: 'Q2. How can I update my license information?', description: 'Navigate to Profile > Compliance & License Settings to upload or update your license documents.' },
    { id: '3', heading: 'Q3. How do I manage client inquiries?', description: 'All client inquiries and leads can be managed from the Leads or Messages section.' },
    { id: '4', heading: 'Q4. Can I edit or remove a property listing?', description: 'Yes, open the property details page and use the Edit or Remove options.' },
    { id: '5', heading: 'Q5. How will I receive notifications?', description: 'You will receive notifications for leads, compliance updates, platform announcements, and property activities.' },
    { id: '6', heading: 'Q6. What happens if my license expires?', description: 'Your account may face limited access until valid license documents are updated and verified.' },
    { id: '7', heading: 'Q7. Can I manage multiple properties?', description: 'Yes, agents can manage multiple residential, commercial, luxury, or rental properties from one account.' },
];

const FAQScreen = ({ navigation }: any) => (
    <ContentScreen
        navigation={navigation}
        screenTitle="FAQ"
        data={FAQ_DATA}
    />
);

export default FAQScreen;