import axios from "axios";

const options = { headers: { "Client-ID": "15c6l9641yo97kt42nnsa51vrwp70y", accept: "application/vnd.twitchtv.v5+json" } };
const api = "https://api.twitch.tv/kraken";

// STREAMERS PAGE ACTIONS
export const FETCH_STREAMERS_REQUEST = "FETCH_STREAMERS_REQUEST";
export const FETCH_STREAMERS_SUCCESS = "FETCH_STREAMERS_SUCCESS";
export const FETCH_STREAMERS_FAILURE = "FETCH_STREAMERS_FAILURE";

export const fetchStreamersBegin = () => ({
    type: FETCH_STREAMERS_REQUEST
});

export const fetchStreamersSucess = (streamers, offset) => ({
    type: FETCH_STREAMERS_SUCCESS,
    payload: streamers,
    offset
});

export const fetchStreamersFailure = (error, userObj) => ({
    type: FETCH_STREAMERS_FAILURE,
    payload: userObj,
    error
});

export function fetchStreamers(offset = 0) {
    return dispatch => {
        dispatch(fetchStreamersBegin());
        return axios
            .get(`https://api.twitch.tv/kraken/streams?limit=100`, options)
            .then(res => {
                dispatch(fetchStreamersSucess(res.data.streams, offset));
                return res.data.top;
            })
            .catch(error => {
                dispatch(fetchStreamersFailure(error.response));
            });
    };
}

export function fetchMoreStreamers(offset = 0) {
    return dispatch => {
        return axios
            .get(`https://api.twitch.tv/kraken/streams?limit=100&offset=${offset}`, options)
            .then(res => {
                dispatch(fetchStreamersSucess(res.data.streams, offset));
                return res.data.top;
            })
            .catch(error => {
                dispatch(fetchStreamersFailure(error.response));
            });
    };
}

export const FETCH_CHANNEL_TOP_REQUEST = "FETCH_CHANNEL_TOP_REQUEST";
export const FETCH_CHANNEL_TOP_SUCCESS = "FETCH_CHANNEL_TOP_SUCCESS";
export const FETCH_CHANNEL_TOP_FAILURE = "FETCH_CHANNEL_TOP_FAILURE";
export const FETCH_CHANNEL_TOP_SEMI_SUCCESS = "FETCH_CHANNEL_TOP_SEMI_SUCCESS";

export const fetchChannelBegin = () => ({
    type: FETCH_CHANNEL_TOP_REQUEST
});

export const fetchChannelSucess = (channel, name, sort) => ({
    type: FETCH_CHANNEL_TOP_SUCCESS,
    payload: channel,
    user: name,
    sort
});

export const fetchChannelSemiSucess = (channel, name, sort) => ({
    type: FETCH_CHANNEL_TOP_SEMI_SUCCESS,
    payload: channel,
    user: name,
    sort
});

export const fetchChannelFailure = error => ({
    type: FETCH_CHANNEL_TOP_FAILURE,
    error
});

export function fetchStreamVideos(user, time) {
    return dispatch => {
        dispatch(fetchChannelBegin());
        return axios
            .get(`${api}/clips/top?channel=${user}&limit=100&period=${time}`, options)
            .then(res => {
                let sort = {};
                sort[time] = res.data.clips;
                sort["cursor"] = res.data._cursor;

                let userObj = {};
                userObj[user] = { ...sort };

                return userObj;
            })
            .then(userOBJ => {
                if (userOBJ[user][time].length < 1) {
                    return dispatch(fetchChannelSemiSucess(userOBJ, user, time));
                }

                return axios
                    .get(`${api}/channels/${userOBJ[user][time][0].broadcaster.id}`, options)
                    .then(caster => {
                        userOBJ[user]["details"] = caster.data;
                        dispatch(fetchChannelSucess(userOBJ, user, time));
                        return caster.data;
                    })
                    .catch(error => {
                        dispatch(fetchChannelFailure(`${user}'s details could not be found.`));
                    });
            })
            .catch(error => {
                console.log(error);
                dispatch(fetchChannelFailure(`${user} not found sorted by ${time}`));
            });
    };
}

