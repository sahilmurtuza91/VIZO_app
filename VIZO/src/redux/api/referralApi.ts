import { baseApi } from "./baseApi";

export const referralApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReferrals: builder.query({
            query: (params) => ({
                url: '/referrals',
                params,
            }),
            providesTags: ["Referral"],
            transformResponse: (response: any) => {
                const referrals = response.data || [];
                const referralList = referrals.map((item: any) => ({
                    referralId: item._id,
                    customerName: item.customerName,
                    customerLocation: item.customerLocation,
                    customerRequirement: item.notes || item.propertyType || '',
                    referralStatus: item.status,
                    acceptedAgentName: item.acceptedByAgent?.name || '—',
                    createdAt: item.createdAt,
                }));

                const dashboardSummary = {
                    totalRewardsEarned: referrals.reduce(
                        (sum: number, item: any) => sum + (item.rewardAmount || 0),
                        0,
                    ),
                    totalReferralsCount: referrals.length,
                };

                return { dashboardSummary, referralList };
            },
        }),

        createReferral: builder.mutation({
            query: (body) => ({
                url: "/referrals",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Referral"],
        }),

        acceptReferral: builder.mutation({
            query: (id) => ({
                url: `/referrals/${id}/accept`,
                method: "PATCH",
            }),
            invalidatesTags: ["Referral"],
        }),

        getMyInvites: builder.query({
            query: () => '/invites',
            providesTags: ["Invite"],
            transformResponse: (response: any) => {
                const data = response.data || {};
                const invites = (data.invites || []).map((item: any) => ({
                    id: item._id,
                    friendName: item.friendName || item.invitedUser?.name || 'Friend',
                    referralStatus: item.referralStatus,
                    hasReward: (item.rewardAmount || 0) > 0,
                    rewardStatus: (item.rewardAmount || 0) > 0 ? "You've got a reward" : 'No reward earned',
                }));

                return {
                    dashboardSummary: {
                        totalRewardsEarned: data.totalRewardsEarned || 0,
                        totalReferralsCount: data.totalInvites || invites.length,
                    },
                    invites,
                };
            },
        }),
        sendInvite: builder.mutation({
            query: (body) => ({
                url: '/invites',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Invite'],
        }),

        updateInviteReward: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/invites/${id}/reward`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Invite'],
        }),
    }),
});

export const {
    useGetReferralsQuery,
    useCreateReferralMutation,
    useAcceptReferralMutation,
    useGetMyInvitesQuery,
    useSendInviteMutation,
    useUpdateInviteRewardMutation,
} = referralApi;
