import type { TemplateItem } from '@repo/zod/files'

export function renameFilesOrFolder(
    playground: TemplateItem,
    path: string[],
    index: number,
    newName: string
) {
    if (index === path.length - 1) {
        if ("folderName" in playground && playground.folderName === path[index]) {
            playground.folderName = newName;
        } else if ("fileName" in playground && `${playground.fileName}.${playground.fileExtension}` === path[index]) {
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