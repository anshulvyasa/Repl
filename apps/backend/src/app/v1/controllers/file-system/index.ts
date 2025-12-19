import { prisma } from "@repo/db/jsclient";
import { Prisma } from "@repo/db";
import { Request, Response } from "express";
import {
  readTemplateStructureFromJson,
  saveTemplateStructureToJson,
} from "../../lib/playground/path-to-json";
import fs from "fs/promises";
import path from "path";
import { templatePaths } from "../../lib/template";
import { checkPlaygroundId } from "../../lib/utils";
import { renameFilesOrFolder } from "@repo/utilities/files-operation";
import { TemplateFileSchema } from "@repo/zod/files";


export const getPlaygroundFiles = async (req: Request, res: Response) => {
  // checking if we have the current user
  if (!req.user?.id) {
    res.status(400).json({
      success: false,
      error: "You Are Not Authenticated",
    });
    return;
  }

  const { playgroundId } = req.params;

  if (!playgroundId) {
    res.status(400).json({
      success: false,
      error: "PlaygroundId is not provided",
    });
    return;
  }

  try {
    const playground = await prisma.playground.findUnique({
      where: {
        id: playgroundId,
      },
    });

    if (!playground) {
      res.status(400).json({
        success: false,
        error: "no Such Playground",
      });
      return;
    }

    let playgroundTemplateFiles = await prisma.templateFile.findUnique({
      where: {
        playgroundId,
      },
    });

    if (!playgroundTemplateFiles) {
      const templatePath = path.join(
        process.cwd(),
        templatePaths[playground.template]
      );

      const outputPath = path.join(
        process.cwd(),
        "/output",
        templatePaths[playground.template]
      );

      await saveTemplateStructureToJson(templatePath, outputPath);
      const fileInJsonStyle = await readTemplateStructureFromJson(outputPath);

      playgroundTemplateFiles = await prisma.templateFile.create({
        data: {
          playgroundId,
          content: fileInJsonStyle as unknown as Prisma.InputJsonValue,
        },
      });

      await fs.rm(outputPath, { recursive: true });
    }

    res.status(200).json({
      success: true,
      files: playgroundTemplateFiles,
      playground: playground
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error while fetching The Playground Template Files",
    });
  }
};


export const renameFiles = async (req: Request, res: Response) => {
  const { playgroundId } = req.params;
  const { path, newName } = req.body;

  const playgroundIdCheckRes = checkPlaygroundId(playgroundId as string);

  if (playgroundIdCheckRes) {
    res.status(400).json(playgroundIdCheckRes);
    return;
  }

  if (path.trim() === "" || newName.trim() === "") {
    res.status(400).json({
      success: false,
      message: "Valid Path or Name is not provided"
    })
    return;
  }

  try {
    const playgroundFiles = await prisma.templateFile.findUnique({
      where: {
        playgroundId
      }
    })

    const parsedPlaygroundFiles = TemplateFileSchema.safeParse(playgroundFiles);

    if (!parsedPlaygroundFiles.success) {
      throw new Error();
    }

    let heirarchy = path.split("\\").filter(Boolean);
    renameFilesOrFolder(parsedPlaygroundFiles.data, heirarchy, 0, newName);

    await prisma.templateFile.update({
      where: {
        playgroundId
      },
      data: {
        content: parsedPlaygroundFiles.data
      }
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: "Error while Renaming"
    })
  }
}
