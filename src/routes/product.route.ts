import { Request, Response, Router } from "express";
import {
  addProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

router.post("/add", upload.array("images"), addProduct);
router.get("/", getAllProducts);
router.route("/").get(getProduct).put(updateProduct).delete(deleteProduct);

router.post(
  "/upload",
  upload.array("images"),
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const body = req.body;
    // res.json(data);
    const uploadFiles = files.map(async (item) => {
      const b64 = Buffer.from(item.buffer).toString("base64");
      let dataUri = "data:" + item.mimetype + ";base64," + b64;
      const uploadRes = await cloudinary.uploader.upload(dataUri);
      return uploadRes.url;
    });

    const imgUrls = await Promise.all(uploadFiles);
    const data = { body, imgUrls };
    res.json(data);
  }
);

export default router;
