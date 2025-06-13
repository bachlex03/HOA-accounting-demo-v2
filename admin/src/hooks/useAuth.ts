import { AuthContext } from '@/components/providers/AuthProvider'
import { useContext } from 'react'

export const useAuth = () => {
   const context = useContext(AuthContext)

   console.log('context', context)
   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider')
   }
   return context
}
