import type { FC } from "react";
import GlobalLayout from "../GlobalLayout";

const PublicLayout: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <GlobalLayout>
      <div className="public-layout">{children}</div>
    </GlobalLayout>
  );
};
export default PublicLayout;
