import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "./jobsSlice";
import userReducer from "./userSlice";


export const makeStore = () => {
  return configureStore({
    reducer: {
      jobs: jobsReducer,
      user: userReducer,
      
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];