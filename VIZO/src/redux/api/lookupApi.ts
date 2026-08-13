import { baseApi } from './baseApi';

export const lookupApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllLookupData: builder.query({
            query: () => '/lookup',
            transformResponse: (response: any) => response.data,
        }),
    }),
});

export const { useGetAllLookupDataQuery } = lookupApi;