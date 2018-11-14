import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./footer.css";

class Footer extends Component {
	render() {
		return (
			<footer className="Footer">
				<Link className="foot-item" to="/">
					feed
				</Link>

				<Link className="foot-item" to="/streamers">
					streamers
				</Link>

				<Link className="foot-item" to="/games">
					games
				</Link>

				<Link className="foot-item" to="/about">
					about
				</Link>
			</footer>
		);
	}
}
export default Footer;
