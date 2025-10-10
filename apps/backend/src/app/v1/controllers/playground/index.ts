import { Request, Response } from "express";
import { prisma } from "@repo/db";
import { createPlaygroundSchema } from "@repo/zod/playground";

export const CreatePlayGroundController = async (
  req: Request,
  res: Response
) => {
  if (!req.user?.id) {
    return res.status(400).json({
      success: false,
      data: {
        message: "User not authenticated",
      },
    });
  }

  const parsedBody = createPlaygroundSchema.safeParse(req.body);

  if (parsedBody.error) {
    return res.status(400).json({
      success: false,
      data: {
        message: "Credentials are not Correct",
      },
    });
  }

  try {
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
  } catch (err) {
    res.status(500).json({
      success: false,
      data: {
        message: "Error while Creating The Playground",
      },
    });
  }
};

export const getAllPlaygroundForUser = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(400).json({
      success: false,
      data: {
        message: "User not authenticated",
      },
    });
  }

  try {
    const playgrounds = await prisma.playground.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        user: true,
        starmark: {
          where: {
            userId: req.user.id,
          },
          select: {
            isMarked: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        message: "get all playground successfully",
        playgrounds,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: {
        message: "Error while Fetching Your Playground",
      },
    });
  }
};
