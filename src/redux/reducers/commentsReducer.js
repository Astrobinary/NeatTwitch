import update from "immutability-helper";
const initialState = { loading: false, error: null };

const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CREATE_COMMENT_SUCCESS":
            return update(state, {
                [action.payload.videoId]: { $unshift: [action.payload.post] }
            });
        case "CREATE_COMMENT_FAILED":
            return state;
        case "GET_COMMENT_SUCCESS":
            let state2;
            let obj = action.comments;

            if (state[action.videoid] === undefined) {
                state2 = update(state[action.videoid], { $set: action.comments });
            } else {
                state2 = update(state[action.videoid], { $merge: action.comments[action.videoid] });
                obj[action.videoid] = state2;
            }

            return {
                ...state,
                loading: false,
                ...obj
            };
        case "GET_COMMENT_FAILED":
            return {
                ...state,
                loading: false,
                error: action.err
            };

        case "VOTE_SUCCESS":
            const points = state[action.payload.videoId][action.payload.index];
            const newPoints = update(points, {
                points: { $set: action.payload.newPoints }
            });
            return update(state, {
                [action.payload.videoId]: {
                    [action.payload.index]: { $set: newPoints }
                }
            });

        case "VOTE_FAILED":
            return {
                ...state,
                loading: false,
                error: action.error
            };
        default:
            return state;
    }
};
export default commentsReducer;
