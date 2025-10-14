import { Router } from "express";
import { playGroundRoutes } from "./routes/playground";
import { templateRoute } from "./routes/template";

export const v1Routes: Router = Router();

v1Routes.use("/playground", playGroundRoutes);
v1Routes.use("/template", templateRoute);
