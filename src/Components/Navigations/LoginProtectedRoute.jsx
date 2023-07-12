import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LoginProtectedRoute() {
  const access = useSelector((state) => state.user_data.acess);

  return access ? <Outlet /> : <Navigate to="/login" />;
}
