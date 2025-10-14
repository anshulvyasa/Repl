import { Router } from "express";
import {
  createTemplate,
  deleteTemplate,
  getAllTemplate,
  updatePopularity,
} from "../../controllers/template";

export const templateRoute: Router = Router();

templateRoute.get("/", getAllTemplate);
templateRoute.post("/create", createTemplate);
templateRoute.delete("/delete/:templateID", deleteTemplate);
templateRoute.patch("/update/:id", updatePopularity);
