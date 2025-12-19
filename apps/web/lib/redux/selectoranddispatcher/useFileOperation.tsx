import { FileOperationSchemaType } from "@repo/zod/files-operation-queue";
import { useAppDispatch, useAppSelector } from "../hooks"
import { addOperationToOpsQueue, clearOperationQueue, removeOperationFromOpsQueue } from "../features/file-operation-queue";

export const useFileOperations = () => {
    const fileOpsQueue = useAppSelector(state => state.fileOperations)

    const dispatch = useAppDispatch();
    function addOpsToOpsQueue(ops: FileOperationSchemaType) {
        dispatch(addOperationToOpsQueue(ops))
    }
    function removeOpsFromOpsQueue() {
        dispatch(removeOperationFromOpsQueue())
    }
    function clearOpsQueue() {
        dispatch(clearOperationQueue())
    }

    return { fileOpsQueue, addOpsToOpsQueue, removeOpsFromOpsQueue, clearOpsQueue }
}