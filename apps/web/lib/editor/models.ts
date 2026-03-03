import { TemplateFile, TemplateItem } from "@repo/zod/files";
import { Monaco } from "@monaco-editor/react"


export const createMonacoModelsFromTemplateFiles = (
    files: TemplateItem,
    monaco: Monaco
) => {

    console.log("Inside the Model GeneratorF");
    const pathToContent: Map<string, string> = new Map();
    const path: string[] = [];

    derivingPathMapGenerator(files, path, pathToContent);

    for (const [filePath, content] of pathToContent.entries()) {
        const uri = monaco.Uri.parse(`file:///${filePath}`);

        const existingModel = monaco.editor.getModel(uri);
        if (existingModel) continue;

        monaco.editor.createModel(
            content,
            "typescript",
            uri
        );
    }

    // console.log("Models are : ")
    // const models = monaco.editor.getModels();

    // const uris = monaco.editor.getModels().map(
    //     model => model.uri.toString()
    // );

    // console.log(uris);
};

const isFile = (item: TemplateItem) => {
    return "fileName" in item;
}

export const generateFilePath = (path: string[], file: TemplateFile) => {
    let partialPath = path.join("/");

    if (file.fileExtension.trim() === "") {
        partialPath = partialPath.concat(`/${file.fileName}`);
    } else {
        partialPath = partialPath.concat(
            `/${file.fileName}.${file.fileExtension}`
        );
    }

    return partialPath;
};


const derivingPathMapGenerator = (items: TemplateItem, path: string[], pathToContent: Map<string, string>) => {
    if (isFile(items)) {
        const filePath = generateFilePath(path, items);
        pathToContent.set(filePath, items.content);
        return;
    }

    for (const item of items.items) {
        path.push(items.folderName);
        derivingPathMapGenerator(item, path, pathToContent);
        path.pop();
    }
}