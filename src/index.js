import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import AppReducer from "./redux/reducers";
import { reduxFirestore, getFirestore } from "redux-firestore";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";

import firebaseconfig from "./config/firebase";

import * as serviceWorker from "./serviceWorker";

import Feed from "./pages/Feed";
import Streamers from "./pages/Streamers";
import Games from "./pages/Games";
import Playlists from "./pages/Playlists";
import LogIn from "./pages/LogIn";

import _PreviewContainer from "./components/previewContainer";
import _playlistPlayer from "./components/playlistPlayer";
import _singlePlayer from "./components/singlePlayer";
import Navagation from "./components/navigation";

import "./global.scss";

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(AppReducer, composeEnhancer(applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })), reduxFirestore(firebaseconfig), reactReduxFirebase(firebaseconfig)));

const Index = () => (
    <Router>
        <Provider store={store}>
            <div className="App">
                <Navagation />
                <Switch>
                    <Redirect from="/" exact to="/feed" />

                    <Route exact path="/feed" component={Feed} />
                    <Route exact path="/feed/twitch" component={_PreviewContainer} />
                    <Route exact path="/feed/youtube" component={_PreviewContainer} />
                    <Route exact path="/feed/:videoID" component={_playlistPlayer} />

                    <Route exact path="/streamers" component={Streamers} />
                    <Route exact path="/streamers/:streamerID" component={_PreviewContainer} />
                    <Route exact path="/streamers/:streamerID/:videoID" component={_playlistPlayer} />

                    <Route exact path="/games" component={Games} />
                    <Route exact path="/games/:gameID" component={_PreviewContainer} />
                    <Route exact path="/games/:gameID/:videoID" component={_playlistPlayer} />

                    <Route exact path="/playlists" component={Playlists} />

                    <Route exact path="/login" component={LogIn} />

                    <Route exact path="/:videoID" component={_singlePlayer} />
                </Switch>
            </div>
        </Provider>
    </Router>
);

ReactDOM.render(<Index />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
