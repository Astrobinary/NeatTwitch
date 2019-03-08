export const createComment = comment => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        firestore
            .collection("comments")
            .add({
                ...comment,
                author: "Astrobinary",
                authorID: 12345,
                createdAt: new Date()
            })
            .then(() => {
                dispatch({ type: "CREATE_COMMENT_SUCCESS", comment });
            })
            .catch(err => {
                dispatch({ type: "CREATE_COMMENT_FAILED", err });
            });
    };
};
