import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
export default function AdminProtecedRoute() {
  const adminAccess = useSelector((state) => state.user_data.userData["Admin"]);

  return adminAccess ? <Outlet /> : <Navigate to={"/"} />;
}
