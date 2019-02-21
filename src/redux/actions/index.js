import axios from "axios";

const options = { headers: { "Client-ID": "15c6l9641yo97kt42nnsa51vrwp70y", accept: "application/vnd.twitchtv.v5+json" } };
const api = "https://api.twitch.tv/kraken";

// FEED PAGE ACTIONS
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

// GAME PAGE ACTIONS
export const FETCH_GAMES_REQUEST = "FETCH_GAMES_REQUEST";
export const FETCH_GAMES_SUCCESS = "FETCH_GAMES_SUCCESS";
export const FETCH_GAMES_FAILURE = "FETCH_GAMES_FAILURE";

export const fetchGamesBegin = () => ({ type: FETCH_GAMES_REQUEST });

export const fetchGamesSucess = (games, offset) => ({
    type: FETCH_GAMES_SUCCESS,
    payload: games,
    offset
});

export const fetchGamesFailure = error => ({
    type: FETCH_GAMES_FAILURE,
    payload: error
});

export function fetchGames(offset = 0) {
    return dispatch => {
        dispatch(fetchGamesBegin());
        return axios
            .get(`${api}/games/top?limit=100`, options)
            .then(res => {
                dispatch(fetchGamesSucess(res.data.top, offset));

                return res.data.top;
            })
            .catch(error => {
                dispatch(fetchGamesFailure(error.response));
            });
    };
}

export function fetchMoreGames(offset = 0) {
    return dispatch => {
        return axios
            .get(`${api}/games/top?limit=100&offset=${offset}`, options)
            .then(res => {
                dispatch(fetchGamesSucess(res.data.top, offset));
                return res.data.top;
            })
            .catch(error => {
                dispatch(fetchGamesFailure(error.response));
            });
    };
}

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

// GAMES PAGE ACTIONS

export const FETCH_GAME_TOP_REQUEST = "FETCH_GAME_TOP_REQUEST";
export const FETCH_GAME_TOP_SUCCESS = "FETCH_GAME_TOP_SUCCESS";
export const FETCH_GAME_TOP_FAILURE = "FETCH_GAME_TOP_FAILURE";

export const fetchGameBegin = () => ({
    type: FETCH_GAME_TOP_REQUEST
});

export const fetchGameSucess = (channel, name, sort) => ({
    type: FETCH_GAME_TOP_SUCCESS,
    payload: channel,
    user: name,
    sort
});

export const fetchGameFailure = (error, userObj) => ({
    type: FETCH_GAME_TOP_FAILURE,
    payload: error,
    user: userObj
});

export function fetchGameVideos(game, time) {
    return dispatch => {
        dispatch(fetchGameBegin());
        return axios
            .get(`${api}/clips/top?game=${game}&limit=100&period=${time}`, options)
            .then(res => {
                let sort = {};
                sort[time] = res.data.clips;
                sort["cursor"] = res.data._cursor;

                let userObj = {};
                userObj[game] = { ...sort };
                dispatch(fetchGameSucess(userObj, game, time));
                return userObj;
            })
            .catch(error => {
                let obj = {};
                obj[game] = {};
                dispatch(fetchChannelFailure(error.response, obj));
            });
    };
}
