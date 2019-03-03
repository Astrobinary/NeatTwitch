const initialState = {};

const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CREATE_COMMENT_SUCCESS":
            console.log("bacon");
            return state;
        case "CREATE_COMMENT_FAILED":
            console.log("comment error: ", action.err);
            return state;
        default:
            return state;
    }
};
export default commentsReducer;
