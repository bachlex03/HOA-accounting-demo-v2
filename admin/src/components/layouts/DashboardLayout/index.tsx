import WithAuthHoc from '@/components/HoCs/WithAuthHoc'
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
} from '@/components/ui/sidebar'
import SidebarLayout from './Sidebar'
import HeadingActions from './Sidebar/HeadingActions'
import { LoadingOverlay } from '@/components/customs/LoadingOverlay'
import useProgram from '@/hooks/useProgram'
import { useEffect, useLayoutEffect, useState, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import PrivateLayout from '../PrivateLayout'

const DashboardLayout: FC<{
   children?: React.ReactNode
}> = ({ children }) => {
   const [isAuth, setIsAuth] = useState(true)
   const { connected } = useProgram()
   const navigate = useNavigate()

   useLayoutEffect(() => {
      if (!connected) {
         navigate('/sign-in')
      }
   }, [connected, navigate])

   useEffect(() => {
      setTimeout(() => {
         setIsAuth(!isAuth)
      }, 500) // Simulate loading delay
   }, [connected])

   if (isAuth) {
      return <LoadingOverlay isLoading={isAuth} fullScreen />
   }

   return (
      <PrivateLayout>
         <SidebarProvider>
            <SidebarLayout />
            <SidebarInset>
               <header className="flex h-16 shrink-0 items-center gap-2">
                  <div className="flex items-center gap-2 px-4">
                     <SidebarTrigger className="-ml-1" />
                     <Separator orientation="vertical" className="mr-2 h-4" />
                     <Breadcrumb>
                        <BreadcrumbList>
                           <BreadcrumbItem className="hidden md:block">
                              <BreadcrumbLink href="#">
                                 Building Your Application
                              </BreadcrumbLink>
                           </BreadcrumbItem>
                           <BreadcrumbSeparator className="hidden md:block" />
                           <BreadcrumbItem>
                              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                           </BreadcrumbItem>
                        </BreadcrumbList>
                     </Breadcrumb>
                  </div>
                  <div className="ml-auto px-3">
                     <HeadingActions />
                  </div>
               </header>
               <main>
                  <div className="flex flex-col gap-4 p-4 pt-0">{children}</div>
               </main>
            </SidebarInset>
         </SidebarProvider>
      </PrivateLayout>
   )
}

export default WithAuthHoc(DashboardLayout)
