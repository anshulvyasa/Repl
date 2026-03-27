import { TemplateFile, TemplateFolder, TemplateItem } from "@repo/zod/files";
import { FileNode, FileSystemTree } from "@webcontainer/api";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// General Helper Function
function isFolder(item: TemplateItem): item is TemplateFolder {
  return "folderName" in item;
}

function isFile(item: TemplateItem): item is TemplateFile {
  return "fileName" in item;
}

function consturctFullFileName(fileName: string, fileExtension: string) {
  if (fileExtension.trim() === "") {
    return fileName;
  }

  return `${fileName}.${fileExtension}`;
}


// Playground Files Selction Helper Function
export function templateFileComparator(a: TemplateItem, b: TemplateItem): number {
  const aIsFolder = isFolder(a);
  const bIsFolder = isFolder(b);


  if (aIsFolder && !bIsFolder) return -1;
  if (!aIsFolder && bIsFolder) return 1;


  if (aIsFolder && bIsFolder) {
    return a.folderName.localeCompare(b.folderName, undefined, {
      sensitivity: "base",
    });
  }


  if (isFile(a) && isFile(b)) {
    const aName = `${a.fileName}.${a.fileExtension}`;
    const bName = `${b.fileName}.${b.fileExtension}`;

    return aName.localeCompare(bName, undefined, {
      sensitivity: "base",
    });
  }

  return 0;
}


export function sortTemplateTree(items: TemplateItem[]): TemplateItem[] {
  return [...items]
    .sort(templateFileComparator)
    .map((item) =>
      isFolder(item)
        ? { ...item, items: sortTemplateTree(item.items) }
        : item
    );
}


// Building The Helper Function For Web Container
export function buildWebContainerFileTree(files: TemplateItem, webContainerFiles: FileSystemTree) {
  if (isFile(files)) {
    const fullFileName = `${consturctFullFileName(files.fileName, files.fileExtension)}`;

    webContainerFiles[fullFileName] = {
      file: {
        contents: `${files.content}`
      }
    };

    return;
  }

  const folderTree: FileSystemTree = {};

  for (const item of files.items) {
    buildWebContainerFileTree(item, folderTree);
  }

  webContainerFiles[files.folderName] = {
    directory: folderTree
  };
}


