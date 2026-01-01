import type { TemplateItem } from '@repo/zod/files'
function stripRoot(path: string[]): string[] {
  return path.slice(1);
}

function isFolder(item: TemplateItem): item is Extract<TemplateItem, { items: TemplateItem[] }> {
  return "items" in item;
}



function isFile(item: TemplateItem): item is Extract<TemplateItem, { fileName: string }> {
    return "fileName" in item;
}

function getItemName(item: TemplateItem): string {
    if (isFolder(item)) {
        return item.folderName;
    }
    return item.fileName
}
export function renameFilesOrFolder(
  root: TemplateItem,
  path: string[],
  _index: number,
  newName: string
) {
  if (!isFolder(root)) return;

  const parentPath = path.slice(0, -1);
  const targetName = path.at(-1);
  if (!targetName) return;

  let parent: TemplateItem = root;

  for (const segment of parentPath) {
    if (!isFolder(parent)) return;

    const next = parent.items.find(
  (item) => isFolder(item) && item.folderName === segment
) as TemplateItem | undefined;

    if (!next) return;
    parent = next;
  }

  if (!isFolder(parent)) return;

  const target = parent.items.find(
    (item) =>
      (isFolder(item) && item.folderName === targetName) ||
      (!isFolder(item) && item.fileName === targetName)
  );

  if (!target) return;

  if (isFolder(target)) {
    target.folderName = newName;
  } else {
    const [name, ...ext] = newName.split(".");
    if (!name) return;
    target.fileName = name;
    target.fileExtension = ext.join(".");
  }
}
export function deleteFilesOrFolder(
  root: TemplateItem,
  path: string[],
  _index: number
) {
  if (!isFolder(root)) return;

  const parentPath = path.slice(0, -1);
  const targetName = path.at(-1);
  if (!targetName) return;

  let parent: TemplateItem = root;

  for (const segment of parentPath) {
    if (!isFolder(parent)) return;

   const next = parent.items.find(
  (item) => isFolder(item) && item.folderName === segment
) as TemplateItem | undefined;

    if (!next) return;
    parent = next;
  }

  if (!isFolder(parent)) return;

  const idx = parent.items.findIndex(
    (item) =>
      (isFolder(item) && item.folderName === targetName) ||
      (!isFolder(item) && item.fileName === targetName)
  );

  if (idx !== -1) {
    parent.items.splice(idx, 1);
  }
}

export function addFileOrFolder(
    playgroundFiles: TemplateItem,
    dataToBeAdded: TemplateItem,
    path: string[],
    index: number,
) {
    if (!isFolder(playgroundFiles)) return;

    if (index === path.length - 1) {
        playgroundFiles.items.push(dataToBeAdded);
        return;
    }

    const nextFolderName = path[index + 1];
    const nextFolder = playgroundFiles.items.find(
        (item) => isFolder(item) && item.folderName === nextFolderName
    );

    if (nextFolder) {
        addFileOrFolder(nextFolder, dataToBeAdded, path, index + 1);
    }
}