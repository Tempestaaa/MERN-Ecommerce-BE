import mongoose from "mongoose";
import { iUser } from "./user.model";

export interface iReview {
  _id: string;
  user: iUser;
  review: string;
  rating: number;
}

const reviewSchema = new mongoose.Schema<iReview>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  review: { type: String, required: true, unique: true },
  rating: { type: Number, required: true, unique: true },
});

const Review = mongoose.model<iReview>("Review", reviewSchema);

export default Review;
