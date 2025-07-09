// import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
// import storage from "redux-persist/lib/storage";
// import { persistReducer } from "redux-persist";
// import { persistStore } from "redux-persist";
// import thunk from "redux-thunk";
// import { processingReducer } from "./processing/processing";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const rootReducer = combineReducers({
//   processing: processingReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: [thunk],
// });

// export const persistor = persistStore(store);

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Это по умолчанию использует localStorage для веба
import { processingReducer } from "./processing/processing";

// Создаем persistConfig
const persistConfig = {
  key: "root", // Ключ для хранения состояния
  storage,
};

// Комбинируем редьюсеры
const rootReducer = combineReducers({
  processing: processingReducer,
});

// Оборачиваем rootReducer в persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
