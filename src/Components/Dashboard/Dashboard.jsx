import { useSelector } from "react-redux";
import AnimateRoute from "../Navigations/AnimateRoute";
import ProfitChart from "./ProfitChart";

export default function Dashboard() {
  return (
    <AnimateRoute>
      <div>
        <ProfitChart />
      </div>
    </AnimateRoute>
  );
}
