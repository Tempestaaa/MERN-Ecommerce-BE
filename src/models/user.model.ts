import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface iUser {
  _id: string;
  username: string;
  fullName: string;
  password: string;
  avatar: string;
  isAdmin: boolean;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  cart: string[];
  wishlist: string[];
  refreshToken: string;
}

export interface UserDocument extends iUser, Document {
  comparePasswords: (enteredPassword: string) => Promise<boolean>;
}

export const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, min: 6 },
    email: { type: String, required: true, unique: true, min: 6 },
    fullName: { type: String, required: true },
    password: { type: String, required: true, min: 6 },
    phone: { type: String, required: true },
    avatar: { type: String, default: "https://picsum.photos/id/63/200/300" },
    isAdmin: { type: Boolean, default: false },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, requried: true },
    cart: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] },
    ],
    wishlist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] },
    ],

    // TOKEN
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePasswords = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
