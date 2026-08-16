import { baseApi } from "./baseApi";

export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyConversations: builder.query({
            query: () => '/chat/conversations',
            providesTags: ["Conversation"],
            transformResponse: (response: any) => response.data,
        }),

        accessConversation: builder.mutation({
            query: (body: { receiverId: string; clientRequestId?: string }) => ({
                url: '/chat/conversations',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Conversation"],
        }),

        getMessages: builder.query({
            query: (conversationId: string) => `/chat/messages/${conversationId}`,
            providesTags: ["Message"],
            transformResponse: (response: any) => response.data,
        }),

        sendMessage: builder.mutation({
            query: (body: FormData | { conversationId: string; text: string }) => ({
                url: '/chat/message',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Message", "Conversation"],
        }),
        getChatStats: builder.query({
            query: () => '/chat/stats',
            providesTags: ["ChatStats"],
            transformResponse: (response: any) => response.data,
        }),
        markAllAsRead: builder.mutation<any, void>({
            query: () => ({
                url: '/mark-all-read',
                method: 'PATCH',
            }),
            invalidatesTags: ['Conversation'],
        }),

        clearChat: builder.mutation({
            query: (conversationId: string) => ({
                url: `/clear/${conversationId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, conversationId) => [
                { type: 'Message', id: conversationId },
                'Conversation',
            ],
        }),

        toggleMuteChat: builder.mutation({
            query: (conversationId: string) => ({
                url: `/mute/${conversationId}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Conversation'],
        }),
    }),
});

export const {
    useGetMyConversationsQuery,
    useAccessConversationMutation,
    useGetMessagesQuery,
    useSendMessageMutation,
    useGetChatStatsQuery,
    useMarkAllAsReadMutation,
    useClearChatMutation,
    useToggleMuteChatMutation,
} = chatApi;
