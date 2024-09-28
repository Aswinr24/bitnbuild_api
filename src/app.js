import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./services/dbConnect.js";
import userRoutes from "./routes/userRoutes.js";
import clothesRoutes from "./routes/clothesRoutes.js";
import accessoriesRoutes from "./routes/accessoriesRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectToDatabase();

app.use("/api/users", userRoutes);
app.use("/api/clothes", clothesRoutes);
app.use("/api/accessories", accessoriesRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running...." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
