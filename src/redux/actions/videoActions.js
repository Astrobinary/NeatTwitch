export const favoriteVideo = videoInfo => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const firebase = getFirebase().auth();

        let favorite = {
            ...videoInfo,
            timestamp: Date.now()
        };

        firestore
            .collection("users")
            .doc(firebase.currentUser.uid)
            .collection("favs")
            .doc(videoInfo.slug)
            .set({ ...favorite }, { merge: true })
            .then(() => {
                dispatch({ type: "FAV_ADDED_SUCCESS", favorite, user: firebase.currentUser.displayName });
            })
            .catch(err => {
                dispatch({ type: "FAV_ADDED_FAILED", err });
            });
    };
};

export const removeFavorite = videoID => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const firebase = getFirebase().auth();

        firestore
            .collection("users")
            .doc(firebase.currentUser.uid)
            .collection("favs")
            .doc(videoID)
            .delete()
            .then(() => {
                dispatch({ type: "FAV_REMOVE_SUCCESS", videoID });
            })
            .catch(err => {
                dispatch({ type: "FAV_REMOVE_FAILED", err });
            });
    };
};

export const fetchFavorite = videoID => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const firebase = getFirebase().auth();
        let docRef;

        docRef = firestore
            .collection("users")
            .doc(firebase.currentUser.uid)
            .collection("favs")
            .doc(videoID);

        docRef
            .get()
            .then(doc => {
                let fav;
                if (doc.exists) {
                    fav = doc.data();
                } else {
                    fav = null;
                }

                return dispatch({
                    type: "FAV_FETCH_SUCCESS",
                    fav,
                    videoID
                });
            })
            .catch(err => {
                console.log(err);
                return dispatch({ type: "FAV_FETCH_FAILED", err });
            });
    };
};

export const fetchAllFavorites = (prevCursor = null) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const firebase = getFirebase().auth();
        let docRef;

        if (prevCursor !== null) {
            docRef = firestore
                .collection("users")
                .doc(firebase.currentUser.uid)
                .collection("favs")
                .orderBy("timestamp", "desc")
                .startAfter(prevCursor)
                .limit(10);
        } else {
            docRef = firestore
                .collection("users")
                .doc(firebase.currentUser.uid)
                .collection("favs")
                .orderBy("timestamp", "desc")
                .limit(10);
        }

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

                return dispatch({ type: "FAV_ALL_SUCCESS", payload });
            })
            .catch(err => {
                console.log(err);
                return dispatch({ type: "FAV_ALL_FAILED", err });
            });
    };
};
