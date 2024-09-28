import { Outfits } from "../models/OutfitModel.js";
import { Clothes } from "../models/ClothesModel.js";
import { Accessories } from "../models/AccessoriesModel.js";
import axios from "axios";

export const addOutfit = async (req, res) => {
  const { userId, outfitItems, accessoryItems, occasion, notes } = req.body;

  try {
    const clothes = await Clothes.find({ userId, _id: { $in: outfitItems } });
    const accessories = await Accessories.find({
      userId,
      _id: { $in: accessoryItems },
    });

    if (clothes.length !== outfitItems.length) {
      return res
        .status(400)
        .json({ message: "Some clothing items do not belong to the user." });
    }

    if (accessories.length !== accessoryItems.length) {
      return res
        .status(400)
        .json({ message: "Some accessory items do not belong to the user." });
    }

    const newOutfit = new Outfits({
      userId,
      outfitItems,
      accessoryItems,
      occasion,
      notes,
    });

    await newOutfit.save();

    res.status(201).json({
      message: "Outfit created successfully!",
      outfitId: newOutfit._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating outfit", error: error.message });
  }
};

export const getOutfits = async (req, res) => {
  const { userId } = req.body;

  try {
    const outfits = await Outfits.find({ userId })
      .populate("outfitItems")
      .populate("accessoryItems");

    res.status(200).json(outfits);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving outfits", error: error.message });
  }
};
