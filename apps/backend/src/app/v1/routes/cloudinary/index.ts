import { Router } from "express";
import { POSTimage } from "../../controllers/cloudinary";
import { authMiddleWare } from "../../middleware/auth-middleware";
import { upload } from "../../middleware/multer-middleware";

export const cloudinaryRoutes: Router = Router();

// POST /app/v1/cloudinary/upload - Upload image to Cloudinary
cloudinaryRoutes.post("/upload", authMiddleWare,upload.single('avatar'), POSTimage);