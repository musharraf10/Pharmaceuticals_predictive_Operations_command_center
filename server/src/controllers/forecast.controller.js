import Forecast from "../models/Forecast.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateForecast } from "../services/forecast.service.js";

export const runForecast = asyncHandler(async (req, res) => {
  const forecasts = await generateForecast();

  return res
    .status(200)
    .json(new ApiResponse(200, forecasts, "Forecast generated successfully."));
});

export const getForecasts = asyncHandler(async (req, res) => {
  const forecasts = await Forecast.find()
    .populate("product", "name sku manufacturer")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, forecasts, "Forecasts fetched successfully."));
});

export const getForecastById = asyncHandler(async (req, res) => {
  const forecast = await Forecast.findById(req.params.id).populate(
    "product",
    "name sku manufacturer",
  );

  if (!forecast) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Forecast not found."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, forecast, "Forecast fetched successfully."));
});
