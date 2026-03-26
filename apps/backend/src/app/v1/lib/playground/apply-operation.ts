import { FileOperationSchemaType } from "@repo/zod/files-operation-queue";
import { TemplateItem } from "@repo/zod/files";


function normalizePath(path: string, root: TemplateItem): string[] {
  const parts = path.split(/[\\/]/).filter(Boolean);

  if ("folderName" in root && parts[0] === root.folderName) {
    parts.shift();
  }

  return parts;
}

function findFolderByPath(root: TemplateItem, path: string[]): TemplateItem | null {
  let current: TemplateItem = root;

  for (const segment of path) {
    if (!("items" in current)) return null;

    const next = current.items.find(
      (item) => "folderName" in item && item.folderName === segment
    );

    if (!next) return null;
    current = next;
  }

  return current;
}

function findItemIndex(folder: TemplateItem, name: string): number {
  if (!("items" in folder)) return -1;

  return folder.items.findIndex((item) => {
    if ("folderName" in item) return item.folderName === name;
   const fullName = item.fileExtension 
      ? `${item.fileName}.${item.fileExtension}` 
      : item.fileName;
      
    return fullName === name;
  });
}



export function applyOperation(
  root: TemplateItem,
  operation: FileOperationSchemaType
) {
   
  const pathArr = normalizePath(operation.path, root);

  //add
  if ("data" in operation) {
    const parentPath = normalizePath(operation.path, root);
    const parent = findFolderByPath(root, parentPath);

    if (!parent || !("items" in parent)) return;

    parent.items.push(operation.data);
    return;
  }

  //rename
  if ("newName" in operation) {
    const parentPath = pathArr.slice(0, -1);
    const targetName = pathArr.at(-1)!;

    const parent = findFolderByPath(root, parentPath);
    if (!parent || !("items" in parent)) return;

    const idx = findItemIndex(parent, targetName);
    if (idx === -1) return;

    const item = parent.items[idx];
    if (!item) return;
    if ("folderName" in item) {
      
      item.folderName = operation.newName;
    } else {
    const parts = operation.newName.split(".");
    if (parts.length > 1) {
        
        item.fileExtension = parts.pop() || ""; 
        item.fileName = parts.join(".");
    } else {
       
        item.fileName = operation.newName;
        item.fileExtension = ""; 
    }
}
    return;
  }

  //delete
  const parentPath = pathArr.slice(0, -1);
  const targetName = pathArr.at(-1)!;

  const parent = findFolderByPath(root, parentPath);
  if (!parent || !("items" in parent)) return;

  const idx = findItemIndex(parent, targetName);
  if (idx === -1) return;

  parent.items.splice(idx, 1);

 
}
