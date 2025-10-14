import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { v1Routes } from "./app/v1";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieparser());

dotenv.config();

app.use("/app/v1", v1Routes);

app.listen(PORT, () => {
  console.log("Server is Running at the Port 5000");
});
