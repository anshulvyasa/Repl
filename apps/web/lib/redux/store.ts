import { configureStore } from "@reduxjs/toolkit";
import templateReducer from "./features/template/index";

export const makeStore = () => {
  return configureStore({
    reducer: {
      template: templateReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
