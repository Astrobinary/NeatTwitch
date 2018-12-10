import { combineReducers } from "redux";

import gameReducer from "./gameReducer";
import streamers from "./streamers";

const AppReducer = combineReducers({
  gameReducer,
  streamers
});

export default AppReducer;
