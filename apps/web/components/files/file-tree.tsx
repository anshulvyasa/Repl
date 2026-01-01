import { RenameFileFolderSchemaType, DeleteFileFolderSchemaType, AddFileFolderSchemaType } from "@repo/zod/files-operation-queue";
import { toast } from "sonner";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { useFileOperations } from "@/lib/redux/selectoranddispatcher/useFileOperation";
import { RenderFile } from "./renderfiles";
import { RenderFolder } from "./rederfolder";
import { TemplateItem } from "@repo/zod/files";
import { LoaderCircle } from "lucide-react";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";

interface FileTreeProps {
    path: string;
    level: number;
    data: TemplateItem | null;

}

const FileTree = ({ path, level, data, }: FileTreeProps) => {

    const { selectedPlayground } = useSelectedPlaygroundInfo();
    const { addOpsToOpsQueue } = useFileOperations();
    const { renameTemplateFilesOrFolder, deleteTemplateFiles, addTemplateFiles,  } = useTemplatePlayground();

    if (!data) {
        return <div className="flex items-center ml-4 gap-2 mt-3">
            <LoaderCircle className="animate-spin duration-200 transition-all h-5 w-5" />
            <span className="font-bold">Loading...</span>
        </div>
    }

    const handleRename = (newName: string, newPath: string) => {
        if (newName.trim() === "") {
            toast.error("Name can't be empty");
            return;
        }
        if (!newName) {
            toast.error("Name can't be null");
            return;
        }
        if (!selectedPlayground?.id) {
            toast.error("No Playground Selected");
            return;
        }

        let ops: RenameFileFolderSchemaType = {
            playgroundId: selectedPlayground?.id,
            path: newPath,
            newName
        };

        const path = newPath.split("/").filter(Boolean);
        addOpsToOpsQueue(ops);
        renameTemplateFilesOrFolder(path, newName)
    }

    const handleDelete = (newPath: string) => {
        if (!selectedPlayground?.id) {
            toast.error("No Playground Selected");
            return;
        }

        const delOps: DeleteFileFolderSchemaType = {
            playgroundId: selectedPlayground.id,
            path: newPath
        }

        addOpsToOpsQueue(delOps);
        const path = newPath.split("/").filter(Boolean);
        deleteTemplateFiles(path);
    }

    const handleAddFileFolder = (item: TemplateItem, path: string) => {
        if (!selectedPlayground?.id) {
            toast.error("No Playground Selected");
            return;
        }

        if ("fileName" in item) {
            if (item.fileName.trim() === "") {
                toast.error("Invalid File Name");
                return;
            }
        }


        const addOps: AddFileFolderSchemaType = {
            playgroundId: selectedPlayground.id,
            path: path,
            data: item
        }

        addOpsToOpsQueue(addOps);
        const newPath = path.split("/").filter(Boolean);
        addTemplateFiles(item, newPath);
        
    }


    const isFile = "fileName" in data;
    if (isFile) {
        return <RenderFile file={data} path={path} handleRename={handleRename} handleDelete={handleDelete} />
    }

    return (
        <RenderFolder folder={data} level={level} path={path} handleRename={handleRename} handleDelete={handleDelete} handleAdd={handleAddFileFolder} />
    )
}

export default FileTree;





