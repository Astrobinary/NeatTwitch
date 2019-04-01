import update from "immutability-helper";

const initialState = { loading: false, error: null, favs: [], myFavs: [] };

const videoReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FAV_ADDED_SUCCESS":
            let list;

            if (state.favs.length === 0) {
                list = update(state, {
                    favs: {
                        $set: {
                            [action.favorite.slug]: [action.favorite]
                        }
                    }
                });
            } else {
                list = update(state, {
                    favs: {
                        [action.favorite.slug]: {
                            $set: [action.favorite]
                        }
                    }
                });
            }

            return {
                ...state,
                ...list,
                loading: false
            };

        case "FAV_ADDED_FAILED":
            return {
                ...state,
                error: action.err.toString()
            };

        case "FAV_ALL_SUCCESS":
            let newFavs;

            if (state.myFavs.length === 0) {
                newFavs = update(state, {
                    myFavs: {
                        $set: action.payload.list
                    },
                    favCursor: {
                        $set: action.payload.cursor
                    }
                });
            }
            return {
                ...state,
                ...newFavs,
                loading: false
            };

        case "FAV_ALL_FAILED":
            return {
                ...state,
                error: action.err.toString()
            };

        case "FAV_REMOVE_SUCCESS":
            let videoID = action.videoID;

            let updatedList = update(state, {
                favs: {
                    $unset: [videoID]
                }
            });

            return {
                ...state,
                ...updatedList,

                loading: false
            };

        case "FAV_REMOVE_FAILED":
            return {
                ...state,
                error: action.err.toString()
            };

        case "FAV_FETCH_REQUEST":
            return {
                ...state,
                loading: true,
                error: null
            };

        case "FAV_FETCH_SUCCESS":
            let fav;

            if (action.favorite === null) return;

            if (state.favs.length === 0) {
                fav = update(state, {
                    favs: {
                        $set: {
                            [action.videoID]: [action.fav]
                        }
                    }
                });
            } else {
                fav = update(state, {
                    favs: {
                        [action.videoID]: {
                            $set: [action.fav]
                        }
                    }
                });
            }

            return {
                ...state,
                ...fav,
                loading: false
            };
        case "FAV_FETCH_FAILED":
            return {
                ...state,
                error: action.err.toString(),
                laoding: false
            };

        default:
            return state;
    }
};
export default videoReducer;
