import React from "react";
import { Routes, Route } from "react-router-dom";
import Accounting from "../Accounting/Accounting";
import Coustomers from "../Coustomers/Coustomers";
import Dashboard from "../Accounting/Dashboard";
import Employees from "../Accounting/Employees";
import Inventory from "../Accounting/Inventory";
import Report from "../Report/Report";
import Settings from "../Report/Settings";

export default function MainRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/coustomers" element={<Coustomers />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/report" element={<Report />} />
        <Route path="/Settings" element={<Settings />} />
      </Routes>
    </div>
  );
}
