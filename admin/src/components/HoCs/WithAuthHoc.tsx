import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/* eslint-disable @typescript-eslint/no-explicit-any */
const WithAuthHoc = (WrappedComponent: React.ComponentType<any>) => {
  const WithAuth = (props: any) => {
    const { connection } = useConnection()
    const anchorWallet = useAnchorWallet()
    const wallet = useWallet()
    const navigate = useNavigate()

    console.log('wallet', wallet)
    console.log('anchorWallet', anchorWallet)

    useEffect(() => {
      console.log('connection', connection)
      if (anchorWallet) {
        navigate('/dashboard/accounting')
      } else {
        navigate('/sign-in')
      }
    }, [anchorWallet])

    return <WrappedComponent {...props} />
  }

  return WithAuth
}

export default WithAuthHoc
