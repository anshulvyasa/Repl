import { Router } from "express";
import { playGroundRoutes } from "./routes/playground/index.js";
import { templateRoute } from "./routes/template/index.js";
import { fileSystemRoutes } from "./routes/file-system/index.js";
import {cloudinaryRoutes} from "./routes/cloudinary/index.js"

export const v1Routes: Router = Router();

v1Routes.use("/playground", playGroundRoutes);
v1Routes.use("/template", templateRoute);
v1Routes.use("/files", fileSystemRoutes);
v1Routes.use("/cloudinary",cloudinaryRoutes)
