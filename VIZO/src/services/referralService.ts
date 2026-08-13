import {
  ReferralListItem,
  ReferralDashboardSummary,
  CreateReferralForm,
} from '../types/referral';

export let referralDashboardSummary: ReferralDashboardSummary = {
  totalRewardsEarned: 120,
  totalReferralsCount: 6,
};

let referralList: ReferralListItem[] = [
  {
    referralId: 'ref_1',
    customerName: 'Madelyn Dias',
    customerLocation: '150 mi away | 154 North St, Apt 5C',
    customerRequirement: 'Looking for waterfront condo, 2-3 bedrooms',
    referralStatus: 'Accepted',
    acceptedAgentName: 'Madelyn Dias',
  },
  {
    referralId: 'ref_2',
    customerName: 'Sarah Johnson',
    customerLocation: '150 mi away | 154 North St, Apt 5C',
    customerRequirement: 'Looking for waterfront condo, 2-3 bedrooms',
    referralStatus: 'Accepted',
    acceptedAgentName: 'Sarah Johnson',
  },
  {
    referralId: 'ref_3',
    customerName: 'Sarah Johnson',
    customerLocation: '150 mi away | 154 North St, Apt 5C',
    customerRequirement: 'Looking for waterfront condo, 2-3 bedrooms',
    referralStatus: 'Under Contract',
    acceptedAgentName: 'Sarah Johnson',
  },
];

export const referralService = {
  getReferralDashbboardData: async (): Promise<{
    dashboardSummary: ReferralDashboardSummary;
    referralList: ReferralListItem[];
  }> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
    return {
      dashboardSummary: { ...referralDashboardSummary },
      referralList: [...referralList],
    };
  },

  createReferral: async (
    referralForm: CreateReferralForm,
  ): Promise<ReferralListItem> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    const newReferral: ReferralListItem = {
      referralId: Date.now().toString(),
      customerName: referralForm.customerName,
      customerLocation: referralForm.customerLocation,
      customerRequirement: referralForm.notes || 'Looking for property',
      referralStatus: 'Pending',
      acceptedAgentName: referralForm.customerName,
    };
    referralList = [newReferral, ...referralList];

    referralDashboardSummary.totalReferralsCount += 1;

    return newReferral;
  },
};
