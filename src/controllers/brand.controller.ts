import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Brand from "../models/brand.model";

// ADD BRAND
export const addBrand = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const brand = await Brand.findOne({ name });
    if (brand) {
      res.status(400);
      throw new Error("Brand already exists");
    }
    await Brand.create({ name });
    res.status(201).json({ message: "Brand added" });
  }
);

// UPDATE BRAND
export const updateBrand = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
      res.status(400);
      throw new Error("Name is required");
    }
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name },
      {
        new: true,
      }
    );
    if (!brand) {
      res.status(404);
      throw new Error("Brand not found");
    }
    res.status(200).json({ message: "Brand updated" });
  }
);

// DELETE BRAND
export const deleteBrand = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      res.status(404);
      throw new Error("Brand not found");
    }
    res.status(200).json({ message: "Brand deleted" });
  }
);

// GET BRAND
export const getBrand = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
      res.status(404);
      throw new Error("Brand not found");
    }
    res.status(200).json(brand);
  }
);

// GET ALL BRANDS
export const getAllBrands = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const total = await Brand.countDocuments();
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || total;
    const skip = (page - 1) * limit;

    const allBrands = await Brand.find({
      ...(req.query.search && {
        $or: [{ name: { $regex: req.query.search, $options: "i" } }],
      }),
    })
      .sort({ name: 1 })
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      brands: allBrands,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  }
);
