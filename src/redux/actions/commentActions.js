const shortid = require("shortid");

export const createComment = (message, videoID, parent, title) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const firebase = getFirebase().auth();

        const randomId = shortid.generate();

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
            title
        };
        parent && (post.parent = parent);

        let payload = {
            post,
            videoID
        };

        firestore
            .collection("comments")
            .doc(randomId)
            .set({ ...post })
            .then(() => {
                dispatch({ type: "CREATE_COMMENT_SUCCESS", payload });
            })
            .catch(err => {
                dispatch({ type: "CREATE_COMMENT_FAILED", err });
            });
    };
};

export const fetchComments = (id) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        let docRef;

       
            docRef = firestore
                .collection(`comments`)
                .where("videoID", "==", `${id}`)
                .orderBy("points", "desc")
                .orderBy("timestamp", "desc");
        

        docRef
            .get()
            .then(doc => {
                let temp = [];

                let lastVisible = doc.docs[doc.docs.length - 1];

                doc.forEach(snap => {
                    if (snap.exists) temp.push(snap.data());
                });

                if (doc.docs.length < 10) lastVisible = undefined;

                let payload = {
                    list: temp,
                    cursor: lastVisible
                };

                dispatch({
                    type: "GET_COMMENT_SUCCESS",
                    payload,
                    videoID: id
                });
                return payload;
            })
            .catch(err => {
                console.log(err);
                dispatch({ type: "GET_COMMENT_FAILED", err });
            });
    };
};

export const userVote = (messageID, videoID, index, direction, voter) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        let newPoints;

        var sfDocRef = firestore.collection("comments").doc(messageID);

        return firestore
            .runTransaction(transaction => {
                return transaction.get(sfDocRef).then(sfDoc => {
                    if (!sfDoc.exists) {
                        throw new Error("Doc does not exist to upvote");
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
                    messageID,
                    videoID,
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
