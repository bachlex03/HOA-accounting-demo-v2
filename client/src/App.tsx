/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect } from "react";
import WalletConnectionProvider from "./components/providers/WalletConnectionProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { type FC } from "react";
import { privateRoutes, publicRoutes } from "./routes";
function App() {
  const routes = [...publicRoutes, ...privateRoutes];

  useEffect(() => {
    console.log("App rendered");
  }, []);

  return (
    <WalletConnectionProvider>
      <Router>
        <div className="app">
          <Routes>
            {routes.map((route, index) => {
              const Page = route.component;

              let Layout: FC<any> = Fragment;

              if (route.layout) {
                Layout = route.layout;
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
              );
            })}
          </Routes>
        </div>
      </Router>
    </WalletConnectionProvider>
  );
}

export default App;
