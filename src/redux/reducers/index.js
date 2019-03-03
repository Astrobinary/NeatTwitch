import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";

import authsReducer from "./authsReducer";
import gamesReducer from "./gamesReducer";
import streamersReducer from "./streamersReducer";
import feedsReducer from "./feedsReducer";

const AppReducer = combineReducers({
    authsReducer,
    feedsReducer,
    streamersReducer,
    gamesReducer,
    firestoreReducer
});

export default AppReducer;
