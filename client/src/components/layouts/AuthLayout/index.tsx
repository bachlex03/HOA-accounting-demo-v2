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
    if (connected) {
      setIsAuth(false);
    }
  }, [connected]);

  if (isAuth) {
    return <LoadingOverlay isLoading={true} fullScreen />;
  }

  return <div className="layout">{children}</div>;
};

export default WithAuthHoc(AuthLayout);
