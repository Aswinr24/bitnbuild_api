import mongoose from "mongoose";

const outfitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  outfitItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Clothes" }],
  accessoryItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Accessories" },
  ],
  occasion: { type: String },
  notes: { type: String, default: "" },
});

const Outfits = mongoose.model("Outfits", outfitSchema);

export { Outfits };
