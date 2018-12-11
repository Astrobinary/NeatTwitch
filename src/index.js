import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "./global.scss";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import AppReducer from "./redux/reducers";

import Feed from "./pages/Feed";

import Streamers from "./pages/Streamers";
import Games from "./pages/Games";

import _Videos from "./components/videoList";
import _PlayVideoList from "./components/videoplayerlist";
import _PlayVideoSingle from "./components/videoplayersingle";

import Navagation from "./components/navigation";

import * as serviceWorker from "./serviceWorker";

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(AppReducer, composeEnhancer(applyMiddleware(thunk)));

// createStore(AppReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk));

const Index = () => (
	<Router>
		<Provider store={store}>
			<div className="App">
				<Navagation />
				<Switch>
					<Redirect from="/" exact to="/feed" />

					<Route exact path="/feed" component={Feed} />
					{/* <Route exact path="/feed/:videoID" component={_PlayVideo} /> */}

					<Route exact path="/streamers" component={Streamers} />
					<Route exact path="/streamers/:streamerID" component={_Videos} />
					<Route exact path="/streamers/:streamerID/:videoID" component={_PlayVideoList} />

					<Route exact path="/games" component={Games} />
					<Route exact path="/games/:gameID" component={_Videos} />
					<Route exact path="/games/:gameID/:videoID" component={_PlayVideoList} />

					<Route exact path="/:videoID" component={_PlayVideoSingle} />
				</Switch>
				{/* <Footer /> */}
			</div>
		</Provider>
	</Router>
);

ReactDOM.render(<Index />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
