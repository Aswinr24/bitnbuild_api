import mongoose from "mongoose";

const clothSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  color: { type: String, required: true },
  brand: { type: String, required: true },
  material: { type: String },
  status: {
    type: String,
    enum: [
      "Brand New",
      "Rarely Used",
      "Occasionally Used",
      "Frequently Used",
      "Well-Worn",
      "Worn Out",
    ],
    default: "new",
  },
  usedFrom: { type: String },
  seasonalUse: {
    type: [String],
    enum: ["winter", "summer", "spring", "autumn"],
    default: [],
  },
  imageURL: { type: String },
});

const Clothes = mongoose.model("Clothes", clothSchema);
export { Clothes };
