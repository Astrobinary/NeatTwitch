import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

import authsReducer from "./authsReducer";
import gamesReducer from "./gamesReducer";
import streamersReducer from "./streamersReducer";
import feedsReducer from "./feedsReducer";
import commentsReducer from "./commentsReducer";

const AppReducer = combineReducers({
    authsReducer,
    feedsReducer,
    commentsReducer,
    streamersReducer,
    gamesReducer,
    firestoreReducer,
    firebaseReducer
});

export default AppReducer;
