import { Router } from "express";
import { POSTimage } from "../../controllers/cloudinary";
import { authMiddleWare } from "../../middleware/auth-middleware";

export const cloudinaryRoutes: Router = Router();

// POST /api/v1/cloudinary/upload - Upload image to Cloudinary
cloudinaryRoutes.post("/upload", authMiddleWare, POSTimage);