import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import selectedTemplateReducer from "./features/template/index";
import dialogReducer from "./features/dialog/index";
import playgroundReducer from "./features/projects/index";
import editPlaygroundDialogStateSlice from "./features/editdialog/index";
import playgroundTemplateFilesReducer from "./features/playground-file-data/index";
import selectedPlaygroundInfoReducer from './features/playgroundInfo/index'
import fileOperationQueueReducer from "./features/file-operation-queue/index"
import globalFileSelectionReducer from './features/file-selected/index'
import webContainerFilesReducer from './features/web-container-files/index';
import { selectedFileMiddleware } from "./middleware";


const rootReducer = combineReducers({
  selectedTemplate: selectedTemplateReducer,
  dialogState: dialogReducer,
  playgrounds: playgroundReducer,
  editDialogState: editPlaygroundDialogStateSlice,
  playgroundTemplateFiles: playgroundTemplateFilesReducer,
  selectedPlaygroundInfo: selectedPlaygroundInfoReducer,
  fileOperations: fileOperationQueueReducer,
  fileSelected: globalFileSelectionReducer,
  webContainerFiles: webContainerFilesReducer
})

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(selectedFileMiddleware),
  });
};


export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;