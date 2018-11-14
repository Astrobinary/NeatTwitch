import axios from "axios";

const options = {
	headers: { "Client-ID": "15c6l9641yo97kt42nnsa51vrwp70y", accept: "application/vnd.twitchtv.v5+json" }
};

export const FETCH_GAMES_REQUEST = "FETCH_GAMES_REQUEST";
export const FETCH_GAMES_SUCCESS = "FETCH_GAMES_SUCCESS";
export const FETCH_GAMES_FAILURE = "FETCH_GAMES_FAILURE";

export const fetchGamesBegin = () => ({
	type: FETCH_GAMES_REQUEST
});

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
			.get("https://api.twitch.tv/kraken/games/top?limit=100", options)
			.then(res => {
				dispatch(fetchGamesSucess(res.data.top, offset));
				return res.data.top;
			})
			.catch(error => {
				dispatch(fetchGamesFailure(error.response));
			});
	};
}

export function fetchGamesAgain(offset = 0) {
	return dispatch => {
		return axios
			.get(`https://api.twitch.tv/kraken/games/top?limit=100&offset=${offset}`, options)
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

export function fetchStreamersAgain(offset = 0) {
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

export const FETCH_CHANNEL_REQUEST = "FETCH_CHANNEL_REQUEST";
export const FETCH_CHANNEL_SUCCESS = "FETCH_CHANNEL_SUCCESS";
export const FETCH_CHANNEL_FAILURE = "FETCH_CHANNEL_FAILURE";

export const fetchChannelBegin = () => ({
	type: FETCH_CHANNEL_REQUEST
});

export const fetchChannelSucess = (channel, name) => ({
	type: FETCH_CHANNEL_SUCCESS,
	payload: channel,
	user: name
});

export const fetchChannelFailure = error => ({
	type: FETCH_CHANNEL_FAILURE,
	payload: error
});

export function fetchChannel(user) {
	return dispatch => {
		dispatch(fetchChannelBegin());
		return axios
			.get(`https://api.twitch.tv/kraken/clips/top?channel=${user}&limit=100&period=all`, options)
			.then(res => {
				console.log(res.data);
				dispatch(fetchChannelSucess(res.data, user));
				return res.data.clips;
			})
			.catch(error => {
				console.log(error);
				dispatch(fetchChannelFailure(error.response));
			});
	};
}
