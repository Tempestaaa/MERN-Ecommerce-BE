import mongoose from "mongoose";

export interface iCategory {
  _id: string;
  name: string;
}

const categorySchema = new mongoose.Schema<iCategory>({
  name: { type: String, required: true, unique: true },
});

const Category = mongoose.model<iCategory>("Category", categorySchema);

export default Category;
