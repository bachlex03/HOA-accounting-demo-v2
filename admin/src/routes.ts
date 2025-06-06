/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type FC } from 'react'
import AccountingPage from './pages/(privates)/Admin/Dashboard/Accounting'
import RootPage from './pages'
import PublicLayout from './components/layouts/PublicLayout'
import ClientLayoutWithAuth from './components/layouts/ClientLayout'
import AccountingManagementPage from './pages/(privates)/Client/AccountingManagement'
import LoginPage from './pages/(auth)/Login'
import AuthLayout from './components/layouts/AuthLayout'
import DashboardLayoutWithAuth from './components/layouts/DashboardLayout'

type Route = {
  path: string
  component: React.ComponentType
  layout?: FC<any> | null
}

const publicRoutes: Route[] = [
  {
    path: '/',
    component: RootPage,
    layout: PublicLayout
  },
  {
    path: '/sign-in',
    component: LoginPage,
    layout: AuthLayout
  }
]
const privateRoutes: Route[] = [
  {
    path: '/dashboard/accounting',
    component: AccountingPage,
    layout: DashboardLayoutWithAuth
  },
  {
    path: 'client/accounting-management',
    component: AccountingManagementPage,
    layout: ClientLayoutWithAuth
  }
]

export { publicRoutes, privateRoutes }
