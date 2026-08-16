import { baseApi } from "./baseApi";


const getRelativeTime = (dateString: string): string => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} Days ago`;
};

const isToday = (dateString: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
};

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotification: builder.query({
            query: (params) => ({
                url: "/notifications",
                params,
            }),
            providesTags: ["Notification"],
            transformResponse: (response: any) => {
                const notifications = response.data?.notifications || [];
                return notifications.map((item: any) => ({
                    id: item._id,
                    senderName: item.senderName,
                    senderImage: item.senderImage,
                    message: item.message,
                    timestamp: getRelativeTime(item.createdAt),
                    isRead: item.isRead,
                    section: isToday(item.createdAt) ? 'Today' : 'Older notifications',
                    targetScreen: item.targetScreen,
                    targetId: item.targetId,
                }));
            },
        }),

        getUnreadNotificationCount: builder.query({
            query: () => '/notifications',
            providesTags: ["Notification"],
            transformResponse: (response: any) => response.data?.unreadCount || 0,
        }),

        markAllRead: builder.mutation({
            query: () => ({
                url: "/notifications/mark-all-read",
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),

        markSingleRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),

        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const {
    useGetNotificationQuery,
    useGetUnreadNotificationCountQuery,
    useMarkAllReadMutation,
    useMarkSingleReadMutation,
    useDeleteNotificationMutation,
} = notificationApi;
