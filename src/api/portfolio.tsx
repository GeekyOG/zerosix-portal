import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const portfolioApi = createApi({
  baseQuery,
  reducerPath: "portfolioApi",
  endpoints: (builder) => ({
    getAllPortfolio: builder.query({
      query: () => ({
        url: "portfolio",
      }),
    }),

    addPortfolio: builder.mutation({
      query: (body) => ({
        url: "portfolio",
        body: body,
        method: "POST",
      }),
    }),

    getPortfolio: builder.query({
      query: (id) => ({
        url: `portfolio/${id}`,
      }),
    }),

    updatePortfolio: builder.mutation({
      query: ({ body, id }) => ({
        url: `portfolio/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deletePortfolio: builder.mutation({
      query: (id) => ({
        url: `portfolio/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddPortfolioMutation,
  useDeletePortfolioMutation,
  useGetAllPortfolioQuery,
  useGetPortfolioQuery,
  useLazyGetAllPortfolioQuery,
  useLazyGetPortfolioQuery,
  useUpdatePortfolioMutation,
} = portfolioApi;
