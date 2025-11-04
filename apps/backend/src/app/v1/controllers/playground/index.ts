import { Request, Response } from "express";
import { prisma } from "@repo/db/jsclient";
import {
  createPlaygroundSchema,
  editPlaygroundSchema,
  editStarMark,
} from "@repo/zod/playground";


export const CreatePlayGroundController = async (
  req: Request,
  res: Response
) => {
  if (!req.user?.id) {
    res.status(400).json({
      success: false,
      error: "You Are Not Authenticated",
    });
    return;
  }

  const parsedBody = createPlaygroundSchema.safeParse(req.body);

  if (parsedBody.error) {
    res.status(400).json({
      success: false,
      error: "Wrong Data is send",
    });
    return;
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
        playgroundId: playgroundCreationResponse.id,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error while Creating The Playground",
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
      orderBy: {
        createdAt: "desc",
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

export const editPlayGround = async (req: Request, res: Response) => {
  const parsedBody = editPlaygroundSchema.safeParse(req.body);
  const { playgroundId } = req.params;

  if (!playgroundId) {
    res.status(400).json({
      success: false,
      error: "Playground ID not Provided",
    });
    return;
  }

  if (parsedBody.error) {
    res.status(400).json({
      success: false,
      error: "wrong data provided",
    });
    return;
  }

  try {
    await prisma.playground.update({
      where: {
        id: playgroundId,
      },
      data: {
        title: parsedBody.data.title,
        description: parsedBody.data.description,
      },
    });

    res.status(200).json({
      success: true,
      message: "playground information updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating the playground Information",
    });
  }
};

export const deletePlayground = async (req: Request, res: Response) => {
  const { playgroundId } = req.params;

  if (!playgroundId) {
    res.status(400).json({
      success: false,
      error: "Playground id is not provided",
    });
    return;
  }

  try {
    await prisma.playground.delete({
      where: {
        id: playgroundId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Playground Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error Deleting The Playground",
    });
  }
};

export const starMarkPlayground = async (req: Request, res: Response) => {
  const parsedBody = editStarMark.safeParse(req.body);
  const { playgroundId } = req.params;

  if (!req.user?.id) {
    return res.status(400).json({
      success: false,
      error: "You Are Not Authenticated",
    });
  }

  if (!playgroundId) {
    res.status(400).json({
      success: false,
      error: "Playground ID not Provided",
    });
    return;
  }

  if (parsedBody.error) {
    res.status(400).json({
      success: false,
      error: "wrong data provided",
    });
    return;
  }

  try {
    if (parsedBody.data.isMarked) {
      await prisma.starMark.create({
        data: {
          isMarked: parsedBody.data.isMarked,
          userId: req.user?.id,
          playgroundId: playgroundId,
        },
      });

      res.status(200).json({
        success: true,
        message: "Playground is marked Successfully",
      });
      return;
    }

    await prisma.starMark.delete({
      where: {
        userId_playgroundId: {
          userId: req.user.id,
          playgroundId: playgroundId,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Playground unMarked Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error starring the Playground",
    });
  }
};
