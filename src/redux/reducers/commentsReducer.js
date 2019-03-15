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
            const index = state[action.payload.videoId][action.payload.index];
            // const newPoints = update(index, {
            //     points: { $set: action.payload.newPoints }
            // });

            console.log(action.payload.voter);
            console.log(state[action.payload.videoId][action.payload.index]);

            // const newVoter = update(index, {
            //     voted: { $push: action.payload.voter }
            // });

            // console.log(action.payload.voter);

            return update(state, {
                [action.payload.videoId]: {
                    [action.payload.index]: {
                        voted: { $push: [action.payload.voter] },
                        points: { $set: action.payload.newPoints }
                    }
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
