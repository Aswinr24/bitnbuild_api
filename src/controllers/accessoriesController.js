import { Accessories } from "../models/AccessoriesModel.js";
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

export const addAccessory = async (req, res) => {
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

    const newAccessory = new Accessories({
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

    await newAccessory.save();

    res.status(201).json({
      message: "Accessory added successfully!",
      accessoryId: newAccessory._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding accessory", error: error.message });
  }
};

export const getAccessories = async (req, res) => {
  const { userId } = req.body;

  try {
    const accessories = await Accessories.find({ userId });

    if (accessories.length === 0) {
      return res
        .status(404)
        .json({ message: "No accessories found for this user." });
    }

    res.status(200).json(accessories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving accessories", error: error.message });
  }
};

export const removeAccessory = async (req, res) => {
  const { accessoryId } = req.body;

  try {
    const deletedAccessory = await Accessories.findByIdAndDelete(accessoryId);

    if (!deletedAccessory) {
      return res.status(404).json({ message: "Accessory not found." });
    }
    await Outfits.deleteMany({ accessoryItems: accessoryId });

    res.status(200).json({ message: "Accessory removed successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing accessory", error: error.message });
  }
};
