/* eslint-disable @typescript-eslint/no-explicit-any */
const WithAuthHoc = (WrappedComponent: React.ComponentType<any>) => {
  const WithAuth = (props: any) => {
    const isAuthenticated = true // Replace with actual authentication logic

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div> // Redirect or show a message
    }

    return <WrappedComponent {...props} />
  }

  return WithAuth
}

export default WithAuthHoc
