import { baseApi } from "./baseApi";

export const dailyActivityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getActivities: builder.query({
            query: (params) => ({
                url: "/daily-activities",
                params,
            }),
            providesTags: ["DailyActivity"],
            transformResponse: (response: any) => response.data,
        }),

        createActivity: builder.mutation({
            query: (body) => ({
                url: "/daily-activities",
                method: "POST",
                body,
            }),
            invalidatesTags: ["DailyActivity"],
        }),

        updateActivity: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/daily-activities/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["DailyActivity"],
        }),

        deleteActivity: builder.mutation({
            query: (id) => ({
                url: `/daily-activities/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DailyActivity'],
        }),
        markActivityComplete: builder.mutation({
            query: (id) => ({
                url: `/daily-activities/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['DailyActivity'],
        }),
    }),
});

export const {
    useGetActivitiesQuery,
    useCreateActivityMutation,
    useUpdateActivityMutation,
    useDeleteActivityMutation,
    useMarkActivityCompleteMutation,
} = dailyActivityApi;