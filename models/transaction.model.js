import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["sell", "buy"],
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    quantity: { type: Number, required: false, default: 0 },
    fund: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fund",
      required: true,
    },
    success: { type: Boolean, required: false, default: false },
    investUpdate: { type: Boolean, required: false, default: false },
    userUpdate: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
  }
);

const TransactionModel = mongoose.model("Log", transactionSchema);

export { TransactionModel };
