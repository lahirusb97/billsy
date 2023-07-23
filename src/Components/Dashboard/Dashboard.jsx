import { useDispatch, useSelector } from "react-redux";
import AnimateRoute from "../Navigations/AnimateRoute";
import ProfitChart from "./ProfitChart";
import ConfirmModal from "../Component/ConfirmModal";
import { openModal } from "../../Store/Slices/Component/confirmModal";
import { Button } from "@mui/material";

export default function Dashboard() {
  const dispatch = useDispatch();
  return (
    <AnimateRoute>
      <div>
        <ProfitChart />
      </div>
    </AnimateRoute>
  );
}
