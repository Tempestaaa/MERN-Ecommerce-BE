import mongoose from "mongoose";

interface iProduct {
  _id: string;
  name: string;
  image: string;
  category: string;
  newPrice: number;
  oldPrice: number;
  date: Date;
  available: boolean;
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, default: "https://picsum.photos/id/237/200/300" },
    category: { type: String, required: true, enum: ["men", "women", "kids"] },
    newPrice: { type: Number, required: true },
    oldPrice: { type: Number },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<iProduct>("product", productSchema);
export default Product;
