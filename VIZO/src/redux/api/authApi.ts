import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        signupWithEmail: builder.mutation({
            query: body => ({
                url: '/auth/signup/email',
                method: 'POST',
                body,
            }),
        }),

        signupWithPhone: builder.mutation({
            query: body => ({
                url: '/auth/signup/phone',
                method: 'POST',
                body,
            }),
        }),

        loginWithEmail: builder.mutation({
            query: body => ({
                url: '/auth/login/email',
                method: 'POST',
                body,
            }),
        }),

        loginWithPhone: builder.mutation({
            query: (body) => ({
                url: "/auth/login/phone",
                method: "POST",
                body,
            }),
        }),

        verifyOtp: builder.mutation({
            query: (body) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),

        resendOtp: builder.mutation({
            query: (body) => ({
                url: "/auth/resend-otp",
                method: "POST",
                body,
            }),
        }),

        forgotPassword: builder.mutation({
            query: (body) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body,
            }),
        }),
        resetPassword: builder.mutation({
            query: (body) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body,
            }),
        }),
        changePassword: builder.mutation({
            query: (body) => ({
                url: '/auth/change-password',
                method: 'POST',
                body,
            }),
        }),
        socialLogin: builder.mutation({
            query: (body) => ({
                url: '/auth/social-login',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useSignupWithEmailMutation,
    useSignupWithPhoneMutation,
    useLoginWithEmailMutation,
    useLoginWithPhoneMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useSocialLoginMutation,
} = authApi;