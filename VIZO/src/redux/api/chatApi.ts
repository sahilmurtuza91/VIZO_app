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
    }),
});

export const {
    useGetMyConversationsQuery,
    useAccessConversationMutation,
    useGetMessagesQuery,
    useSendMessageMutation,
    useGetChatStatsQuery,
} = chatApi;
