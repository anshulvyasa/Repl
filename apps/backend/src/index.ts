import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { authMiddleWare } from "./app/v1/middleware/auth-middleware";
import dotenv from "dotenv";
import { playGroundRoutes } from "./app/v1/routes/playground/index";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieparser());

dotenv.config();

app.use("/playground", authMiddleWare, playGroundRoutes);

app.listen(PORT, () => {
  console.log("Server is Running at the Port 5000");
});
