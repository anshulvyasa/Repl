import { Request, Response } from "express";
import { prisma } from "@repo/db";
import { TemplateDataSchema } from "@repo/zod/playground";

export const getAllTemplate = async (req: Request, res: Response) => {
  try {
    const getTemplateRes = await prisma.templates.findMany();

    // filtering logic to do and return most popular one

    res.status(200).json({
      success: true,
      data: getTemplateRes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error Fetching Template",
    });
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  const parsedBody = TemplateDataSchema.safeParse(req.body);

  if (parsedBody.error) {
    res.status(400).json({ success: false, error: "Wrong Data Send" });
    return;
  }

  try {
    await prisma.templates.create({
      data: {
        name: parsedBody.data.name,
        description: parsedBody.data.description,
        icon: parsedBody.data.icon,
        color: parsedBody.data.color,
        popularity: parsedBody.data.popularity,
        tags: parsedBody.data.tags,
        features: parsedBody.data.features,
        category: parsedBody.data.category,
      },
    });

    res.status(200).json({
      success: true,
      message: "template Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error creating Template",
    });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  const id = req.params.templateId;

  try {
    await prisma.templates.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error While Deleting The Template",
    });
  }
};

export const updatePopularity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 0 and 5" });
    }

    const template = await prisma.templates.findUnique({
      where: { id },
      select: { popularity: true, ratingCount: true },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const newRatingCount = Number(template.ratingCount) + 1;
    const newPopularity =
      (template.popularity * Number(template.ratingCount) + rating) /
      newRatingCount;

    const updated = await prisma.templates.update({
      where: { id },
      data: {
        popularity: newPopularity,
        ratingCount: newRatingCount,
      },
    });

    return res.status(200).json({
      message: "Rating updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
