import type { FC } from 'react'

type PublicLayoutProps = {
  children?: React.ReactNode
}

const PublicLayout: FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div>
      <h1>Public Layout</h1>
      <div>{children}</div>
    </div>
  )
}
export default PublicLayout
