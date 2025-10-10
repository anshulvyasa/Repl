import { Router } from "express";
import {
  CreatePlayGroundController,
  getAllPlaygroundForUser,
} from "../../controllers/playground";

export const playGroundRoutes: Router = Router();

playGroundRoutes.post("/create", CreatePlayGroundController);
playGroundRoutes.get("/get", getAllPlaygroundForUser);
