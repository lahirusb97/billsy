import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
export default function LoginProtectedRoute() {
  const [access, setAccess] = useState(false);
  const userdata = useSelector((state) => state.user_data.userData);
  useEffect(() => {
    if (userdata !== null && userdata["Access"]) {
      setAccess(true);
    } else {
      setAccess(false);
    }
  }, [userdata]);

  return access === true ? <Outlet /> : <Navigate to="/login" />;
}
