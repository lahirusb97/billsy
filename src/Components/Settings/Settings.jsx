import AnimateRoute from "../Navigations/AnimateRoute";
import AddEmp from "./AddEmp";
import EmpList from "./EmpList";
import RegisterShop from "./RegisterShop";

export default function Settings() {
  return (
    <AnimateRoute>
      <div className="flex flex-wrap w-full md:justify-evenly  justify-center mt-8">
        <AddEmp />

        <div className="flex flex-col">
          <RegisterShop />
          <EmpList />
        </div>
      </div>
    </AnimateRoute>
  );
}
