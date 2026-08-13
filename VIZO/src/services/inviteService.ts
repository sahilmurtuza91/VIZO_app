import { InviteItem } from '../types/invite';

import { referralDashboardSummary } from './referralService';

let InviteList: InviteItem[] = [
  {
    id: 'inv_1',
    friendName: 'Madelyn Dias',
    referralStatus: 'Pending',
    rewardStatus: "You've got a reward",
    hasReward: true,
  },
  {
    id: 'inv_2',
    friendName: 'Madelyn Dias',
    referralStatus: 'Pending',
    rewardStatus: 'No reward earned',
    hasReward: false,
  },
  {
    id: 'inv_3',
    friendName: 'Madelyn Dias',
    referralStatus: 'Successful',
    rewardStatus: "You've got a reward",
    hasReward: true,
  },
];

export const inviteService = {
  getInviteDashboard: async () => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
    return {
      dashboardSummary: { ...referralDashboardSummary },
      invites: [...InviteList],
    };
  },
};
