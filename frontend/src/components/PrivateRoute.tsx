import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);

  if (!user || !user.token) return <Navigate to="/" />;

  return children;
};
