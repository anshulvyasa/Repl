import { configureStore } from "@reduxjs/toolkit";
import selectedTemplateReducer from "./features/template/index";
import dialogReducer from "./features/dialog/index";
import playgroundReducer from "./features/projects/index";

export const makeStore = () => {
  return configureStore({
    reducer: {
      selectedTemplate: selectedTemplateReducer,
      dialogState: dialogReducer,
      playgrounds: playgroundReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
