import axios from "axios";
import { Users, Clothes, Accessories } from "../models";

export const getRecommendations = async (req, res) => {
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
      Generate a few outfit recommendations based on the following wardrobe:
      
      Wardrobe:
      ${JSON.stringify(wardrobeList)}

      User Preferences:
      - Favorite Colors: ${user.favouriteColors.join(", ")}
      - Favorite Brands: ${user.favouriteBrands.join(", ")}
      - Preferred Occasions: ${user.preferredOccasions.join(", ")}
      - Seasonal Preference: ${user.seasonalPreference.join(", ")}
      - Favorite Accessories: ${user.favouriteAccessories.join(", ")}

      Provide 5 outfit combinations suitable for casual and formal occasions, along with any styling tips.
    `;

    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        prompt,
        model: "text-davinci-003",
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `{process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const outfitRecommendations = response.data.choices[0].text
      .trim()
      .split("\n\n")
      .map((outfitText) => {
        const lines = outfitText
          .split("\n")
          .filter((line) => line.trim() !== "");
        const outfitId = new mongoose.Types.ObjectId();

        return {
          outfitId: outfitId,
          outfitDescription: lines[0],
          outfitItems: extractOutfitItems(lines),
        };
      });

    res.status(200).json({ recommendations: outfitRecommendations });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching recommendations",
      error: error.message,
    });
  }
};
