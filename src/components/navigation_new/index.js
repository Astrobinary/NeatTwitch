import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

import searchIcon from "../../images/search.svg";
import loginIcon from "../../images/login.svg";
import "./nav_new.scss";

class navagation extends Component {
	render() {
		return (
			<nav className="Navagation">
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

				<NavLink activeClassName="selected" className="nav-item" to="/about">
					about
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
		);
	}
}
export default navagation;
