import { AddFileFolderAndRenameFileFolderSchemaType } from "@repo/zod/files-operation-queue";
import { toast } from "sonner";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { useFileOperations } from "@/lib/redux/selectoranddispatcher/useFileOperation";
import { RenderFile } from "./renderfiles";
import { RenderFolder } from "./rederfolder";
import { TemplateItem } from "@repo/zod/files";
import { LoaderCircle } from "lucide-react";


interface FileTreeProps {
    path: string;
    level: number;
    data: TemplateItem | null;
}

const FileTree = ({ path, level, data }: FileTreeProps) => {

    if (!data) {
        return <div className="flex items-center ml-4 gap-2 mt-3">
            <LoaderCircle className="animate-spin duration-200 transition-all h-5 w-5" />
            <span className="font-bold">Loading...</span>
        </div>
    }

    const { selectedPlayground } = useSelectedPlaygroundInfo();
    const { addOpsToOpsQueue } = useFileOperations();

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

        let ops: AddFileFolderAndRenameFileFolderSchemaType = {
            playgroundId: selectedPlayground?.id,
            path: newPath,
            newName
        };

        addOpsToOpsQueue(ops);
    }


    const isFile = "fileName" in data;
    if (isFile) {
        return <RenderFile file={data} path={path} handleRename={handleRename} />
    }

    return (
        <RenderFolder folder={data} level={level} path={path} />
    )
}

export default FileTree;





