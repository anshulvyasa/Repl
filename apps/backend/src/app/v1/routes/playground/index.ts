import { Router } from "express";
import { CreatePlayGroundController } from "../../controllers/playground";

export const playGroundRoutes: Router = Router();

playGroundRoutes.post("/create", CreatePlayGroundController);
