import { BrowserRouter, Routes, Route } from "react-router-dom";

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

import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Routes>
                                    <Route
                                        path="dashboard"
                                        element={<Dashboard />}
                                    />

                                    <Route
                                        path="products"
                                        element={<Products />}
                                    />

                                    <Route
                                        path="inventory"
                                        element={<Inventory />}
                                    />

                                    <Route
                                        path="suppliers"
                                        element={<Suppliers />}
                                    />

                                    <Route
                                        path="production"
                                        element={<Production />}
                                    />

                                    <Route
                                        path="orders"
                                        element={<Orders />}
                                    />

                                    <Route
                                        path="forecast"
                                        element={<Forecast />}
                                    />

                                    <Route
                                        path="tasks"
                                        element={<Tasks />}
                                    />

                                    <Route
                                        path="complaints"
                                        element={<Complaints />}
                                    />

                                    <Route
                                        path="approvals"
                                        element={<Approvals />}
                                    />

                                    <Route
                                        path="reports"
                                        element={<Reports />}
                                    />

                                    <Route
                                        path="users"
                                        element={<Users />}
                                    />
                                </Routes>
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;