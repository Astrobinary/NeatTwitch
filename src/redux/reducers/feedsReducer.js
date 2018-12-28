import update from "immutability-helper";
import { FETCH_FEED_REQUEST, FETCH_FEED_SUCCESS, FETCH_FEED_FAILURE } from "../actions";

const initialState = {
  loading: false,
  error: null,
  offset: 0
};

const feedsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FEED_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_FEED_SUCCESS:
      let prevState;
      let obj = action.payload;

      if (state[action.time] === undefined) {
        prevState = update(state[action.time], { $set: action.payload });
      } else {
        prevState = update(state[action.time], { $merge: action.payload[action.user] });
        obj[action.time] = prevState;
      }

      return {
        ...state,
        loading: false,
        ...obj
      };
    case FETCH_FEED_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};
export default feedsReducer;
