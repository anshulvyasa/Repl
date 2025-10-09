import { Request, Response } from "express";
import { prisma } from "@repo/db";

export const CreatePlayGroundController = async (
  req: Request,
  res: Response
) => {
  if (!req.user?.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const playgroundCreationResponse = await prisma.playground.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      template: req.body.template,
      userId: req.user?.id,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      message: "You are Succesfully Created your playground",
      playground: playgroundCreationResponse,
    },
  });
};
