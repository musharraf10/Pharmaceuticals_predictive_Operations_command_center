import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: String,

    email: String,

    phone: String,

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    deliveryDays: Number,

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Supplier", supplierSchema);
