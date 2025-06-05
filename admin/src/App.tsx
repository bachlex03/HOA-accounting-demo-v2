/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './index.css'
import { publicRoutes, privateRoutes } from './routes'
import AdminLayout from './components/Layouts/AdminLayout'

function App() {
  const routes = [...publicRoutes, ...privateRoutes]

  return (
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
  )
}

export default App
