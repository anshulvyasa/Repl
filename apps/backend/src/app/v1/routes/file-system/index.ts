import { Router } from "express";

import { authMiddleWare } from "../../middleware/auth-middleware";
import { getPlaygroundFiles } from "../../controllers/file-system";

export const fileSystemRoutes: Router = Router();

fileSystemRoutes.get("/get/:playgroundId", authMiddleWare, getPlaygroundFiles);
