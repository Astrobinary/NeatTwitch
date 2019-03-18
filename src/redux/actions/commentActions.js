const shortid = require("shortid");
const arrayToTree = require("array-to-tree");

export const createComment = (message, videoID, parent) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const firebase = getFirebase().auth();

        const randomId = shortid.generate();

        if (parent === undefined) parent = null;

        let post = {
            message,
            videoID,
            messageID: randomId,
            author: firebase.currentUser.displayName,
            avatar: firebase.currentUser.photoURL,
            uid: firebase.currentUser.uid,
            timestamp: Date.now(),
            points: 0,
            voted: [],
            parent: parent
        };

        let payload = {
            post,
            videoID
        };

        firestore
            .collection("videos")
            .doc(videoID)
            .set({ videoID, comments: {} })
            .then(() => {
                firestore
                    .collection("videos")
                    .doc(videoID)
                    .collection("comments")
                    .doc(randomId)
                    .set({ ...post })
                    .then(() => {
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
                comments[id] = arrayToTree(temp, {
                    parentProperty: "parent",
                    customID: "messageID"
                });

                dispatch({
                    type: "GET_COMMENT_SUCCESS",
                    comments,
                    videoID: id
                });
                return comments;
            })
            .catch(err => {
                dispatch({ type: "GET_COMMENT_FAILED", err });
            });
    };
};

export const userVote = (messageId, videoID, index, direction, voter) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        let newPoints;

        var sfDocRef = firestore
            .collection("videos")
            .doc(videoID)
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

                    transaction.update(sfDocRef, { points: newPoints, voted: firestore.FieldValue.arrayUnion(voter) });
                });
            })
            .then(() => {
                const payload = {
                    messageId,
                    videoID,
                    index,
                    newPoints,
                    voter
                };

                dispatch({ type: "VOTE_SUCCESS", payload });
            })
            .catch(error => {
                dispatch({ type: "VOTE_FAILED", error });
            });
    };
};
