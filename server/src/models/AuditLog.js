import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    action: String,

    module: String,

    description: String,

    ipAddress: String,

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    outcome: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AuditLog", auditSchema);
