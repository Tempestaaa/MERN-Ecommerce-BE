import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Product, { iProduct } from "../models/product.model";
import { v2 as cloudinary } from "cloudinary";

// SLUG
const slugify = (text: string) => {
  return text
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\_/g, "-") // Replace _ with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, ""); // Remove trailing -
};

// ADD PRODUCT
export const addProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const productData: iProduct = req.body;
    const uploadFiles = files.map(async (item) => {
      const b64 = Buffer.from(item.buffer).toString("base64");
      let dataUri = "data:" + item.mimetype + ";base64," + b64;
      const uploadRes = await cloudinary.uploader.upload(dataUri);
      return uploadRes.url;
    });
    const imageUrls = await Promise.all(uploadFiles);

    productData.images = imageUrls;
    productData.slug = slugify(productData.name);

    const data = { productData, files };
    await Product.create(productData);
    res.status(201).json({ message: "Product added" });
  }
);

// GET ALL PRODUCTS
export const getAllProducts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query._page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      ...(req.query._search && {
        $or: [
          { name: { $regex: req.query._search, $options: "i" } },
          { slug: { $regex: req.query._search, $options: "i" } },
        ],
      }),
    })
      .populate("brand")
      .populate("category")
      .sort({ updatedAt: 1 })
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

// DELETE PRODUCT
export const deleteProduct = expressAsyncHandler(
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
