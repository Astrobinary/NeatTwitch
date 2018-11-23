import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import "./global.css";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import AppReducer from "./reducers";

import Navagation from "./components/Navbar/Nav";
import Feed from "./containers/FeedPage/Feed";
import Streamers from "./containers/StreamersPage/Streamers";
import Games from "./containers/GamesPage/Games";
import Footer from "./components/Footer/Footer";
import _Game from "./components/GameSection/gamesection";
import _Streamer from "./components/StreamerSection/streamersection";
import _PlayVideo from "./components/PlayVideo/playvideo";

let store;

if (process.env.NODE_ENV === "production") {
	store = createStore(AppReducer, applyMiddleware(thunk));
} else {
	store = createStore(AppReducer, applyMiddleware(thunk));
}

const App = () => (
	<Router>
		<Provider store={store}>
			<div className="App">
				<Navagation />
				<Switch>
					<Redirect from="/" exact to="/feed" />
					<Route exact path="/feed" component={Feed} />
					<Route exact path="/feed/:videoID" component={_PlayVideo} />

					<Route exact path="/streamers" component={Streamers} />
					<Route exact path="/streamers/:streamerID" component={_Streamer} />
					<Route exact path="/streamers/:streamerID/:videoID" component={_PlayVideo} />

					<Route exact path="/games" component={Games} />
					<Route exact path="/games/:gameID" component={_Game} />
					<Route exact path="/games/:gameID/:videoID" component={_PlayVideo} />
				</Switch>

				<Footer />
			</div>
		</Provider>
	</Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
