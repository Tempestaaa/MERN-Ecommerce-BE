import { Request, Response, Router } from "express";
import {
  addProduct,
  getAllProducts,
  getProduct,
  removeProduct,
  updateProduct,
} from "../controllers/product.controller";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const router = Router();

router.post("/add", addProduct);
router.get("/", getAllProducts);
router.route("/").get(getProduct).put(updateProduct).delete(removeProduct);

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

router.post(
  "/upload",
  upload.array("img"),
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const body = req.body;
    const data = { body, files };
    res.json(data);
    // const uploadFiles = files.map(async (item) => {
    //   const b64 = Buffer.from(item.buffer).toString("base64");
    //   let dataUri = "data:" + item.mimetype + ";base64," + b64;
    //   const uploadRes = await cloudinary.uploader.upload(dataUri);
    //   return uploadRes.url;
    // });

    // const imgUrls = await Promise.all(uploadFiles);
    // res.json(imgUrls);
  }
);

export default router;
