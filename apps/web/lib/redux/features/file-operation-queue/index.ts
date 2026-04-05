import { createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {
  FileOperationSchemaQueueType,
  FileOperationSchemaQueue,
  FileOperationSchemaType,
} from "@repo/zod/files-operation-queue";



const initialState: FileOperationSchemaQueueType = {
  items: [],
  head: 0,
};


//slice
const slice = createSlice({
  name: "fileOperationQueue",
  initialState,
  reducers: {
    addOperationToOpsQueue(state, action:PayloadAction<FileOperationSchemaType>) {
      state.items.push(action.payload);
    },

    clearOperationQueue(state) {
      state.items = [];
      state.head = 0;
    },

    setQueueHead(state, action) {
      state.head = action.payload;
    },

    initializeFileOpsQueueReducer(state,action:PayloadAction<FileOperationSchemaQueueType>){
         console.log("Inside Initialize state",action.payload)  

         return action.payload;
    }
  },
});

export default slice.reducer;
export const { addOperationToOpsQueue, clearOperationQueue, setQueueHead, initializeFileOpsQueueReducer } =
  slice.actions;




//   export const localFileUpdateThunk = (): AppThunk => (dispatch, getState) => {
//     const fileOpsQueue = getState().fileOperations;

//     if (fileOpsQueue.head == -1) return;

//     const currentSelectedPlayground = getState().selectedPlaygroundInfo;
//     if (!currentSelectedPlayground?.id) return;

//     for (const item of fileOpsQueue.items) {
//         // handling renaming of current playground9
//         console.log("items os file Ops is : ", item)
//         if (currentSelectedPlayground.id === item.playgroundId && "newName" in item) {
//             const path = item.path.split('/').filter(Boolean);
//             const newName = item.newName;

//             if (path[path.length - 1]?.trim() === newName.trim()) continue;

//             dispatch(renameFiles({ path, newName }))
//         }

//         // handling delete Files
//         if (currentSelectedPlayground.id === item.playgroundId && !("newName" in item) && !("data" in item)) {
//             const path = item.path.split("/").filter(Boolean);
//             dispatch(deleteFiles({ path }));
//         }

//     }
        
// }


//sync file operations from client to server
// export const fileQueueThunk = (): AppThunk => async (dispatch, getState) => {
 
//   const { fileOperations, selectedPlaygroundInfo } = getState();

//   if (!selectedPlaygroundInfo?.id) return;
//   if (
//     fileOperations.items.length === 0 ||
//     fileOperations.head >= fileOperations.items.length
//   ) {
//     return;
//   }

//   const res = await axiosInstance.post(
//     `/app/v1/files/sync/${selectedPlaygroundInfo.id}`,
//     {
//       items: fileOperations.items,
//       head: fileOperations.head,
//     }
//   );

//   if (!res.data?.success) return;

//   dispatch(clearOperationQueue());

//   const refreshed = await axiosInstance.get(
//     `/app/v1/files/get/${selectedPlaygroundInfo.id}`
//   );

//   dispatch(addPlaygroundTemplateFiles(refreshed.data.files.content));
// };
