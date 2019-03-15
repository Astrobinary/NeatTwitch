import React, { Component } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import firebase from "firebase/app";
import Axios from "axios";

import searchIcon from "../../images/search.svg";
import loginIcon from "../../images/login.svg";
import logoutIcon from "../../images/logout.svg";
import "./nav_new.scss";
require("firebase/functions");

class navagation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
            loginText: "Login"
        };
    }

    AuthenticateWithTwitch = async () => {
        let redirectUri;
        if (process.env.NODE_ENV === "production" ? (redirectUri = "https://neattwitch.com/feed") : (redirectUri = "http://localhost:3000/feed"));
        const clientId = "15c6l9641yo97kt42nnsa51vrwp70y";
        const codeUri = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid user_read`;

        const code = await this.getCode(codeUri);
        const tokenUri = `twitchAuth?${code}`;
        return await this.getAuthToken(tokenUri);
    };

    getCode = uri => {
        return new Promise((resolve, reject) => {
            const left = window.innerHeight - 350;

            const authWindow = window.open(uri, "_blank", `toolbar=no,resizable=yes,width=500,height=700,left=${left}`);
            let url;

            setInterval(async () => {
                try {
                    url = authWindow && authWindow.location && authWindow.location.search;
                } catch (e) {}
                if (url) {
                    const code = url.substring(1);
                    authWindow.close();
                    resolve(code);
                }
            }, 500);
        });
    };

    getAuthToken = uri => {
        this.setState({ loginText: "Logging In..." });

        if (process.env.NODE_ENV === "production") {
            Axios.get("https://us-central1-liveclips-2b478.cloudfunctions.net/" + uri)
                .then(response => {
                    firebase.auth().signInWithCustomToken(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            Axios.get("http://localhost:5000/liveclips-2b478/us-central1/" + uri)
                .then(response => {
                    firebase.auth().signInWithCustomToken(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    logOut = () => {
        this.setState({ loginText: "Login" });
        firebase.auth().signOut();
    };

    render() {
        const { auth } = this.props;
        return (
            <div onClick={this.toggleMenu}>
                <nav className="Navagation-desktop">
                    <Link className="nav-logo" to="/feed">
                        NEAT TWITCH
                    </Link>

                    <NavLink activeClassName="selected" className="nav-item" to="/feed">
                        feed
                    </NavLink>

                    <NavLink activeClassName="selected" className="nav-item" to="/streamers">
                        streamers
                    </NavLink>

                    <NavLink activeClassName="selected" className="nav-item" to="/games">
                        games
                    </NavLink>

                    <NavLink activeClassName="selected" className="nav-item" to="/playlists">
                        playlists
                    </NavLink>

                    <div className="nav-search" to="/">
                        <img src={searchIcon} alt={"logo"} />
                        <input />
                    </div>

                    {auth.isEmpty ? (
                        <div className="nav-login" onClick={this.AuthenticateWithTwitch}>
                            <img src={loginIcon} alt={"login"} />
                            <span>{this.state.loginText}</span>
                        </div>
                    ) : (
                        <div className="full nav-item" onClick={this.logOut} title="Logout">
                            <div>
                                <img className="nav-avatar" alt="avatar" src={auth.photoURL} />
                                <div className="nav-name">{auth.displayName}</div>
                                <img className="nav-logout" src={logoutIcon} alt={"login"} />
                            </div>
                        </div>
                    )}
                </nav>

                <nav className="Navagation-mobile">
                    <div className="mobile-menu">
                        {this.state.showMenu ? (
                            <div className="mobile-links">
                                <NavLink activeClassName="selected" className="mobile-nav-item" to="/feed">
                                    feed
                                </NavLink>

                                <NavLink activeClassName="selected" className="mobile-nav-item" to="/streamers">
                                    streamers
                                </NavLink>

                                <NavLink activeClassName="selected" className="mobile-nav-item" to="/games">
                                    games
                                </NavLink>

                                <NavLink activeClassName="selected" className="mobile-nav-item" to="/playlists">
                                    playlists
                                </NavLink>
                            </div>
                        ) : (
                            <div className="mobile-links">
                                <div className="mobile-logo">NEAT TWITCH</div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.firebaseReducer.auth
    };
};

export default withRouter(connect(mapStateToProps)(navagation));
