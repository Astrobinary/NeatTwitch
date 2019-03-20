import update from "immutability-helper";
import { FETCH_FEED_REQUEST, FETCH_FEED_SUCCESS, FETCH_FEED_FAILURE, FETCH_SINGLE_REQUEST, FETCH_SINGLE_SUCCESS, FETCH_SINGLE_FAILURE, FETCH_FEED_MORE_REQUEST, FETCH_FEED_MORE_SUCCESS, FETCH_FEED_MORE_FAILURE } from "../actions/feedActions";

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
            let newState = update(state[action.time], { $set: action.payload });

            return {
                ...newState,
                loading: false
            };
        case FETCH_FEED_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_FEED_MORE_REQUEST:
            return {
                ...state,
                error: null
            };
        case FETCH_FEED_MORE_SUCCESS:
            let clips = update(state, { [action.time]: { $push: action.clips }, cursor: { $set: action.cursor } });

            return {
                ...clips,
                loading: false
            };
        case FETCH_FEED_MORE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_SINGLE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_SINGLE_SUCCESS:
            return {
                ...state,
                loading: false,
                singleVideo: action.payload
            };
        case FETCH_SINGLE_FAILURE:
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
