import { Router } from "express";

import { authMiddleWare } from "../../middleware/auth-middleware";
import { getPlaygroundFiles ,syncPlaygroundFiles} from "../../controllers/file-system";

export const fileSystemRoutes: Router = Router();

fileSystemRoutes.get("/get/:playgroundId", authMiddleWare, getPlaygroundFiles);
fileSystemRoutes.post("/sync/:playgroundId",authMiddleWare,syncPlaygroundFiles);