import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import productRoutes from "./routes/product.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import productionBatchRoutes from "./routes/productionBatch.routes.js";
import orderRoutes from "./routes/order.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import forecastRoutes from "./routes/forecast.routes.js";
import taskRoutes from "./routes/task.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import approvalRoutes from "./routes/approval.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import reportRoutes from "./routes/report.routes.js";
import usersRoutes from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: "https://pharmaceuticals-predictive-operations.onrender.com",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/production-batches", productionBatchRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", usersRoutes);

app.use(errorHandler);

export default app;
