import { Router } from "express";

import { authMiddleWare } from "../../middleware/auth-middleware.js";
import { getPlaygroundFiles ,syncPlaygroundFiles} from "../../controllers/file-system/index.js";

export const fileSystemRoutes: Router = Router();

fileSystemRoutes.get("/get/:playgroundId", authMiddleWare, getPlaygroundFiles);
fileSystemRoutes.post("/sync/:playgroundId",authMiddleWare,syncPlaygroundFiles);