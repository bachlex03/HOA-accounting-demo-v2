/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, type FC } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { publicRoutes, privateRoutes } from './routes'
import WalletConnectionProvider from './components/providers/WalletConnectionProvider'
import { ThemeProvider } from './components/providers/theme-provider'
import PublicLayout from './components/layouts/PublicLayout'

function App() {
   const routes = [...publicRoutes, ...privateRoutes]

   useEffect(() => {
      console.log('App rendered')
   }, [])

   return (
      <WalletConnectionProvider>
         <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Router>
               <div className="app">
                  <Routes>
                     {routes.map((route, index) => {
                        const Page = route.component

                        let Layout: FC<any> = PublicLayout

                        if (route.layout) {
                           Layout = route.layout
                        }

                        return (
                           <Route
                              key={index}
                              path={route.path}
                              element={
                                 <Layout>
                                    <Page />
                                 </Layout>
                              }
                           />
                        )
                     })}
                  </Routes>
               </div>
            </Router>
         </ThemeProvider>
      </WalletConnectionProvider>
   )
}

export default App
