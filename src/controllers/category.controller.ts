import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Category from "../models/category.model";

// ADD CATEGORY
export const addCategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await Category.findOne({ name });
    if (category) {
      res.status(400);
      throw new Error("Category already exists");
    }
    await Category.create(req.body);
    res.status(201).json({ message: "Category added" });
  }
);

// UPDATE CATEGORY
export const updateCategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
      res.status(400);
      throw new Error("Name is required");
    }
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.status(200).json({ message: "Category updated" });
  }
);

// DELETE CATEGORY
export const deleteCategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.status(200).json({ message: "Category deleted" });
  }
);

// GET CATEGORY
export const getCategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.status(200).json(category);
  }
);

// GET ALL CATEGORIES
export const getAllCategories = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const total = await Category.countDocuments();
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || total;
    const skip = (page - 1) * limit;

    const allCategories = await Category.find({
      ...(req.query.search && {
        $or: [{ name: { $regex: req.query.search, $options: "i" } }],
      }),
    })
      .sort({ name: 1 })
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      categories: allCategories,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  }
);
