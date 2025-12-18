import { decode } from "@auth/core/jwt";
import { NextFunction, Request, Response } from "express";

export const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionToken =
    req.cookies["authjs.session-token"] ||
    req.cookies["__Secure-authjs.session-token"];

  const AUTH_SECRET = process.env.AUTH_SECRET;

  if (!sessionToken) {
    return res.status(401).json({
      success: false,
      data: { message: "No session token provided" },
    });
  }

  try {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieName = isProduction ? "__Secure-authjs.session-token" : "authjs.session-token";

    const decoded = await decode({
      token: sessionToken,
      secret: AUTH_SECRET as string,
      salt: cookieName,
    });

    if (!decoded) {
      return res.status(403).json({
        success: false,
        data: { message: "You are not authorized" },
      });
    }

    req.user = {
      id: decoded.id as string,
      name: decoded.name as string,
      email: decoded.email as string,
    };

    next();
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({
      success: false,
      data: { message: "Invalid token" },
    });
  }
};
