export const fetchUserComments = displayName => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        dispatch({ type: "GET_USER_COMMENTS_REQUEST" });

        let docRef = firestore
            .collection(`comments`)
            .where("author", "==", `${displayName}`)
            .orderBy("timestamp", "desc")
            .limit(5);

        docRef
            .get()
            .then(doc => {
                let temp = [];
                let latest = {};

                doc.forEach(snap => {
                    if (snap.exists) temp.push(snap.data());
                });

                latest["comments"] = temp;

                if (temp.length === 0) throw new Error("No comments found");

                dispatch({
                    type: "GET_USER_COMMENTS_SUCCESS",
                    latest,
                    user: displayName
                });
                return latest;
            })
            .catch(err => {
                console.log(err);
                dispatch({ type: "GET_USER_COMMENTS_FAILED", err });
            });
    };
};

export const fetchUserProfile = displayName => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        dispatch({ type: "GET_USER_PROFILE_REQUEST" });

        let docRef = firestore
            .collection(`users`)
            .where("name", "==", `${displayName}`)
            .limit(1);

        docRef
            .get()
            .then(doc => {
                let temp = [];
                let data = {};

                doc.forEach(snap => {
                    if (snap.exists) temp.push(snap.data());
                });

                data[displayName] = {
                    logo: temp[0].logo,
                    name: temp[0].name,
                    created_at: temp[0].created_at
                };

                console.log(temp[0]);

                if (temp.length === 0) throw new Error("No profile found");

                dispatch({
                    type: "GET_USER_PROFILE_SUCCESS",
                    data,
                    user: displayName
                });
                return temp;
            })
            .catch(err => {
                console.log(err);
                dispatch({ type: "GET_USER_PROFILE_FAILED", err });
            });
    };
};
