import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema(
  {
    forecast: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Forecast",
      required: true,
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    decision: {
      type: String,
      enum: ["APPROVED", "REJECTED", "OVERRIDDEN"],
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    approvedAt: {
      type: Date,
      default: Date.now,
    },

    reviewStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "OVERRIDDEN"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

const Approval = mongoose.model("Approval", approvalSchema);

export default Approval;
