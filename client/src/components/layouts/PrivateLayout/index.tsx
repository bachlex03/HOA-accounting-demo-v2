/* eslint-disable react-refresh/only-export-components */
import WithAuthHoc from "@/components/HoCs/WithAuthHoc";
import type { FC } from "react";

const PrivateLayout: FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return <div className="layout">{children}</div>;
};

export default WithAuthHoc(PrivateLayout);
