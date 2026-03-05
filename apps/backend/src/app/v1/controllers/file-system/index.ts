import { prisma } from "@repo/db/jsclient";
import { Prisma } from "@repo/db";
import { Request, Response } from "express";
import { FileOperationSchemaQueue } from "@repo/zod/files-operation-queue";
import {
  readTemplateStructureFromJson,
  saveTemplateStructureToJson,
} from "../../lib/playground/path-to-json";
import fs from "fs/promises";
import path from "path";
import { templatePaths } from "../../lib/template";
import { TemplateItem } from "@repo/zod/files";
import { applyOperation } from "../../lib/playground/apply-operation";

export const getPlaygroundFiles = async (req: Request, res: Response) => {
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
        templatePaths[playground.template as keyof typeof templatePaths]
      );

      const outputPath = path.join(
        process.cwd(),
        "/output",
        templatePaths[playground.template as keyof typeof templatePaths]
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
    console.log("working fine");

    res.status(200).json({
      success: true,
      files: playgroundTemplateFiles,
      playground: playground,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error while fetching The Playground Template Files",
    });
  }
};

//syncing playground files from client to server

export const syncPlaygroundFiles = async (req: Request, res: Response) => {
  const { playgroundId } = req.params;
  const parsedQueue = FileOperationSchemaQueue.safeParse(req.body);

  if (!playgroundId) {
    return res.status(400).json({
      success: false,
      error: "PlaygroundId is not provided",
    });
  }

  if (!parsedQueue.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid operation queue",
    });
  }

  const { items, head } = parsedQueue.data;

  try {
    const templateFile = await prisma.templateFile.findUnique({
      where: { playgroundId },
    });

    if (!templateFile) {
      return res.status(400).json({
        success: false,
        error: "Template files not initialized",
      });
    }

    const structure = structuredClone(templateFile.content) as unknown as TemplateItem;

    for (let i = head; i < items.length; i++) {
      const operation = items[i];
      if (!operation) continue;
      applyOperation(structure, operation);
    }

    await prisma.templateFile.update({
      where: { playgroundId },
      data: {
        content: structure as unknown as Prisma.InputJsonValue,
      },
    });

    return res.status(200).json({
      success: true,
      newHead: items.length,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: "Error while syncing The Playground Template Files",
    });
  }
};

// export const renameFiles = async (req: Request, res: Response) => {
//   const { playgroundId } = req.params;
//   const { path, newName } = req.body;

//   const playgroundIdCheckRes = checkPlaygroundId(playgroundId as string);

//   if (playgroundIdCheckRes) {
//     res.status(400).json(playgroundIdCheckRes);
//     return;
//   }

//   if (path.trim() === "" || newName.trim() === "") {
//     res.status(400).json({
//       success: false,
//       message: "Valid Path or Name is not provided"
//     })
//     return;
//   }

//   try {
//     const playgroundFiles = await prisma.templateFile.findUnique({
//       where: {
//         playgroundId
//       }
//     })

//     const parsedPlaygroundFiles = TemplateFileSchema.safeParse(playgroundFiles);

//     if (!parsedPlaygroundFiles.success) {
//       throw new Error();
//     }

//     let heirarchy = path.split("\\").filter(Boolean);
//     renameFilesOrFolder(parsedPlaygroundFiles.data, heirarchy, 0, newName);

//     await prisma.templateFile.update({
//       where: {
//         playgroundId
//       },
//       data: {
//         content: parsedPlaygroundFiles.data
//       }
//     })
//   }
//   catch (error) {
//     res.status(500).json({
//       success: false,
//       error: "Error while Renaming"
//     })
//   }
// }
