import { createContext, useContext, useMemo, useState } from 'react'

type TLoadingOverlayContext = {
   isLoading: boolean
   showLoading: () => void
   hideLoading: () => void
}

const LoadingOverlayContext = createContext<TLoadingOverlayContext>({
   isLoading: false,
   showLoading: () => {},
   hideLoading: () => {},
})

export const LoadingOverlayProvider: React.FC<{
   children: React.ReactNode
}> = ({ children }) => {
   const [isLoading, setIsLoading] = useState(false)

   const showLoading = () => {
      setIsLoading(true)
   }

   const hideLoading = () => {
      setIsLoading(false)
   }

   const value = useMemo(() => {
      return {
         isLoading,
         showLoading,
         hideLoading,
      }
   }, [isLoading, showLoading, hideLoading])

   return (
      <LoadingOverlayContext.Provider value={value}>
         {children}
      </LoadingOverlayContext.Provider>
   )
}

export const useLoadingOverlay = () => {
   const context = useContext(LoadingOverlayContext)
   if (!context) {
      throw new Error(
         'useLoadingOverlay must be used within a LoadingOverlayProvider',
      )
   }
   return context
}
