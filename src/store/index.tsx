import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../api/authApi";
import { overviewApi } from "../api/overviewApi";
import { brandsApi } from "../api/brandsApi";
import { featuredApi } from "../api/featured";
import { portfolioApi } from "../api/portfolio";
import { logoApi } from "../api/logoApi";
import { socialApi } from "../api/socialApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [overviewApi.reducerPath]: overviewApi.reducer,
    [brandsApi.reducerPath]: brandsApi.reducer,
    [featuredApi.reducerPath]: featuredApi.reducer,
    [portfolioApi.reducerPath]: portfolioApi.reducer,
    [logoApi.reducerPath]: logoApi.reducer,
    [socialApi.reducerPath]: socialApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      overviewApi.middleware,
      featuredApi.middleware,
      portfolioApi.middleware,
      brandsApi.middleware,
      logoApi.middleware,
      socialApi.middleware
    ),
});

setupListeners(store.dispatch);
