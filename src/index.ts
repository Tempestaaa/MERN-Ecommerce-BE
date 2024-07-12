import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

import { errorHandler, notFound } from "./middlewares/error.middleware";
import dbConnect from "./configs/dbConnect";
import authRoutes from "./routes/auth.route";
import productRoutes from "./routes/product.route";

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

dbConnect();
const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://mern-ecommerce-fe-a0dt.onrender.com",
    ],
  })
);
app.use(express.json({ limit: "2MB" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
