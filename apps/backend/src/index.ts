// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { v1Routes } from "./app/v1";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieparser());

app.use("/app/v1", v1Routes);

app.listen(PORT, () => {
  console.log("Server is Running at the Port 5000");
});
