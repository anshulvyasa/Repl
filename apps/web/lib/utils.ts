import { TemplateFile, TemplateFolder, TemplateItem } from "@repo/zod/files";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


function isFolder(item: TemplateItem): item is TemplateFolder {
  return "folderName" in item;
}

function isFile(item: TemplateItem): item is TemplateFile {
  return "fileName" in item;
}

function templateFileComparator(a: TemplateItem, b: TemplateItem): number {
  const aIsFolder = isFolder(a);
  const bIsFolder = isFolder(b);

  if (aIsFolder && !bIsFolder) return -1;
  if (!aIsFolder && bIsFolder) return 1;

  if (aIsFolder && bIsFolder) {
    return a.folderName.localeCompare(b.folderName);
  }

  if (isFile(a) && isFile(b)) {
    const aName = `${a.fileName}.${a.fileExtension}`;
    const bName = `${b.fileName}.${b.fileExtension}`;
    return aName.localeCompare(bName);
  }

  return 0;
}

export function sortTemplateTree(items: TemplateItem[]) {
  items.sort(templateFileComparator );

  for (const item of items) {
    if (isFolder(item)) {
      sortTemplateTree(item.items);
    }
  }
}

