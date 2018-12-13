import { combineReducers } from "redux";

import gamesReducer from "./gamesReducer";
import streamersReducer from "./streamersReducer";
import feedsReducer from "./feedsReducer";

const AppReducer = combineReducers({
	feedsReducer,
	streamersReducer,
	gamesReducer
});

export default AppReducer;
