import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const user = useSelector((state: RootState) => state.user);

  if (!user || !user.token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
