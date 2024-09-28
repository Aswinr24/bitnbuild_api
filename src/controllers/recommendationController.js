import { Users } from "../models/UserModel.js";
import { Accessories } from "../models/AccessoriesModel.js";
import { Clothes } from "../models/ClothesModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getOutfitRecommendations = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const clothes = await Clothes.find({ userId });
    const accessories = await Accessories.find({ userId });

    const wardrobeList = [...clothes, ...accessories];

    const prompt = `You are a fashion advisor. Based on the following wardrobe items and user preferences, provide concise outfit suggestions in a structured format.
      
      Wardrobe:
      ${JSON.stringify(wardrobeList)}

      User Preferences:
      - Favorite Colors: ${
        Array.isArray(user.favouriteColors)
          ? user.favouriteColors.join(", ")
          : user.favouriteColors || "None"
      }
      - Favorite Brands: ${
        Array.isArray(user.favouriteBrands)
          ? user.favouriteBrands.join(", ")
          : user.favouriteBrands || "None"
      }
      - Preferred Occasions: ${
        Array.isArray(user.preferredOccasions)
          ? user.preferredOccasions.join(", ")
          : user.preferredOccasions || "None"
      }
      - Seasonal Preference: ${
        Array.isArray(user.seasonalPreference)
          ? user.seasonalPreference.join(", ")
          : user.seasonalPreference || "None"
      }
      - Favorite Accessories: ${
        Array.isArray(user.favouriteAccessories)
          ? user.favouriteAccessories.join(", ")
          : user.favouriteAccessories || "None"
      }
      - Lifestyle: ${user.lifestyle}

       For each outfit suggestion, provide the following key-value pairs:
      - outfit_name: (A short title for the outfit)
      - items: (A list of items needed for the outfit, marking any item not in the wardrobe with "BUY")
      - styling_tips: (Short styling tips for the outfit)

      Return the suggestions as an array of objects.
    `;

    const result = await model.generateContent(prompt);

    const contentText = result.response.candidates[0].content.parts[0].text;

    const jsonString = contentText.replace(/```json\s*|\s*```/g, "");
    const recommendations = JSON.parse(jsonString);

    const filteredRecommendations = recommendations.map((outfit) => {
      return {
        outfit_name: outfit.outfit_name,
        items: outfit.items.map((item) => ({
          itemName: item.itemName,
          category: item.category,
          type: item.type,
          color: item.color,
          brand: item.brand,
        })),
        styling_tips: outfit.styling_tips,
      };
    });

    res.status(200).json({ filteredRecommendations });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching recommendations",
      error: error.message,
    });
  }
};

export const getSellDonateRecommendations = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const clothes = await Clothes.find({ userId });
    const accessories = await Accessories.find({ userId });

    const wardrobeList = [...clothes, ...accessories];

    const prompt = `
        You are a fashion advisor. Based on the following wardrobe items and user preferences, provide concise outfit suggestions in a structured format. 
  
        Wardrobe:
        ${JSON.stringify(wardrobeList)}
  
        User Preferences:
        User Preferences:
      - Favorite Colors: ${
        Array.isArray(user.favouriteColors)
          ? user.favouriteColors.join(", ")
          : user.favouriteColors || "None"
      }
      - Favorite Brands: ${
        Array.isArray(user.favouriteBrands)
          ? user.favouriteBrands.join(", ")
          : user.favouriteBrands || "None"
      }
      - Preferred Occasions: ${
        Array.isArray(user.preferredOccasions)
          ? user.preferredOccasions.join(", ")
          : user.preferredOccasions || "None"
      }
      - Seasonal Preference: ${
        Array.isArray(user.seasonalPreference)
          ? user.seasonalPreference.join(", ")
          : user.seasonalPreference || "None"
      }
      - Favorite Accessories: ${
        Array.isArray(user.favouriteAccessories)
          ? user.favouriteAccessories.join(", ")
          : user.favouriteAccessories || "None"
      }
        - Lifestyle: ${user.lifestyle}
  
      For each item, categorize it into one of the following categories:
      - Sell: Items in good condition that are no longer needed.
      - Donate: Items that are old or no longer fit the user's preferences or style.

      Provide the recommendations in a structured format with the following key-value pairs:
      - item_name: (Name of the item)
      - category: (Either "Sell" or "Donate")
      - reason: (Brief reason for the recommendation)

      Return the suggestions as an array of objects.
      `;

    const result = await model.generateContent(prompt);

    const contentText = result.response.candidates[0].content.parts[0].text;

    const jsonString = contentText.replace(/```json\s*|\s*```/g, "");
    const recommendations = JSON.parse(jsonString);

    res.status(200).json({ recommendations });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching sell/donate recommendations",
      error: error.message,
    });
  }
};
