import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "./jobsSlice";


export const makeStore = () => {
  return configureStore({
    reducer: {
      jobs: jobsReducer,
      
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];