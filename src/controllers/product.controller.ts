import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/product.model";
import { v2 as cloudinary } from "cloudinary";

// ADD PRODUCT
export const addProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    let { image } = req.body;

    const uploadRes = await cloudinary.uploader.upload(image);
    image = Promise.all(uploadRes.secure_url);

    const product = await Product.create(req.body);
    res.json(product);
  }
);

// GET ALL PRODUCTS
export const getAllProducts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query._page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      ...(req.query._search && {
        $or: [{ name: { $regex: req.query._search, $options: "i" } }],
      }),
    })
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments();
    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  }
);

// REMOVE PRODUCT
export const removeProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json({ message: "Product removed" });
  }
);

// UPDATE PRODUCT
export const updateProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json({ message: `${product.name} updated` });
  }
);

// GET A PRODUCT
export const getProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  }
);
