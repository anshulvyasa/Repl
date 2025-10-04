import express from "express";
import { decode } from "@auth/core/jwt";
import cookieparser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieparser());

const AUTH_SECRET = process.env.Auth_SECRET;

app.get("/", async (req, res) => {
  // checking if we can get the use token
  const sessionToken =
    req.cookies["authjs.session-token"] ||
    req.cookies["__Secure-authjs.session-token"];

  console.log("Session Token is ", sessionToken);

  const decoded = await decode({
    token: sessionToken,
    secret: AUTH_SECRET as string,
    salt: "authjs.session-token",
  });

  console.log("decoded Token : ", decoded);

  res.json({
    sucess: true,
    message: "hanji good morning",
  });
});

app.listen(5000, () => {
  console.log("Server is Running at the Port 5000");
});
