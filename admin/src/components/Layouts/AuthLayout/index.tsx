import WithAuthHoc from '@/components/HoCs/WithAuthHoc'
import type { FC } from 'react'

const AuthLayout: FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  return <div className=''>{children}</div>
}

const AuthLayoutWithAuth = WithAuthHoc(AuthLayout)
export default AuthLayoutWithAuth
