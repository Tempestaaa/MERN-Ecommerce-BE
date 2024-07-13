import mongoose from "mongoose";

export interface iBrand {
  _id: string;
  name: string;
}

const brandSchema = new mongoose.Schema<iBrand>({
  name: { type: String, required: true, unique: true },
});

const Brand = mongoose.model<iBrand>("Brand", brandSchema);

export default Brand;
