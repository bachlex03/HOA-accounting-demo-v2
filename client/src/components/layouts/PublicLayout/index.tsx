import type { FC } from "react";

const PublicLayout: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div>{children}</div>;
};
export default PublicLayout;
