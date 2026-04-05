import { Router } from "express";
import { POSTimage } from "../../controllers/cloudinary/index.js";
import { authMiddleWare } from "../../middleware/auth-middleware.js";
import { upload } from "../../middleware/multer-middleware.js";

export const cloudinaryRoutes: Router = Router();

// POST /app/v1/cloudinary/upload - Upload image to Cloudinary
cloudinaryRoutes.post("/upload", authMiddleWare,upload.single('avatar'), POSTimage);