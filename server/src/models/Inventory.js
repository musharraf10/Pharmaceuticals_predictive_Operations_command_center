import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    warehouse: {
      type: String,
      required: true,
      default: "Main Warehouse",
    },

    location: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK"],
      default: "AVAILABLE",
    },

    expiryDate: {
      type: Date,
    },

    lastRestocked: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
