import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
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

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    expectedDelivery: Date,

    deliveredAt: Date,

    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "READY_TO_DISPATCH",
        "DISPATCHED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
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

const Order = mongoose.model("Order", orderSchema);

export default Order;
