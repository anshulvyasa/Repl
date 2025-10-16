import { Router } from "express";
import {
  CreatePlayGroundController,
  getAllPlaygroundForUser,
} from "../../controllers/playground";
import { authMiddleWare } from "../../middleware/auth-middleware";

export const playGroundRoutes: Router = Router();

playGroundRoutes.post("/create", authMiddleWare, CreatePlayGroundController);
playGroundRoutes.get("/get", authMiddleWare, getAllPlaygroundForUser);
