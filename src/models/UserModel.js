import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  password: { type: String, required: true },
  favouriteColors: { type: [String], default: [] },
  favouriteBrands: { type: [String], default: [] },
  preferredOccasions: { type: [String], default: [] },
  preferredMaterial: { type: String, default: "" },
  favouriteAccessories: { type: [String], default: [] },
  lifestyle: { type: String, default: "" },
  uniqueItems: { type: [String], default: [] },
});

const Users = mongoose.model("Users", userSchema);

export { Users };
