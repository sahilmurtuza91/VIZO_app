import { baseApi } from './baseApi';

export const profileApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getProfile: builder.query({
            query: () => '/profile/me',
            providesTags: ['Profile'],
            transformResponse: (response: any) => {
                const data = response.data || {};
                return {
                    ...data,
                    phoneNumber: data.phone,
                    language: data.languagesSpoken,
                };
            },
        }),

        setupProfile: builder.mutation({
            query: formData => ({
                url: '/profile/setup',
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Profile', 'User'],
        }),

        updateProfile: builder.mutation({
            query: (body) => ({
                url: '/profile/edit',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Profile', 'User'],
        }),

        // toggle online/offline availability status
        toggleAvailability: builder.mutation({
            query: (isAvailable: boolean) => ({
                url: '/profile/availability',
                method: 'PATCH',
                body: { isAvailable },
            }),
            invalidatesTags: ['Profile'],
        }),

        updateLocation: builder.mutation({
            query: (body) => ({
                url: '/profile/location',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Profile'],
        }),

        updatePlatformSettings: builder.mutation({
            query: (body) => ({
                url: '/profile/platform-settings',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Profile'],
        }),

        updateNotificationSettings: builder.mutation({
            query: (body) => ({
                url: '/profile/notification-settings',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useSetupProfileMutation,
    useUpdateProfileMutation,
    useToggleAvailabilityMutation,
    useUpdateLocationMutation,
    useUpdatePlatformSettingsMutation,
    useUpdateNotificationSettingsMutation,
} = profileApi;
