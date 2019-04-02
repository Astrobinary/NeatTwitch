import update from "immutability-helper";
import { FETCH_GAMES_REQUEST, FETCH_GAMES_SUCCESS, FETCH_GAMES_FAILURE, FETCH_GAME_VIDEOS_REQUEST, FETCH_GAME_VIDEOS_SUCCESS, FETCH_GAME_VIDEOS_FAILURE, FETCH_MORE_GAME_VIDEOS_REQUEST, FETCH_MORE_GAME_VIDEOS_SUCCESS, FETCH_MORE_GAME_VIDEOS_FAILURE } from "../actions/gameActions";

const initialState = {
    games: [],
    loading: false,
    error: null,
    offset: 0
};

const gamesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_GAMES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_GAMES_SUCCESS:
            return {
                ...state,
                loading: false,
                games: [...state.games, ...action.payload],
                offset: action.offset
            };
        case FETCH_GAMES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_GAME_VIDEOS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_GAME_VIDEOS_SUCCESS:
            let state2;
            let obj = action.payload;

            if (state[action.user] === undefined) {
                state2 = update(state[action.user], { $set: action.payload });
            } else {
                state2 = update(state[action.user], { $merge: action.payload[action.user] });
                obj[action.user] = state2;
            }

            return {
                ...state,
                loading: false,
                ...obj
            };
        case FETCH_GAME_VIDEOS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                ...action.user
            };

        case FETCH_MORE_GAME_VIDEOS_REQUEST:
            return {
                ...state,
                error: null
            };
        case FETCH_MORE_GAME_VIDEOS_SUCCESS:
            let clips = update(state, { [action.game]: { [action.time]: { $push: action.clips }, cursor: { $set: action.cursor } } });

            return {
                ...clips,
                loading: false
            };
        case FETCH_MORE_GAME_VIDEOS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};
export default gamesReducer;
