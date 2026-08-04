import { Router } from "express";

import {
  runForecast,
  getForecasts,
  getForecastById,
} from "../controllers/forecast.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(protect);

// View Forecasts
router.get("/", authorize("ADMIN", "MANAGER", "ANALYST"), getForecasts);

// Run AI Forecast
router.post("/run", authorize("ADMIN", "MANAGER"), runForecast);

// Single Forecast
router.get("/:id", authorize("ADMIN", "MANAGER", "ANALYST"), getForecastById);

export default router;
