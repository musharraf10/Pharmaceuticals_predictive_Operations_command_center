import mongoose from "mongoose";

const forecastSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    predictedDemand: {
      type: Number,
      required: true,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },

    recommendation: {
      type: String,
      default: "",
    },

    forecastDate: {
      type: Date,
      default: Date.now,
    },
    modelVersion: {
      type: String,
      default: "gemini-2.5-flash",
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },

    inputSnapshot: {
      type: mongoose.Schema.Types.Mixed,
    },

    explanation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Forecast", forecastSchema);
