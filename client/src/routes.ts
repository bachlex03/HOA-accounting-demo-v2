/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type FC } from "react";
import RootPage from "./pages";
import PublicLayout from "./components/layouts/PublicLayout";
import LoginPage from "./pages/(auth)/Login";
import AuthLayout from "./components/layouts/AuthLayout";
import AccountingPage from "./pages/(privates)/Accounting";
import PrivateLayout from "./components/layouts/PrivateLayout";

type Route = {
  path: string;
  component: React.ComponentType;
  layout?: FC<any> | null;
};

const publicRoutes: Route[] = [
  {
    path: "/",
    component: RootPage,
    layout: PublicLayout,
  },
  {
    path: "/sign-in",
    component: LoginPage,
    layout: AuthLayout,
  },
];
const privateRoutes: Route[] = [
  {
    path: "/renter/accounting",
    component: AccountingPage,
    layout: PrivateLayout,
  },
];

export { publicRoutes, privateRoutes };
