import { combineReducers } from "redux";

import gameReducer from "./gameReducer";
import streamerReducer from "./streamerReducer";

const AppReducer = combineReducers({
	gameReducer,
	streamerReducer
});

export default AppReducer;
