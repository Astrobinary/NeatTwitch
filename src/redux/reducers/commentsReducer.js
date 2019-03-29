import update from "immutability-helper";

const initialState = { loading: false, error: null };

const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CREATE_COMMENT_SUCCESS":
            return update(state, {
                [action.payload.videoID]: { $unshift: [action.payload.post] }
            });

        case "CREATE_COMMENT_FAILED":
            console.log(action);
            return state;
        case "CREATE_REPLY_SUCCESS":
            return update(state, {
                [action.payload.videoID]: { [action.payload.index]: { replies: { $unshift: [action.payload.post] } } }
            });
        case "CREATE_REPLY_FAILED":
            return state;
        case "GET_COMMENT_SUCCESS":
            let newState;

            if (state[action.videoID] === undefined) {
                newState = update(state, { $set: { [action.videoID]: action.payload } });
            } else {
                newState = update(state, {
                    [action.videoID]: {
                        list: {
                            $push: action.payload.list
                        },

                        cursor: {
                            $set: action.payload.cursor
                        }
                    }
                });
            }

            return {
                ...state,
                ...newState,
                loading: false
            };
        case "GET_COMMENT_FAILED":
            return {
                ...state,
                loading: false,
                error: action.err
            };

        case "VOTE_SUCCESS":
            let index;
            let temp = state[action.payload.videoID].list;

            temp.forEach((element, ind) => {
                if (element.messageID === action.payload.messageID) {
                    index = ind;
                }
            });

            return update(state, {
                [action.payload.videoID]: {
                    [index]: { voted: { $push: [action.payload.voter] }, points: { $set: action.payload.newPoints } }
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
