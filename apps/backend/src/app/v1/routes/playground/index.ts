import { Router } from "express";
import {
  CreatePlayGroundController,
  deletePlayground,
  editPlayGround,
  getAllPlaygroundForUser,
  starMarkPlayground,
} from "../../controllers/playground/index.js";
import { authMiddleWare } from "../../middleware/auth-middleware.js";

export const playGroundRoutes: Router = Router();

playGroundRoutes.post("/create", authMiddleWare, CreatePlayGroundController);
playGroundRoutes.get("/get", authMiddleWare, getAllPlaygroundForUser);
playGroundRoutes.patch(
  "/startmark/:playgroundId",
  authMiddleWare,
  starMarkPlayground
);
playGroundRoutes.delete(
  "/delete/:playgroundId",
  authMiddleWare,
  deletePlayground
);
playGroundRoutes.patch("/update/:playgroundId", authMiddleWare, editPlayGround);
