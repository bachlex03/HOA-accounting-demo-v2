import type { FC } from 'react'

const AuthLayout: FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  return (
    <div className=''>
      <h1 className=''>Welcome</h1>
      <div className=''>{children}</div>
    </div>
  )
}

export default AuthLayout
