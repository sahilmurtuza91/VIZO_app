import { baseApi } from "./baseApi";

export const workingHoursApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWorkingHours: builder.query({
            query: () => "/working-hours",
            providesTags: ["WorkingHours"],
            transformResponse: (response: any) => response.data,
        }),

        updateWorkingHours: builder.mutation({
            query: (body) => ({
                url: "/working-hours/update",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["WorkingHours"],
        }),

        syncCalendar: builder.mutation({
            query: (syncedCalendar) => ({
                url: "/working-hours/sync-calendar",
                method: "PATCH",
                body: { syncedCalendar },
            }),
            invalidatesTags: ["WorkingHours"],
        }),
    }),
});

export const {
    useGetWorkingHoursQuery,
    useUpdateWorkingHoursMutation,
    useSyncCalendarMutation,
} = workingHoursApi;