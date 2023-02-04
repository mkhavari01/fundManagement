import mongoose from "mongoose";

const InvestSchema = new mongoose.Schema(
  {
    investUnits: { type: Number, required: true },
    remainedUnits: { type: Number, required: true },
    issuePrice: { type: Number, required: true },
    cancelPrice: { type: Number, required: true },
    statisticPrice: { type: Number, required: true },
    fund: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fund",
      required: true,
      readonly: true,
    },
  },
  {
    timestamps: true,
  }
);

const InvestModel = mongoose.model("Invest", InvestSchema);

export { InvestModel };
