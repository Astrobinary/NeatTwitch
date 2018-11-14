import {
	FETCH_STREAMERS_REQUEST,
	FETCH_STREAMERS_SUCCESS,
	FETCH_STREAMERS_FAILURE,
	FETCH_CHANNEL_REQUEST,
	FETCH_CHANNEL_SUCCESS,
	FETCH_CHANNEL_FAILURE
} from "../actions";

const initialState = {
	streamers: [],
	channel: [],
	loading: false,
	error: null,
	offset: 0
};

const streamerReducer = (state = initialState, action) => {
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
				streamers: [...state.streamers, ...action.payload],
				offset: action.offset
			};
		case FETCH_STREAMERS_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload
			};

		case FETCH_CHANNEL_REQUEST:
			return {
				...state,
				loading: true,
				error: null
			};
		case FETCH_CHANNEL_SUCCESS:
			let obj = {};
			obj[action.user] = action.payload;

			return {
				...state,
				loading: false,
				...obj
			};
		case FETCH_CHANNEL_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload
			};

		default:
			return state;
	}
};
export default streamerReducer;
