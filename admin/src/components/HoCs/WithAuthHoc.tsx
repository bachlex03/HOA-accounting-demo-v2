import useSolanaProgram from '@/hooks/use-solana-program'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/* eslint-disable @typescript-eslint/no-explicit-any */
const WithAuthHoc = (WrappedComponent: React.ComponentType<any>) => {
   const WithAuth = (props: any) => {
      const navigate = useNavigate()

      const anchorWallet = useAnchorWallet()
      const { program } = useSolanaProgram()

      useEffect(() => {
         if (anchorWallet && program) {
            // navigate('/dashboard/accounting')
         } else {
            navigate('/sign-in')
         }
      }, [anchorWallet, program])

      return <WrappedComponent {...props} />
   }

   return WithAuth
}

export default WithAuthHoc
