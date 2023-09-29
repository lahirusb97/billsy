import { Routes, Route } from "react-router-dom";
import Accounting from "../Accounting/Accounting";
import Coustomers from "../Coustomers/Coustomers";
import Dashboard from "../Dashboard/Dashboard";
import Employees from "../Employees/Employees";
import Inventory from "../Inventory/Inventory";
import Invoice from "../Invoice/Invoice";
import Report from "../Report/Report";
import Settings from "../Settings/Settings";
import AdminProtecedRoute from "./AdminProtecedRoute";

export default function MainRoutes() {
  return (
    <div>
      <Routes>
        <Route element={<AdminProtecedRoute />}>
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/coustomers" element={<Coustomers />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/report" element={<Report />} />
        
      </Routes>
    </div>
  );
}
