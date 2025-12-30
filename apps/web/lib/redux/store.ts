import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import selectedTemplateReducer from "./features/template/index";
import dialogReducer from "./features/dialog/index";
import playgroundReducer from "./features/projects/index";
import editPlaygroundDialogStateSlice from "./features/editdialog/index";
import playgroundTemplateFilesReducer from "./features/playground-file-data/index";
import selectedPlaygroundInfoReducer from './features/playgroundInfo/index'
import fileOperationQueueReducer from "./features/file-operation-queue/index"


export const makeStore = () => {
  return configureStore({
    reducer: {
      selectedTemplate: selectedTemplateReducer, 
      dialogState: dialogReducer,
      playgrounds: playgroundReducer,
      editDialogState: editPlaygroundDialogStateSlice,
      playgroundTemplateFiles: playgroundTemplateFilesReducer,
      selectedPlaygroundInfo: selectedPlaygroundInfoReducer,
      fileOperations: fileOperationQueueReducer
    },
  });
};


export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;