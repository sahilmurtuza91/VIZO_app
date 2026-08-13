import React from "react"
import ContentScreen, { ContentItem } from "../../../components/ContentScreen"

const TERMS_DATA: ContentItem[] = [
    { id: '1', heading: '1. Account Usage', description: 'Agents are responsible for maintaining the security of their account and login credentials.' },
    { id: '2', heading: '2. Property Listings', description: 'All property information uploaded must be accurate, legal, and up to date.' },
    { id: '3', heading: '3. Compliance', description: 'Agents must maintain valid licenses and follow local real estate regulations.' },
    { id: '4', heading: '4. Professional Conduct', description: 'Users must communicate professionally and avoid misleading or fraudulent activities.' },
    { id: '5', heading: '5. Privacy & Security', description: 'Client and platform data must be handled securely and responsibly.' },
    { id: '6', heading: '6. Platform Rights', description: 'The platform may update features, policies, or suspend accounts that violate terms.' },
];

const TermsAndConditionsScreen = ({ navigation }: any) => {
    return (
        <ContentScreen 
            navigation={navigation}
            screenTitle="Terms & condition"
            data={TERMS_DATA}
        />
    )
}

export default TermsAndConditionsScreen
