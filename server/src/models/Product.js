import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    category: {
      type: String,
      enum: ["Tablet", "Capsule", "Injection", "Syrup", "Cream", "Other"],
      required: true,
    },

    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    reorderLevel: {
      type: Number,
      default: 100,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
