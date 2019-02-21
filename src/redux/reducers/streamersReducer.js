import update from "immutability-helper";

import { FETCH_STREAMERS_REQUEST, FETCH_STREAMERS_SUCCESS, FETCH_STREAMERS_FAILURE, FETCH_CHANNEL_TOP_REQUEST, FETCH_CHANNEL_TOP_SUCCESS, FETCH_CHANNEL_TOP_SEMI_SUCCESS, FETCH_CHANNEL_TOP_FAILURE } from "../actions";

const initialState = {
  _twitch: [],
  loading: false,
  error: null,
  offset: 0
};

const streamersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STREAMERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_STREAMERS_SUCCESS:
      return {
        ...state,
        loading: false,
        _twitch: [...state._twitch, ...action.payload],
        offset: action.offset
      };
    case FETCH_STREAMERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    case FETCH_CHANNEL_TOP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_CHANNEL_TOP_SEMI_SUCCESS:
      let prevState;
      let obj = action.payload;

      if (state[action.user] === undefined) {
        prevState = update(state[action.user], { $set: action.payload });
      } else {
        prevState = update(state[action.user], { $merge: action.payload[action.user] });
        obj[action.user] = prevState;
      }

      return {
        ...state,
        loading: false,
        ...obj
      };

    case FETCH_CHANNEL_TOP_SUCCESS:
      obj = action.payload;

      if (state[action.user] === undefined) {
        prevState = update(state[action.user], { $set: action.payload });
      } else {
        prevState = update(state[action.user], { $merge: action.payload[action.user] });
        obj[action.user] = prevState;
      }

      return {
        ...state,
        loading: false,
        ...obj
      };
    case FETCH_CHANNEL_TOP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    default:
      return state;
  }
};
export default streamersReducer;
