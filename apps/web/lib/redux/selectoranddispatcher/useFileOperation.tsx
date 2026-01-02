import { FileOperationSchemaType } from "@repo/zod/files-operation-queue";
import { useAppDispatch, useAppSelector } from "../hooks"
import { addOperationToOpsQueue, clearOperationQueue, fileQueueThunk,  } from "../features/file-operation-queue";

export const useFileOperations = () => {
    const fileOpsQueue = useAppSelector(state => state.fileOperations)

    const dispatch = useAppDispatch();
    function addOpsToOpsQueue(ops: FileOperationSchemaType) {
        dispatch(addOperationToOpsQueue(ops))
        dispatch(fileQueueThunk())
    }
    
    function clearOpsQueue() {
        dispatch(clearOperationQueue())
    }

    return { fileOpsQueue, addOpsToOpsQueue, clearOpsQueue }
}