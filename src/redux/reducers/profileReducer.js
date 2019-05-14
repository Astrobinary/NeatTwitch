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

            comments = update(state, { [action.user]: { $merge: action.latest } });

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

        case "GET_USER_PROFILE_REQUEST":
            return {
                ...state,
                loading: true,
                error: null
            };
        case "GET_USER_PROFILE_SUCCESS":
            let details;

            console.log(action.data.name);

            if (state[action.data.name] === undefined) details = update(state[action.data.name], { $set: action.data });

            return {
                ...state,
                ...details,
                loading: false
            };
        case "GET_USER_PROFILE_FAILED":
            return {
                ...state,
                loading: false,
                error: action.err.toString()
            };

        default:
            return state;
    }
};
export default commentsReducer;
