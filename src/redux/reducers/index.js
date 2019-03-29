import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

import gamesReducer from "./gamesReducer";
import streamersReducer from "./streamersReducer";
import feedsReducer from "./feedsReducer";
import commentsReducer from "./commentsReducer";
import profileReducer from "./profileReducer";
import videoReducer from "./videoReducer";

const AppReducer = combineReducers({
    feedsReducer,
    commentsReducer,
    streamersReducer,
    gamesReducer,
    videoReducer,
    profileReducer,
    firestoreReducer,
    firebaseReducer
});

export default AppReducer;
