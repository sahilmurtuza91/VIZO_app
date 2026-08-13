import { baseApi } from "./baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptionPlans: builder.query({
            query: () => '/subscriptions/plans',
            transformResponse: (response: any) => {
                const plans = response.data || [];
                return plans.map((plan: any) => ({
                    id: plan._id,
                    name: plan.name,
                    tagline: plan.tagLine,
                    monthlyPrice: plan.monthlyPrice,
                    annualPricePerMonth: plan.annualPricePerMonth,
                    iconName: plan.iconName,
                    features: plan.features,
                }));
            },
        }),
        getCurrentSubscription: builder.query({
            query: () => '/subscriptions/me',
            providesTags: ['User'],
            transformResponse: (response: any) => response.data,
        }),
        createCheckoutOrder: builder.mutation({
            query: (body) => ({
                url: '/subscriptions/checkout',
                method: 'POST',
                body,
            }),
        }),
        verifyPayment: builder.mutation({
            query: (body) => ({
                url: '/subscriptions/verify',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetSubscriptionPlansQuery,
    useGetCurrentSubscriptionQuery,
    useCreateCheckoutOrderMutation,
    useVerifyPaymentMutation,
} = subscriptionApi;
