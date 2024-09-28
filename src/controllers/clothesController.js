import { Clothes } from "../models/ClothesModel.js";
import { Outfits } from "../models/OutfitModel.js";
import { supabase } from "../services/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

const uploadImageToSupabase = async (file) => {
  const fileName = `${uuidv4()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, file.buffer, { contentType: file.mimetype });

  if (error) {
    throw new Error(`Failed to upload image to Supabase: ${error.message}`);
  }

  const { publicURL } = supabase.storage.from("images").getPublicUrl(fileName);

  return publicURL;
};

export const addClothes = async (req, res) => {
  const {
    userId,
    itemName,
    category,
    type,
    color,
    brand,
    material,
    status,
    usedFrom,
    seasonalUse,
  } = req.body;

  try {
    let imageURL = null;
    if (req.file) {
      imageURL = await uploadImageToSupabase(req.file);
    }

    const newCloth = new Clothes({
      userId,
      itemName,
      category,
      type,
      color,
      brand,
      material,
      status,
      usedFrom,
      seasonalUse,
      imageURL,
    });

    await newCloth.save();

    res.status(201).json({
      message: "Cloth added to wardrobe successfully!",
      clothId: newCloth._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding cloth", error: error.message });
  }
};

export const getClothes = async (req, res) => {
  const { userId } = req.body;

  try {
    const clothes = await Clothes.find({ userId });

    if (clothes.length === 0) {
      return res
        .status(404)
        .json({ message: "No clothes found for this user." });
    }

    res.status(200).json(clothes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving clothes", error: error.message });
  }
};

export const removeCloth = async (req, res) => {
  const { clothId } = req.body;

  try {
    const deletedCloth = await Clothes.findByIdAndDelete(clothId);

    if (!deletedCloth) {
      return res.status(404).json({ message: "Cloth not found." });
    }
    await Outfits.deleteMany({ outfitItems: clothId });
    res.status(200).json({ message: "Cloth removed successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing cloth", error: error.message });
  }
};
