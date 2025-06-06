/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './index.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import { publicRoutes, privateRoutes } from './routes'
import AdminLayout from './components/layouts/AdminLayout'
import WalletConnectionProvider from './components/providers/WalletConnectionProvider'
import { ThemeProvider } from './components/providers/theme-provider'

function App() {
  const routes = [...publicRoutes, ...privateRoutes]

  return (
    <WalletConnectionProvider>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <Router>
          <div className='app'>
            <Routes>
              {routes.map((route, index) => {
                const Page = route.component

                let Layout: FC<any> = AdminLayout

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

  // return (
  //   <Router>
  //     <div className='app'>
  //       <Routes>
  //         {routes.map((route, index) => {
  //           const Page = route.component

  //           let Layout: FC<any> = AdminLayout

  //           if (route.layout) {
  //             Layout = route.layout
  //           }

  //           return (
  //             <Route
  //               key={index}
  //               path={route.path}
  //               element={
  //                 <Layout>
  //                   <Page />
  //                 </Layout>
  //               }
  //             />
  //           )
  //         })}
  //       </Routes>
  //     </div>
  //   </Router>
  // )
}

export default App
