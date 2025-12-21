import type { TemplateItem } from '@repo/zod/files'

function isFolder(item: TemplateItem): item is Extract<TemplateItem, { folderName: string }> {
    return "folderName" in item;
}

function isFile(item: TemplateItem): item is Extract<TemplateItem, { fileName: string }> {
    return "fileName" in item;
}

function getItemName(item: TemplateItem): string {
    if (isFolder(item)) {
        return item.folderName;
    }
    return `${item.fileName}.${item.fileExtension}`;
}

export function renameFilesOrFolder(
    playground: TemplateItem,
    path: string[],
    index: number,
    newName: string
) {
    if (index === path.length - 1) {
        if (isFolder(playground)) {
            playground.folderName = newName;
        } else if (isFile(playground)) {
            const parts = newName.split(".");
            playground.fileName = parts[0] as string;
            playground.fileExtension = parts.slice(1).join(".");
        }
        return;
    }

    if (!isFolder(playground)) return;

    const nextName = path[index + 1];
    const nextItem = playground.items.find(item => getItemName(item) === nextName);

    if (nextItem) {
        renameFilesOrFolder(nextItem, path, index + 1, newName);
    }
}

export function deleteFilesOrFolder(parentFolder: TemplateItem, path: string[], index: number) {
    if (!isFolder(parentFolder)) return;

    if (index === path.length - 2) {
        const itemToDeleteName = path[index + 1];
        const itemIndex = parentFolder.items.findIndex(
            (item) => getItemName(item) === itemToDeleteName
        );

        if (itemIndex !== -1) {
            parentFolder.items.splice(itemIndex, 1);
        }
        return;
    }

    const nextFolderName = path[index + 1];
    const nextFolder = parentFolder.items.find(
        (item) => isFolder(item) && item.folderName === nextFolderName
    );

    if (nextFolder) {
        deleteFilesOrFolder(nextFolder, path, index + 1);
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