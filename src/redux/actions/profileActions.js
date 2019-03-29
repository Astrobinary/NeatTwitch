export const fetchUserComments = displayName => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        dispatch({ type: "GET_USER_COMMENTS_REQUEST" });

        let docRef = firestore
            .collection(`comments`)
            .where("author", "==", `${displayName}`)
            .orderBy("timestamp", "desc")
            .limit(20);

        docRef
            .get()
            .then(doc => {
                let comments = {};
                let temp = [];

                doc.forEach(snap => {
                    if (snap.exists) temp.push(snap.data());
                });

                comments[displayName] = temp;

                if (temp.length === 0) throw new Error("No comments found");

                dispatch({
                    type: "GET_USER_COMMENTS_SUCCESS",
                    comments,
                    user: displayName
                });
                return comments;
            })
            .catch(err => {
                console.log(err);
                dispatch({ type: "GET_USER_COMMENTS_FAILED", err });
            });
    };
};
