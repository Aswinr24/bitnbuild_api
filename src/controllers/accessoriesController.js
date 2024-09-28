import { Accessories } from "../models/AccessoriesModel.js";

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
    seasonalUse,
  } = req.body;
  try {
    const newAccessory = new Accessories({
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

    await newAccessory.save();

    res
      .status(201)
      .json({
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
