import { TemplateItem } from "@repo/zod/files";

export function checkPlaygroundId(playgroundId: string): object | null {
    if (playgroundId.trim() == "") {
        return {
            success: false,
            error: "PlaygroundId is not provided",
        }
    }
    return null;
}

function renameFilesOrFolder(playground: TemplateItem, path: string, newName: string) {

}