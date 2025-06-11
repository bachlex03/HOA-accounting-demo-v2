/* eslint-disable react-refresh/only-export-components */
import { LoadingOverlay } from "@/components/customs/LoadingOverlay";
import WithAuthHoc from "@/components/HoCs/WithAuthHoc";
import { AuthProvider } from "@/components/providers/AuthProvider";
import useProgram from "@/hooks/useProgram";
import { useEffect, useLayoutEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

const PrivateLayout: FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [isAuth, setIsAuth] = useState(true);
  const { connected } = useProgram();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!connected) {
      navigate("/sign-in");
    }
  }, [connected, navigate]);

  useEffect(() => {
    setTimeout(() => {
      setIsAuth(!isAuth);
    }, 500); // Simulate loading delay
  }, [connected]);

  if (isAuth) {
    return <LoadingOverlay isLoading={isAuth} fullScreen />;
  }

  return (
    <AuthProvider>
      <div className="layout">{children}</div>
    </AuthProvider>
  );
};

export default WithAuthHoc(PrivateLayout);
