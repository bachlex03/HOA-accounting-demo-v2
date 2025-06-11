/* eslint-disable react-refresh/only-export-components */
import { LoadingOverlay } from "@/components/customs/LoadingOverlay";
import WithAuthHoc from "@/components/HoCs/WithAuthHoc";
import useProgram from "@/hooks/useProgram";
import { useEffect, useState, type FC } from "react";

const AuthLayout: FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [isAuth, setIsAuth] = useState(true);
  const { connected } = useProgram();

  useEffect(() => {
    setTimeout(() => {
      setIsAuth(!isAuth);
    }, 500); // Simulate loading delay
  }, [connected]);

  if (isAuth) {
    return <LoadingOverlay isLoading={isAuth} fullScreen />;
  }

  return <div className="layout">{children}</div>;
};

export default WithAuthHoc(AuthLayout);
