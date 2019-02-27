import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

import searchIcon from "../../images/search.svg";
import loginIcon from "../../images/login.svg";
import "./nav_new.scss";

class navagation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false
        };
    }

    toggleMenu = () => {
        console.log("clicked");
        this.setState({ showMenu: !this.state.showMenu });
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

                    <Link className="nav-login" to="/about">
                        <img src={loginIcon} alt={"login"} />
                        <span>login</span>
                    </Link>
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
