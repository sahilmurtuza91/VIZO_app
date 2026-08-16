import { baseApi } from "./baseApi";

// helper function
const mapRequest = (item: any) => ({
    id: item._id,
    name: item.name,
    avatarUrl: item.avatarUrl,
    isVerified: item.isVerified,
    intent: item.intent,
    distance: item.distance,
    address: item.address,
    selectedSlot: item.selectedSlot
        ? new Date(item.selectedSlot).toLocaleString()
        : '',
    clientNotes: item.clientNotes,
    status: item.status,
    clientUserId: item.clientUser?._id || item.clientUser || undefined,
    budgetRange:
        item.budgetMin != null && item.budgetMax != null
            ? `$${item.budgetMin.toLocaleString()} - $${item.budgetMax.toLocaleString()}`
            : undefined,
    propertyType: item.propertyType,
    configuration: item.configuration,
    preferredArea: item.preferredArea,
    isReviewRequested: item.isReviewRequested,
    createdAt: item.createdAt,
});

export const clientRequestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllRequest: builder.query({
            query: (params) => ({
                url: "/client-requests",
                params,
            }),
            providesTags: ["ClientRequest"],
            transformResponse: (response: any) => (response.data || []).map(mapRequest),
        }),

        getRequestById: builder.query({
            query: (id) => `/client-requests/${id}`,
            providesTags: ["ClientRequest"],
            transformResponse: (response: any) => mapRequest(response.data),
        }),

        createRequest: builder.mutation({
            query: (body) => ({
                url: '/client-requests',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["ClientRequest", "Notification"],
        }),
        updateRequestStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/client-requests/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['ClientRequest'],
        }),
        requestReview: builder.mutation({
            query: (id) => ({
                url: `/client-requests/${id}/request-review`,
                method: 'PATCH',
            }),
            invalidatesTags: ['ClientRequest'],
        }),
    }),
});

export const {
    useGetAllRequestQuery,
    useGetRequestByIdQuery,
    useCreateRequestMutation,
    useUpdateRequestStatusMutation,
    useRequestReviewMutation,
} = clientRequestApi;