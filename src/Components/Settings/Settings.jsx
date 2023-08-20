import AnimateRoute from "../Navigations/AnimateRoute";
import AddEmp from "./AddEmp";
import RegisterShop from "./RegisterShop";

export default function Settings() {
  return (
    <AnimateRoute>
      <RegisterShop />
      <AddEmp />
    </AnimateRoute>
  );
}
