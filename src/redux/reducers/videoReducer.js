import update from "immutability-helper";

const initialState = { loading: false, error: null, favs: [] };

const videoReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FAV_ADDED_SUCCESS":
            let list;
            console.log(action.favorite);

            if (state.favs.length === 0) {
                list = update(state, {
                    favs: {
                        $set: {
                            [action.favorite.videoID]: [action.favorite]
                        }
                    }
                });
            } else {
                list = update(state, {
                    favs: {
                        [action.favorite.videoID]: {
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
                error: action.err.toString()
            };

        default:
            return state;
    }
};
export default videoReducer;
