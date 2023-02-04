import mongoose from "mongoose";

const fundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fundManager: { type: String, required: true },
    trusteeFund: { type: String, required: true },
    auditor: { type: String, required: true },
    investManagers: [
      {
        name: { type: String, required: true },
        cv: { type: String, required: false },
      },
    ],
    activityStartDate: { type: Date, required: true },
    fundType: { type: String, required: true, readonly: true },
    invest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invest",
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const FundModel = mongoose.model("Fund", fundSchema);

export { FundModel };
