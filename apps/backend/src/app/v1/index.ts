import { Router } from "express";
import { playGroundRoutes } from "./routes/playground";
import { templateRoute } from "./routes/template";
import { fileSystemRoutes } from "./routes/file-system";

export const v1Routes: Router = Router();

v1Routes.use("/playground", playGroundRoutes);
v1Routes.use("/template", templateRoute);
v1Routes.use("/files", fileSystemRoutes);
