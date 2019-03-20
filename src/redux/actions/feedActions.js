import axios from "axios";

const options = { headers: { "Client-ID": "15c6l9641yo97kt42nnsa51vrwp70y", accept: "application/vnd.twitchtv.v5+json" } };
const api = "https://api.twitch.tv/kraken";

//Single video fetch
export const FETCH_SINGLE_REQUEST = "FETCH_SINGLE_REQUEST";
export const FETCH_SINGLE_SUCCESS = "FETCH_SINGLE_SUCCESS";
export const FETCH_SINGLE_FAILURE = "FETCH_SINGLE_FAILURE";

export const fetchSingleBegin = () => ({ type: FETCH_SINGLE_REQUEST });

export const fetchSingleSucess = (feed, sort) => ({
    type: FETCH_SINGLE_SUCCESS,
    payload: feed,
    time: sort
});

export const fetchSingleFailure = (error, obj) => ({
    type: FETCH_SINGLE_FAILURE,
    payload: obj,
    error
});

export function fetchSingleVideo(slug) {
    return dispatch => {
        dispatch(fetchSingleBegin());
        return axios
            .get(`${api}/clips/${slug}`, options)
            .then(res => {
                dispatch(fetchSingleSucess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchSingleFailure(error.response, {}));
            });
    };
}

export const FETCH_FEED_REQUEST = "FETCH_FEED_REQUEST";
export const FETCH_FEED_SUCCESS = "FETCH_FEED_SUCCESS";
export const FETCH_FEED_FAILURE = "FETCH_FEED_FAILURE";

export const fetchFeedBegin = () => ({ type: FETCH_FEED_REQUEST });

export const fetchFeedSucess = (feed, sort) => ({
    type: FETCH_FEED_SUCCESS,
    payload: feed,
    time: sort
});

export const fetchFeedFailure = (error, obj) => ({
    type: FETCH_FEED_FAILURE,
    payload: obj,
    error
});

export function fetchFeedVideos(time) {
    return dispatch => {
        dispatch(fetchFeedBegin());
        return axios
            .get(`${api}/clips/top?limit=100&period=${time}`, options)
            .then(res => {
                let sort = {};
                sort[time] = res.data.clips;
                sort["cursor"] = res.data._cursor;

                let userObj = { ...sort };

                dispatch(fetchFeedSucess(userObj, time));
                return userObj;
            })
            .catch(error => {
                dispatch(fetchFeedFailure(error.response, {}));
            });
    };
}

export const FETCH_FEED_MORE_REQUEST = "FETCH_FEED_MORE_REQUEST";
export const FETCH_FEED_MORE_SUCCESS = "FETCH_FEED_MORE_SUCCESS";
export const FETCH_FEED_MORE_FAILURE = "FETCH_FEED_MORE_FAILURE";

export const fetchMoreFeedBegin = () => ({ type: FETCH_FEED_MORE_REQUEST });

export const fetchMoreFeedSucess = (clips, cursor, sort) => ({
    type: FETCH_FEED_MORE_SUCCESS,
    clips,
    cursor,
    time: sort
});

export const fetchMoreFeedFailure = (error, obj) => ({
    type: FETCH_FEED_MORE_FAILURE,
    payload: obj,
    error
});

export function fetchMoreFeedVideos(time, cursor) {
    return dispatch => {
        dispatch(fetchMoreFeedBegin());
        return axios
            .get(`${api}/clips/top?limit=100&period=${time}&cursor=${cursor}`, options)
            .then(res => {
                let clips = res.data.clips;
                let newCursor = res.data._cursor;

                return dispatch(fetchMoreFeedSucess(clips, newCursor, time));
            })
            .catch(error => {
                dispatch(fetchMoreFeedFailure(error.response, {}));
            });
    };
}
