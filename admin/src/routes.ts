/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type FC } from 'react'
import AccountingPage from './pages/(privates)/Admin/Dashboard/Accounting'
import RootPage from './pages'
import PublicLayout from './components/Layouts/PublicLayout'
import ClientLayoutWithAuth from './components/Layouts/ClientLayout'
import AdminLayoutWithAuth from './components/Layouts/AdminLayout'
import AccountingManagementPage from './pages/(privates)/Client/AccountingManagement'

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
  }
]
const privateRoutes: Route[] = [
  {
    path: '/dashboard/accounting',
    component: AccountingPage,
    layout: AdminLayoutWithAuth
  },
  {
    path: 'client/accounting-management',
    component: AccountingManagementPage,
    layout: ClientLayoutWithAuth
  }
]

export { publicRoutes, privateRoutes }
