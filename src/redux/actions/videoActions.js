export const favoriteVideo = (videoID, thumbnail, title, streamer) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const firebase = getFirebase().auth();

        let favorite = {
            videoID,
            thumbnail,
            title,
            streamer,
            timestamp: Date.now()
        };

        firestore
            .collection("users")
            .doc(firebase.currentUser.uid)
            .collection("favs")
            .doc(videoID)
            .set({ ...favorite }, { merge: true })
            .then(() => {
                dispatch({ type: "FAV_ADDED_SUCCESS", favorite, user: firebase.currentUser.displayName });
            })
            .catch(err => {
                dispatch({ type: "FAV_ADDED_FAILED", err });
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
                    return;
                }

                dispatch({
                    type: "FAV_FETCH_SUCCESS",
                    fav,
                    videoID
                });
                return fav;
            })
            .catch(err => {
                console.log(err);
                dispatch({ type: "FAV_FETCH_FAILED", err });
            });
    };
};
