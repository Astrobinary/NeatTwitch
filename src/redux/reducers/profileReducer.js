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
            let profile;

            console.log(action)

            if (state[action.user] === undefined) profile = update(state[action.user], { $set: action.profile });

            return {
                ...state,
                ...profile,
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
