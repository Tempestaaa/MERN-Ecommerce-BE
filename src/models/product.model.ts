import mongoose from "mongoose";
import { iBrand } from "./brand.model";
import { iCategory } from "./category.model";
import { iReview } from "./review.model";

interface iProduct {
  _id: string;
  name: string;
  slug: string;
  desc: string;
  images: string;
  colors: string;
  sizes: string;
  brand: iBrand;
  category: iCategory;
  inStock: number;
  rating: number;
  price: number;
  sold: number;
  isDiscount: boolean;
  numOfReviews: number;
  reviews: iReview[];
}

const productSchema = new mongoose.Schema<iProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    desc: { type: String, required: true },
    images: [{ type: String, required: true }],
    colors: [{ type: String, required: true }],
    sizes: [{ type: String, required: true }],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isDiscount: { type: Boolean, default: false },
    inStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    price: { type: Number, required: true },
    sold: { type: Number },
    numOfReviews: { type: Number },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<iProduct>("Product", productSchema);
export default Product;
