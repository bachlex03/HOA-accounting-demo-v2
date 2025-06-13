import { LoadingOverlay } from '@/components/customs/LoadingOverlay'
import {
   LoadingOverlayProvider,
   useLoadingOverlay,
} from '@/components/providers/LoadingOverlayProvider'
import { Toaster } from 'sonner'

const GlobalLayoutContent = ({ children }: { children: React.ReactNode }) => {
   const { isLoading } = useLoadingOverlay()

   return (
      <div className="global-layout">
         <LoadingOverlay isLoading={isLoading} fullScreen />
         {children}
         <Toaster
            position="bottom-right"
            theme="dark"
            closeButton
            richColors={false}
            toastOptions={{
               style: {
                  background: '#171717',
                  color: 'white',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
               },
               className: 'toast-container',
            }}
         />
      </div>
   )
}

const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <LoadingOverlayProvider>
         <GlobalLayoutContent>{children}</GlobalLayoutContent>
      </LoadingOverlayProvider>
   )
}

export default GlobalLayout
