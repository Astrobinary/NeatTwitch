import update from "immutability-helper";
const initialState = { loading: false, error: null };

const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CREATE_COMMENT_SUCCESS":
            console.log("bacon");
            return state;
        case "CREATE_COMMENT_FAILED":
            console.log("comment error: ", action.err);
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
            console.log("comment error: ", action.err);
            return state;
        default:
            return state;
    }
};
export default commentsReducer;
