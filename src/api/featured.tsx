import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const featuredApi = createApi({
  baseQuery,
  reducerPath: "featuredApi",
  endpoints: (builder) => ({
    getAllFeatured: builder.query({
      query: () => ({
        url: "featured-works",
      }),
    }),

    addFeatured: builder.mutation({
      query: (body) => ({
        url: "featured-works",
        body: body,
        method: "POST",
      }),
    }),

    getFeatured: builder.query({
      query: (id) => ({
        url: `featured-works/${id}`,
      }),
    }),

    updateFeatured: builder.mutation({
      query: ({ body, id }) => ({
        url: `featured-works/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteFeatured: builder.mutation({
      query: (id) => ({
        url: `featured-works/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddFeaturedMutation,
  useDeleteFeaturedMutation,
  useGetAllFeaturedQuery,
  useGetFeaturedQuery,
  useLazyGetAllFeaturedQuery,
  useLazyGetFeaturedQuery,
  useUpdateFeaturedMutation,
} = featuredApi;
