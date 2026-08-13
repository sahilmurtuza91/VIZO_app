export type ReferralStatus = 'Accepted' | 'Under Contract' | 'Pending';
export type PropertyType = 'Apartment' | 'Villa' | 'House' | 'Land';

export interface ReferralListItem {
  referralId: string;
  customerName: string;
  customerLocation: string;
  customerRequirement: string;
  referralStatus: ReferralStatus;
  acceptedAgentName: string;
}

export interface ReferralDashboardSummary {
  totalRewardsEarned: number;
  totalReferralsCount: number;
}

export interface CreateReferralForm {
  customerLocation: string;
  customerName: string;
  selectedPropertyType: PropertyType;
  customerBudget: string;
  referralCommission: string;
  notes: string;
}
