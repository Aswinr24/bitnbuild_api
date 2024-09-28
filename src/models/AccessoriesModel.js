import mongoose from "mongoose";

const accessorySchema = new mongoose.Schema({
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
  status: { type: String, enum: ["new", "used"], default: "new" },
  seasonalUse: {
    type: [String],
    enum: ["winter", "summer", "spring", "autumn"],
    default: [],
  },
});

const Accessories = mongoose.model("Accessories", accessorySchema);

export { Accessories };
