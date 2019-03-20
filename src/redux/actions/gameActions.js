import axios from "axios";

const options = { headers: { "Client-ID": "15c6l9641yo97kt42nnsa51vrwp70y", accept: "application/vnd.twitchtv.v5+json" } };
const api = "https://api.twitch.tv/kraken";

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

// GAME VIDEO ACTIONS
export const FETCH_GAME_VIDEOS_REQUEST = "FETCH_GAME_VIDEOS_REQUEST";
export const FETCH_GAME_VIDEOS_SUCCESS = "FETCH_GAME_VIDEOS_SUCCESS";
export const FETCH_GAME_VIDEOS_FAILURE = "FETCH_GAME_VIDEOS_FAILURE";

export const fetchGameVideosBegin = () => ({
    type: FETCH_GAME_VIDEOS_REQUEST
});

export const fetchGameVideosSucess = (channel, name, sort) => ({
    type: FETCH_GAME_VIDEOS_SUCCESS,
    payload: channel,
    user: name,
    sort
});

export const fetchGameVideosFailure = (error, userObj) => ({
    type: FETCH_GAME_VIDEOS_FAILURE,
    payload: error,
    user: userObj
});

export function fetchGameVideos(game, time) {
    return dispatch => {
        dispatch(fetchGameVideosBegin());
        return axios
            .get(`${api}/clips/top?game=${game}&limit=100&period=${time}`, options)
            .then(res => {
                let sort = {};
                sort[time] = res.data.clips;
                sort["cursor"] = res.data._cursor;

                let userObj = {};
                userObj[game] = { ...sort };
                dispatch(fetchGameVideosSucess(userObj, game, time));
                return userObj;
            })
            .catch(error => {
                let obj = {};
                obj[game] = {};
                dispatch(fetchGameVideosFailure(error.response, obj));
            });
    };
}

export const FETCH_MORE_GAME_VIDEOS_REQUEST = "FETCH_MORE_GAME_VIDEOS_REQUEST";
export const FETCH_MORE_GAME_VIDEOS_SUCCESS = "FETCH_MORE_GAME_VIDEOS_SUCCESS";
export const FETCH_MORE_GAME_VIDEOS_FAILURE = "FETCH_MORE_GAME_VIDEOS_FAILURE";

export const fetchMoreGameVideosBegin = () => ({
    type: FETCH_MORE_GAME_VIDEOS_REQUEST
});

export const fetchMoreGameVideosSucess = (clips, cursor, game, time) => ({
    type: FETCH_MORE_GAME_VIDEOS_SUCCESS,
    clips,
    cursor,
    game,
    time
});

export const fetchMoreGameVideosFailure = (error, userObj) => ({
    type: FETCH_MORE_GAME_VIDEOS_FAILURE,
    payload: error,
    user: userObj
});

export function fetchMoreGameVideos(game, time, cursor) {
    console.log("here");
    return dispatch => {
        dispatch(fetchMoreGameVideosBegin());
        return axios
            .get(`${api}/clips/top?game=${game}&limit=100&period=${time}&cursor=${cursor}`, options)
            .then(res => {
                let clips = res.data.clips;
                let newCursor = res.data._cursor;

                return dispatch(fetchMoreGameVideosSucess(clips, newCursor, game, time));
            })
            .catch(error => {
                dispatch(fetchMoreGameVideosFailure(error.response, {}));
            });
    };
}
