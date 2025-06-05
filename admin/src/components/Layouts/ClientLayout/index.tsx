import WithAuthHoc from '@/components/HoCs/WithAuthHoc'
import type { FC } from 'react'

type ClientLayoutProps = {
  children?: React.ReactNode
}

const ClientLayout: FC<ClientLayoutProps> = ({ children }) => {
  return <div>{children}</div>
}
const ClientLayoutWithAuth = WithAuthHoc(ClientLayout)
export default ClientLayoutWithAuth
