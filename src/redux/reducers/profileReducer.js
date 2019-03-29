import update from "immutability-helper";

const initialState = { loading: false, error: null };

const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_USER_COMMENTS_REQUEST":
            return {
                ...state,
                loading: true,
                error: null
            };
        case "GET_USER_COMMENTS_SUCCESS":
            let comments;

            if (state[action.user] === undefined) comments = update(state[action.user], { $set: action.comments });

            return {
                ...state,
                ...comments,
                loading: false
            };
        case "GET_USER_COMMENTS_FAILED":
            return {
                ...state,
                error: action.err.toString()
            };

        default:
            return state;
    }
};
export default commentsReducer;
