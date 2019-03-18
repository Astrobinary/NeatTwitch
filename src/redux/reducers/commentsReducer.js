import update from "immutability-helper";
const arrayToTree = require("array-to-tree");

const initialState = { loading: false, error: null };

const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CREATE_COMMENT_SUCCESS":
            console.log(action.payload);
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
            let state2;
            let obj = action.comments;
            console.log(
                arrayToTree(action.comments[action.videoID], {
                    parentProperty: "parent",
                    customID: "messageID"
                })
            );

            if (state[action.videoID] === undefined) {
                state2 = update(state[action.videoID], { $set: action.comments });
            } else {
                state2 = update(state[action.videoID], { $merge: action.comments[action.videoID] });
                obj[action.videoID] = state2;
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
            const index = state[action.payload.videoID][action.payload.index];
            // const newPoints = update(index, {
            //     points: { $set: action.payload.newPoints }
            // });

            console.log(action.payload.voter);
            console.log(state[action.payload.videoID][action.payload.index]);

            // const newVoter = update(index, {
            //     voted: { $push: action.payload.voter }
            // });

            // console.log(action.payload.voter);

            return update(state, {
                [action.payload.videoID]: {
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
