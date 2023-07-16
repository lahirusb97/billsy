import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import ShopSelect from "./ShopSelect";

export default function LoginProtectedRoute() {
  const access = useSelector((state) => state.user_data.acess);
  const selectedShop = useSelector((state) => state.user_data.selected_Shop);

  return access && selectedShop ? (
    <Outlet />
  ) : access && !selectedShop ? (
    <ShopSelect />
  ) : (
    <Navigate to="/login" />
  );
}
