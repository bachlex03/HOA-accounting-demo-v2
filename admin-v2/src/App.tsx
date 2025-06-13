/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import WalletConnectionProvider from './components/providers/WalletConnectionProvider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { type FC } from 'react'
import { privateRoutes, publicRoutes } from './routes'
import PublicLayout from './components/layouts/PublicLayout'

function App() {
   const routes = [...publicRoutes, ...privateRoutes]

   useEffect(() => {
      console.log('App rendered')
   }, [])

   return (
      <WalletConnectionProvider>
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
      </WalletConnectionProvider>
   )
}

export default App
