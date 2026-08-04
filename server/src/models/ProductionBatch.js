import mongoose from "mongoose";

const productionBatchSchema = new mongoose.Schema(
  {
    batchNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    manufacturedDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PLANNED",
        "IN_PROGRESS",
        "QUALITY_CHECK",
        "COMPLETED",
        "REJECTED",
      ],
      default: "PLANNED",
    },

    qualityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },

    productionLine: {
      type: String,
      default: "Line 1",
    },

    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const ProductionBatch = mongoose.model(
  "ProductionBatch",
  productionBatchSchema,
);

export default ProductionBatch;
