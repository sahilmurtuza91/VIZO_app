export type PropertyIntent = 'Buy' | 'Rent' | 'Sell';

export type RequestStatus =  "pending" | "approved" | "cancelled";

export interface ClientRequestItem {
    id:string;
    name:string;
    avatarUrl:string;
    isVerified: boolean;
    intent: PropertyIntent;
    distance: string;
    address: string;
    selectedSlot: string;
    clientNotes: string;
    status: RequestStatus;

    budgetRange?: string;
    propertyType?: string;
    configuration?: string;
    preferredArea?: string;
    isReviewRequested?: boolean
}