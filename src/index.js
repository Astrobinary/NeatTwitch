import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import "./global.css";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import AppReducer from "./reducers";

import Navagation from "./components/Navbar/Nav";
import Feed from "./containers/FeedPage/Feed";
import Streamers from "./containers/StreamersPage/Streamers";
import Games from "./containers/GamesPage/Games";
import Footer from "./components/Footer/Footer";
import _Game from "./components/GameSection/gamesection";
import _Streamer from "./components/StreamerSection/streamersection";

const composeEnhancer = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION__()) || compose;

const store = createStore(AppReducer, composeEnhancer(applyMiddleware(thunk)));

const App = () => (
	<Router>
		<Provider store={store}>
			<main className="App">
				<Navagation />
				<Switch>
					<Route exact path="/" component={Feed} />
					<Route exact path="/streamers" component={Streamers} />
					<Route exact path="/games" component={Games} />

					<Route path="/games/:gameID" component={_Game} />
					<Route path="/streamers/:streamerID" component={_Streamer} />
				</Switch>

				<Footer />
			</main>
		</Provider>
	</Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
