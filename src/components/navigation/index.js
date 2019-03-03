import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

import searchIcon from "../../images/search.svg";
import loginIcon from "../../images/login.svg";
import "./nav_new.scss";

import serviceAccount from "../../config/admin.json";
var admin = require("firebase-admin");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://liveclips-2b478.firebaseio.com"
// });

class navagation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false
        };
    }

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    twitchAuth = async () => {
        const clientId = "15c6l9641yo97kt42nnsa51vrwp70y";
        const redirectUri = "http://localhost:3000/feed";

        const codeUri = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`;

        const code = await this.getCode(codeUri);
        const tokenUri = `/twitchAuth?${code}`;
        return await this.getAuthToken(tokenUri);
    };

    getAuthToken = async id => {
        // try {
        //     const token = await admin.auth().createCustomToken(id);
        //     return token;
        // } catch (err) {
        //     throw err;
        // }
    };

    getCode = uri => {
        return new Promise((resolve, reject) => {
            const authWindow = window.open(uri, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=500,height=750");

            let url = "";

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

    render() {
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

                    <div className="nav-login" onClick={this.twitchAuth}>
                        <img src={loginIcon} alt={"login"} />
                        <span>login</span>
                    </div>
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
export default navagation;
