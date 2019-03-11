import uuid from "uuid";

export const createComment = (message, videoid) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const firebase = getFirebase().auth();

        console.log(firebase);

        let randomId = uuid.v4();

        let post = {
            message,
            author: firebase.currentUser.displayName,
            avatar: firebase.currentUser.photoURL,
            uid: firebase.currentUser.uid,
            createdAt: firestore.FieldValue.serverTimestamp(),
            points: 0,
            messageId: randomId
        };

        firestore
            .collection("videos")
            .doc(videoid)
            .set({ videoid, comments: {} })
            .then(() => {
                firestore
                    .collection("videos")
                    .doc(videoid)
                    .collection("comments")
                    .doc(randomId)
                    .set({ ...post })
                    .then(() => {
                        dispatch({ type: "CREATE_COMMENT_SUCCESS", post });
                    })
                    .catch(err => {
                        dispatch({ type: "CREATE_COMMENT_FAILED", err });
                    });
            })
            .catch(err => {
                dispatch({ type: "CREATE_COMMENT_FAILED", err });
            });
    };
};

export const fetchComments = id => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();

        let docRef = firestore.collection(`videos/${id}/comments`).orderBy("createdAt", "desc");

        docRef
            .get()
            .then(doc => {
                let comments = {};
                let temp = [];

                doc.forEach(snap => {
                    if (snap.exists) temp.push(snap.data());
                });
                comments[id] = temp;

                dispatch({
                    type: "GET_COMMENT_SUCCESS",
                    comments,
                    videoid: id
                });
                return comments;
            })
            .catch(err => {
                dispatch({ type: "GET_COMMENT_FAILED", err });
            });
    };
};