export const FETCH_MORE_STREAMER_VIDEOS_REQUEST = "FETCH_MORE_STREAMER_VIDEOS_REQUEST";
export const FETCH_MORE_STREAMER_VIDEOS_SUCCESS = "FETCH_MORE_STREAMER_VIDEOS_SUCCESS";
export const FETCH_MORE_STREAMER_VIDEOS_FAILURE = "FETCH_MORE_STREAMER_VIDEOS_FAILURE";

export const fetchMoreStreamerVideosBegin = () => ({
    type: FETCH_MORE_STREAMER_VIDEOS_REQUEST
});

export const fetchMoreStreamerVideosSucess = (clips, cursor, streamer, time) => ({
    type: FETCH_MORE_STREAMER_VIDEOS_SUCCESS,
    clips,
    cursor,
    streamer,
    time
});

export const fetchMoreStreamerVideosFailure = (error, userObj) => ({
    type: FETCH_MORE_STREAMER_VIDEOS_FAILURE,
    payload: error,
    user: userObj
});

export function fetchMoreStreamerVideos(streamer, time, cursor) {
    return dispatch => {
        dispatch(fetchMoreStreamerVideosBegin());
        return axios
            .get(`${api}/clips/top?channel=${streamer}&limit=100&period=${time}&cursor=${cursor}`, options)
            .then(res => {
                let clips = res.data.clips;
                let newCursor = res.data._cursor;

                return dispatch(fetchMoreStreamerVideosSucess(clips, newCursor, streamer, time));
            })
            .catch(error => {
                dispatch(fetchMoreStreamerVideosFailure(error.response, {}));
            });
    };
}

export const FETCH_FOLLOWED_STREAMERS_REQUEST = "FETCH_FOLLOWED_STREAMERS_REQUEST";
export const FETCH_FOLLOWED_STREAMERS_SUCCESS = "FETCH_FOLLOWED_STREAMERS_SUCCESS";
export const FETCH_FOLLOWED_STREAMERS_FAILURE = "FETCH_FOLLOWED_STREAMERS_FAILURE";

export const fetchFollwedStreamersBegin = () => ({
    type: FETCH_FOLLOWED_STREAMERS_REQUEST
});

export const fetchFollwedStreamersSucess = (streamers, total) => ({
    type: FETCH_FOLLOWED_STREAMERS_SUCCESS,
    payload: streamers,
    total
});

export const fetchFollwedStreamersFailure = error => ({
    type: FETCH_FOLLOWED_STREAMERS_FAILURE,
    payload: error
});

export function fetchFollowedStreamers(id) {
    return dispatch => {
        dispatch(fetchFollwedStreamersBegin());
        return axios
            .get(`${api}/users/${id}/follows/channels?sortby=last_broadcast&limit=100`, options)
            .then(res => {
                dispatch(fetchFollwedStreamersSucess(res.data.follows, res.data._total));
                return res.data.top;
            })
            .catch(error => {
                dispatch(fetchFollwedStreamersFailure(error.response));
            });
    };
}

export const FETCH_MORE_FOLLOWED_STREAMERS_REQUEST = "FETCH_MORE_FOLLOWED_STREAMERS_REQUEST";
export const FETCH_MORE_FOLLOWED_STREAMERS_SUCCESS = "FETCH_MORE_FOLLOWED_STREAMERS_SUCCESS";
export const FETCH_MORE_FOLLOWED_STREAMERS_FAILURE = "FETCH_MORE_FOLLOWED_STREAMERS_FAILURE";

export const fetchMoreFollwedStreamersBegin = () => ({
    type: FETCH_MORE_FOLLOWED_STREAMERS_REQUEST
});

export const fetchMoreFollwedStreamersSucess = (streamers, offset) => ({
    type: FETCH_MORE_FOLLOWED_STREAMERS_SUCCESS,
    payload: streamers,
    offset
});

export const fetchMoreFollwedStreamersFailure = error => ({
    type: FETCH_MORE_FOLLOWED_STREAMERS_FAILURE,
    payload: error
});

export function fetchMoreFollowedStreamers(id, offset) {
    return dispatch => {
        dispatch(fetchMoreFollwedStreamersBegin());
        return axios
            .get(`${api}/users/${id}/follows/channels?sortby=last_broadcast&limit=100&offset=${offset}`, options)
            .then(res => {
                dispatch(fetchMoreFollwedStreamersSucess(res.data.follows, offset));
                return res.data.follows;
            })
            .catch(error => {
                dispatch(fetchMoreFollwedStreamersFailure(error.response));
            });
    };
}
