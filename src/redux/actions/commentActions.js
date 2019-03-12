import uuid from "uuid";

export const createComment = (message, videoId) => {
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
            timestamp: Date.now(),
            // createdAt: firestore.FieldValue.serverTimestamp().toDate(),
            points: 0,
            messageId: randomId
        };

        let payload = {
            post,
            videoId
        };

        firestore
            .collection("videos")
            .doc(videoId)
            .set({ videoId, comments: {} })
            .then(() => {
                firestore
                    .collection("videos")
                    .doc(videoId)
                    .collection("comments")
                    .doc(randomId)
                    .set({ ...post })
                    .then(() => {
                        console.log("Made it here");
                        dispatch({ type: "CREATE_COMMENT_SUCCESS", payload });
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

        let docRef = firestore
            .collection(`videos/${id}/comments`)
            .orderBy("points", "desc")
            .orderBy("timestamp", "desc");
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

export const userVote = (messageId, videoId, index, direction) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        let newPoints;

        var sfDocRef = firestore
            .collection("videos")
            .doc(videoId)
            .collection("comments")
            .doc(messageId);

        return firestore
            .runTransaction(transaction => {
                return transaction.get(sfDocRef).then(sfDoc => {
                    if (!sfDoc.exists) {
                        throw "Document does not exist";
                    }

                    if (direction === "up") {
                        newPoints = sfDoc.data().points + 1;
                    } else {
                        newPoints = sfDoc.data().points - 1;
                    }

                    transaction.update(sfDocRef, { points: newPoints });
                });
            })
            .then(() => {
                const payload = {
                    messageId,
                    videoId,
                    index,
                    newPoints
                };

                dispatch({ type: "VOTE_SUCCESS", payload });
            })
            .catch(error => {
                dispatch({ type: "VOTE_FAILED", error });
            });
    };
};
