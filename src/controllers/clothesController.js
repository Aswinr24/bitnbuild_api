import { Clothes } from "../models/ClothesModel.js";

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
    seasonalUse,
  } = req.body;

  try {
    const newCloth = new Clothes({
      userId,
      itemName,
      category,
      type,
      color,
      brand,
      material,
      status,
      seasonalUse,
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
