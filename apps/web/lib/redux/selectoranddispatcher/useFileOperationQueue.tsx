import { FileOperationSchemaQueueType, FileOperationSchemaType } from "@repo/zod/files-operation-queue";
import { useAppDispatch, useAppSelector } from "../hooks"
import { addOperationToOpsQueue, clearOperationQueue, initializeFileOpsQueueReducer, } from "../features/file-operation-queue";

export const useFileOperations = () => {
    const fileOpsQueue = useAppSelector(state => state.fileOperations)

    const dispatch = useAppDispatch();
    function addOpsToOpsQueue(ops: FileOperationSchemaType) {
        dispatch(addOperationToOpsQueue(ops))
    }

    function clearOpsQueue() {
        dispatch(clearOperationQueue())
    }

    function initializeFileOpsQueue(queue: FileOperationSchemaQueueType) {
        dispatch(initializeFileOpsQueueReducer(queue))
    }

    return { fileOpsQueue, addOpsToOpsQueue, clearOpsQueue, initializeFileOpsQueue }
}