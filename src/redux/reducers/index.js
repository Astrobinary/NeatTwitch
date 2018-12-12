import { combineReducers } from "redux";

import gamesReducer from "./gamesReducer";
import streamersReducer from "./streamersReducer";

const AppReducer = combineReducers({
	gamesReducer,
	streamersReducer
});

export default AppReducer;
