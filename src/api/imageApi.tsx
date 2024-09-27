import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from ".";

export const imageApi = createApi({
  baseQuery,
  reducerPath: "imageApi",
  endpoints: (builder) => ({
    getAllWork: builder.query({
      query: () => ({
        url: "works",
      }),
    }),

    addWork: builder.mutation({
      query: (body) => ({
        url: "work",
        body: body,
        method: "POST",
      }),
    }),

    addImageToWork: builder.mutation({
      query: ({ body, id }) => ({
        url: `/work/${id}/images`,
        body: body,
        method: "POST",
      }),
    }),

    getWork: builder.query({
      query: (id) => ({
        url: `work/${id}`,
      }),
    }),

    getImageByWorkId: builder.query({
      query: (workId) => ({
        url: `/work/images/${workId}`,
      }),
    }),

    updateWork: builder.mutation({
      query: ({ body, id }) => ({
        url: `work/${id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteWork: builder.mutation({
      query: (id) => ({
        url: `work/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddWorkMutation,
  useDeleteWorkMutation,
  useGetAllWorkQuery,
  useGetWorkQuery,
  useLazyGetAllWorkQuery,
  useLazyGetWorkQuery,
  useUpdateWorkMutation,
  useAddImageToWorkMutation,
  useGetImageByWorkIdQuery,
} = imageApi;
