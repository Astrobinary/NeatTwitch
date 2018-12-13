import { FETCH_FEED_REQUEST, FETCH_FEED_SUCCESS, FETCH_FEED_FAILURE } from "../actions";

const initialState = {
	clips: {},
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
			return {
				...state,
				clips: { ...state.top, ...action.payload },
				loading: false,
				offset: action.offset
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
