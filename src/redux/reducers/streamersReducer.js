import update from "immutability-helper";

import { FETCH_STREAMERS_REQUEST, FETCH_STREAMERS_SUCCESS, FETCH_STREAMERS_FAILURE, FETCH_CHANNEL_TOP_REQUEST, FETCH_CHANNEL_TOP_SUCCESS, FETCH_CHANNEL_TOP_SEMI_SUCCESS, FETCH_CHANNEL_TOP_FAILURE, FETCH_MORE_STREAMER_VIDEOS_REQUEST, FETCH_MORE_STREAMER_VIDEOS_SUCCESS, FETCH_MORE_STREAMER_VIDEOS_FAILURE } from "../actions/streamerActions";

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

        case FETCH_MORE_STREAMER_VIDEOS_REQUEST:
            return {
                ...state,
                error: null
            };
        case FETCH_MORE_STREAMER_VIDEOS_SUCCESS:
            let clips = update(state, { [action.streamer]: { [action.time]: { $push: action.clips }, cursor: { $set: action.cursor } } });

            return {
                ...clips,
                loading: false
            };
        case FETCH_MORE_STREAMER_VIDEOS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};
export default streamersReducer;
