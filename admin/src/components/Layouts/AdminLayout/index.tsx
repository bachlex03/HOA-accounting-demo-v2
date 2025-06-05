import WithAuthHoc from '@/components/HoCs/WithAuthHoc'
import type { FC } from 'react'

type AdminLayoutProps = {
  children?: React.ReactNode
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div>
      <h1>Admin Layout</h1>
      <div>{children}</div>
    </div>
  )
}
const AdminLayoutWithAuth = WithAuthHoc(AdminLayout)
export default AdminLayoutWithAuth
