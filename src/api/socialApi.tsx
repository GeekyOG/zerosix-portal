import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const socialApi = createApi({
  baseQuery,
  reducerPath: "socialApi",
  endpoints: (builder) => ({
    getAllSocial: builder.query({
      query: () => ({
        url: "social",
      }),
    }),

    addSocial: builder.mutation({
      query: (body) => ({
        url: "social",
        body: body,
        method: "POST",
      }),
    }),

    updateSocial: builder.mutation({
      query: (body) => ({
        url: `social/${body.id}`,
        method: "PUT",
        body: body,
      }),
    }),
  }),
});

export const {
  useAddSocialMutation,
  useGetAllSocialQuery,
  useLazyGetAllSocialQuery,
  useUpdateSocialMutation,
} = socialApi;
