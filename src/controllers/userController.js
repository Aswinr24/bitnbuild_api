import { Users } from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  const {
    name,
    email,
    gender,
    password,
    favouriteColors,
    favouriteBrands,
    preferredOccasions,
    preferredMaterial,
    seasonalPreference,
    favouriteAccessories,
    lifestyle,
    uniqueItems,
  } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new Users({
      name,
      email,
      gender,
      password: hashedPassword,
      favouriteColors,
      favouriteBrands,
      preferredOccasions,
      preferredMaterial,
      seasonalPreference,
      favouriteAccessories,
      lifestyle,
      uniqueItems,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully!", userId: newUser._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful!", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
