import type { TemplateItem } from '@repo/zod/files'

export function renameFilesOrFolder(
    playground: TemplateItem,
    path: string[],
    index: number,
    newName: string
) {
    if (index === path.length - 1) {
        if ("folderName" in playground) {
            playground.folderName = newName;
        } else if ("fileName" in playground) {
            const parts = newName.split(".");
            playground.fileName = parts[0] as string;
            playground.fileExtension = parts.slice(1).join(".");
        }
        return;
    }
    if (!("items" in playground)) return;

    const nextName = path[index + 1];

    for (const item of playground.items) {
        if ("folderName" in item && item.folderName === nextName) {
            renameFilesOrFolder(item, path, index + 1, newName);
            return;
        }

        if (
            "fileName" in item &&
            `${item.fileName}.${item.fileExtension}` === nextName
        ) {
            renameFilesOrFolder(item, path, index + 1, newName);
            return;
        }
    }
}

export function deleteFilesOrFolder(parentFolder: TemplateItem, path: string[], index: number) {
    if (!("folderName" in parentFolder)) return;

    if (index === path.length - 2) {
        const itemToDeleteName = path[index + 1];

        const itemIndex = parentFolder.items.findIndex((item) => {
            if ("folderName" in item) {
                return item.folderName === itemToDeleteName;
            } else {
                return `${item.fileName}.${item.fileExtension}` === itemToDeleteName;
            }
        });

        if (itemIndex !== -1) {
            parentFolder.items.splice(itemIndex, 1);
        }
        return;
    }

    const nextFolderName = path[index + 1];
    const nextFolder = parentFolder.items.find((item) =>
        "folderName" in item && item.folderName === nextFolderName
    );

    if (nextFolder) {
        deleteFilesOrFolder(nextFolder, path, index + 1);
    }
}