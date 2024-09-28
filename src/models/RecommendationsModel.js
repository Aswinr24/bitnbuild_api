import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  recommendedOutfits: [
    {
      outfitId: mongoose.Schema.Types.ObjectId,
      outfitDescription: String,
      outfitItems: [mongoose.Schema.Types.ObjectId],
    },
  ],
});

const Recommendations = mongoose.model("Recommendations", recommendationSchema);

export { Recommendations };
