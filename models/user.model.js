import mongoose from "mongoose";

const UserSchemca = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    totalUnits: { type: Number, required: false, default: 0 },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: false,
      default: "user",
    },
    funds: [
      {
        fundId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Fund",
          required: false,
          default: null,
        },
        totalUnits: { type: Number, required: false, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchemca);

export { UserModel };
