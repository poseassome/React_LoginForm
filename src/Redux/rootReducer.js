import { combineReducers } from "redux"; 
import typeReducer from "./typeReducer"; 
import wordReducer from "./wordReducer"; 
import pageReducer from "./pageReducer";

import storageSession from 'redux-persist/lib/storage/session';
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["typeReducer", "wordReducer", "pageReducer"]
};

const rootReducer = combineReducers({ typeReducer, wordReducer, pageReducer });

export default persistReducer(persistConfig, rootReducer);