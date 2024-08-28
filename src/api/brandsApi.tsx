import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const brandsApi = createApi({
  baseQuery,
  reducerPath: "brandsApi",
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => ({
        url: "brands",
      }),
    }),

    addBrand: builder.mutation({
      query: (body) => ({
        url: "brands",
        body: body,
        method: "POST",
      }),
    }),

    getBrand: builder.query({
      query: (id) => ({
        url: `brands/${id}`,
      }),
    }),

    updateBrand: builder.mutation({
      query: ({ body, id }) => ({
        url: `brands/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `brands/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useLazyGetBrandQuery,
  useAddBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
  useGetBrandQuery,
} = brandsApi;
