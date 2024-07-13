import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model";
import { v2 as cloudinary } from "cloudinary";

// ========== USER ==========

// UPDATE PROFILE
export const updateProfile = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("Something went wrong");

    let { avatar } = req.body;
    if ((user.avatar === avatar) === false) {
      await cloudinary.uploader.destroy(avatar.split("/").pop().split(".")[0]);
      const uploadRes = await cloudinary.uploader.upload(avatar);
      avatar = uploadRes.secure_url;
    }

    await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.status(200).json({ message: "Profile updated" });
  }
);

// UPDATE PASSWORD
export const updatePassword = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("Something went wrong");

    if (await user.comparePasswords(oldPassword)) {
      user.password = newPassword;
      await user.save();
      res.status(200).json({ message: "Password updated" });
    } else {
      res.status(400);
      throw new Error("Wrong password");
    }
  }
);

// DELETE PROFILE
export const deleteProfile = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("Something went wrong");
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Admin user can't be deleted");
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted" });
  }
);

// ========== CART ==========

// ADD/REMOVE TO CART
export const addOrRemoveCart = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("Something went wrong");

    const product = user.cart.includes(req.params.productId);
    if (product) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { cart: req.params.productId },
      });
      res.status(200).json({ message: "Product removed" });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { cart: req.params.productId },
      });
      res.status(200).json({ message: "Product added" });
    }
  }
);

// GET CART ITEMS
export const getCart = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id).populate({
      path: "cart",
      options: {
        skip,
        limit,
      },
    });
    if (!user) throw new Error("Something went wrong");

    const total = user?.cart.length;

    res.status(200).json({
      products: user?.cart,
      page,
      pages: Math.ceil(Number(total) / limit),
      total,
    });
  }
);

// REMOVE ALL ITEMS IN CART
export const removeAllInCart = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("Something went wrong");

    user.cart = [];
    await user.save();
    res.status(200).json({ message: "All items removed" });
  }
);

// ========== WISHLIST ==========

// ADD/REMOVE TO WISHLIST
export const addOrRemoveWishList = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("Something went wrong");

    const product = user.wishlist.includes(req.params.productId);
    if (product) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.params.productId },
      });
      res.status(200).json({ message: "Product removed" });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { wishlist: req.params.productId },
      });
      res.status(200).json({ message: "Product added" });
    }
  }
);

// GET WISHLIST ITEMS
export const getWishList = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id).populate({
      path: "wishlist",
      options: {
        skip,
        limit,
      },
    });
    if (!user) throw new Error("Something went wrong");

    const total = user?.wishlist.length;

    res.status(200).json({
      wishlist: user?.wishlist,
      page,
      pages: Math.ceil(Number(total) / limit),
      total,
    });
  }
);

// REMOVE ALL ITEMS IN WISHLIST
export const removeAllInWishList = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("Something went wrong");

    user.wishlist = [];
    await user.save();
    res.status(200).json({ message: "All items removed" });
  }
);

// ========== ADMIN ==========

// GET ALL USERS
export const getAllUsers = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({
      ...(req.query.search && {
        $or: [{ username: { $regex: req.query.search, $options: "i" } }],
      }),
    })
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();
    res.status(200).json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  }
);

// DELETE USER
export const deleteUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Admin user can't be deleted");
    }
    res.status(200).json({ message: "User deleted" });
  }
);
