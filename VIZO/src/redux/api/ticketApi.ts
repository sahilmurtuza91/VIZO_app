import { baseApi } from "./baseApi";

export const ticketApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyTicket: builder.query({
            query: (params) => ({
                url: '/tickets',
                params,
            }),
            providesTags: ["Ticket"],
            transformResponse: (response: any) => response.data,
        }),
        getTicketById: builder.query({
            query: (id) => `/tickets/${id}`,
            providesTags: ['Ticket'],
            transformResponse: (response: any) => response.data,
        }),
        createTicket: builder.mutation({
            query: (body) => ({
                url: '/tickets',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Ticket'],
        }),
    }),
})

export const {
    useGetMyTicketQuery,
    useGetTicketByIdQuery,
    useCreateTicketMutation,
} = ticketApi;