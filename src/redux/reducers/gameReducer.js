import { FETCH_GAMES_REQUEST, FETCH_GAMES_SUCCESS, FETCH_GAMES_FAILURE } from "../actions";

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
		default:
			return state;
	}
};
export default gamesReducer;
