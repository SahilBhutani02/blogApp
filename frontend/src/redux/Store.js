// import { configureStore } from '@reduxjs/toolkit'
// import authSlice from "./authSlice"

// const store = configureStore({
//   reducer: {
//    auth:authSlice
//   },
// })

// export default store


import {combineReducers, configureStore} from "@reduxjs/toolkit";
import blogSlice from "./blogSlice";
import themeSlice from "./themeSlice"

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// import companySlice from "./companySlice";
// import applicationSlice from "./applicationSlice";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }
  const rootReducer = combineReducers({
    blogs:blogSlice,
    theme: themeSlice,
  })
  const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});
export default store;