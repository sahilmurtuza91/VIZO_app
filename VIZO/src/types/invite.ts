export type InviteRewardStatus = "You've got a reward" | 'No reward earned';
export type ReferralStatusType = 'Pending' | 'Successful';

export interface InviteItem {
  id: string;
  friendName: string;
  referralStatus: ReferralStatusType;
  rewardStatus: InviteRewardStatus;
  hasReward: boolean;
}

