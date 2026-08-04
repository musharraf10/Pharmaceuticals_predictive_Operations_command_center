import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Inventory from "../pages/Inventory/Inventory";
import Suppliers from "../pages/Suppliers/Suppliers";
import Production from "../pages/Production/Production";
import Orders from "../pages/Orders/Orders";
import Forecast from "../pages/Forecast/Forecast";
import Tasks from "../pages/Tasks/Tasks";
import Complaints from "../pages/Complaints/Complaints";
import Approvals from "../pages/Approvals/Approvals";
import Reports from "../pages/Reports/Reports";
import Users from "../pages/Users/Users";
import NotFound from "../pages/NotFound/NotFound";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route
              path="dashboard"
              element={
                <RoleRoute
                  roles={["ADMIN", "MANAGER", "ANALYST", "OPERATOR"]}
                >
                  <Dashboard />
                </RoleRoute>
              }
            />

            <Route
              path="products"
              element={
                <RoleRoute roles={["ADMIN", "MANAGER"]}>
                  <Products />
                </RoleRoute>
              }
            />

            <Route
              path="inventory"
              element={
                <RoleRoute roles={["ADMIN", "MANAGER", "OPERATOR"]}>
                  <Inventory />
                </RoleRoute>
              }
            />

            <Route
              path="suppliers"
              element={
                <RoleRoute roles={["ADMIN", "MANAGER"]}>
                  <Suppliers />
                </RoleRoute>
              }
            />

            <Route
              path="production"
              element={
                <RoleRoute roles={["ADMIN", "MANAGER"]}>
                  <Production />
                </RoleRoute>
              }
            />

            <Route
              path="orders"
              element={
                <RoleRoute roles={["ADMIN", "MANAGER", "OPERATOR"]}>
                  <Orders />
                </RoleRoute>
              }
            />

            <Route
              path="forecast"
              element={
                <RoleRoute roles={["ADMIN", "MANAGER", "ANALYST"]}>
                  <Forecast />
                </RoleRoute>
              }
            />

            <Route
              path="tasks"
              element={
                <RoleRoute roles={["ADMIN", "MANAGER", "OPERATOR"]}>
                  <Tasks />
                </RoleRoute>
              }
            />

            <Route
              path="complaints"
              element={
                <RoleRoute roles={["ADMIN", "MANAGER", "OPERATOR"]}>
                  <Complaints />
                </RoleRoute>
              }
            />

            <Route
              path="approvals"
              element={
                <RoleRoute roles={["ADMIN", "MANAGER"]}>
                  <Approvals />
                </RoleRoute>
              }
            />

            <Route
              path="reports"
              element={
                <RoleRoute roles={["ADMIN", "MANAGER", "ANALYST"]}>
                  <Reports />
                </RoleRoute>
              }
            />

            <Route
              path="users"
              element={
                <RoleRoute roles={["ADMIN"]}>
                  <Users />
                </RoleRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
