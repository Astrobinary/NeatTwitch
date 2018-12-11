import axios from "axios";

const options = { headers: { "Client-ID": "15c6l9641yo97kt42nnsa51vrwp70y", accept: "application/vnd.twitchtv.v5+json" } };
const api = "https://api.twitch.tv/kraken";

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

export const fetchStreamersFailure = error => ({
	type: FETCH_STREAMERS_FAILURE,
	payload: error
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
				console.log(error);
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
				console.log(error);
				dispatch(fetchStreamersFailure(error.response));
			});
	};
}

export const FETCH_CHANNEL_TOP_REQUEST = "FETCH_CHANNEL_TOP_REQUEST";
export const FETCH_CHANNEL_TOP_SUCCESS = "FETCH_CHANNEL_TOP_SUCCESS";
export const FETCH_CHANNEL_TOP_FAILURE = "FETCH_CHANNEL_TOP_FAILURE";

export const fetchChannelBegin = () => ({
	type: FETCH_CHANNEL_TOP_REQUEST
});

export const fetchChannelSucess = (channel, name, sort) => ({
	type: FETCH_CHANNEL_TOP_SUCCESS,
	payload: channel,
	user: name,
	sort
});

export const fetchChannelFailure = (error, userObj) => ({
	type: FETCH_CHANNEL_TOP_FAILURE,
	payload: error,
	user: userObj
});

export function fetchChannel(user, time, type) {
	return dispatch => {
		dispatch(fetchChannelBegin());
		return axios
			.get(`${api}/clips/top?${type}=${user}&limit=100&period=${time}`, options)
			.then(res => {
				let sort = {};
				sort[time] = res.data.clips;
				sort["cursor"] = res.data._cursor;

				let userObj = {};
				userObj[user] = { ...sort };

				return userObj;
			})
			.then(userOBJ => {
				console.log(userOBJ);
				return axios
					.get(`${api}/channels/${userOBJ[user][time][0].broadcaster.id}`, options)
					.then(caster => {
						console.log();
						userOBJ[user]["details"] = caster.data;
						dispatch(fetchChannelSucess(userOBJ, user, time));
						return caster.data;
					})
					.catch(error => {
						dispatch(fetchChannelFailure(error.response));
					});
			})
			.catch(error => {
				let obj = {};
				obj[user] = {};
				console.log("No clips found");
				dispatch(fetchChannelFailure(error.response, obj));
			});
	};
}
