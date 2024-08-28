import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const logoApi = createApi({
  baseQuery,
  reducerPath: "logoApi",
  endpoints: (builder) => ({
    getLogos: builder.query({
      query: () => ({
        url: "logo",
      }),
    }),

    addLogo: builder.mutation({
      query: (body) => ({
        url: "logo",
        body: body,
        method: "POST",
      }),
    }),

    getLogo: builder.query({
      query: (id) => ({
        url: `logo/${id}`,
      }),
    }),

    updateLogo: builder.mutation({
      query: ({ body, id }) => ({
        url: `logo/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteLogo: builder.mutation({
      query: (id) => ({
        url: `logo/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetLogosQuery,
  useLazyGetLogoQuery,
  useAddLogoMutation,
  useUpdateLogoMutation,
} = logoApi;
