import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Login";
import React from "react";
import Dashboard from "../pages/Dashboard";
import Brands from "../pages/Brands";
import Featured from "../pages/Featured";
import Portfolio from "../pages/Portfolio";
import Settings from "../pages/Settings";
import Applayout from "../layout/Applayout";
import WhatWeOffer from "../pages/WhatWeOffer";
import Images from "../pages/Images";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [{ path: "", element: <Login /> }],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Applayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/dashboard/brands",
        element: <Brands />,
      },
      {
        path: "/dashboard/featured",
        element: <Featured />,
      },
      {
        path: "/dashboard/portfolio",
        element: <Portfolio />,
      },
      {
        path: "/dashboard/images",
        element: <Images />,
      },
      {
        path: "/dashboard/what-we-offer",
        element: <WhatWeOffer />,
      },
      {
        path: "/dashboard/settings",
        element: <Settings />,
      },
    ],
  },
]);

export default router;
