import React, { Component } from "react";

import "./gamesection.css";

class gamesection extends Component {
	render() {
		return (
			<section className="gamesection">
				<h1 className="App-title">{this.props.match.params.gameID}</h1>
			</section>
		);
	}
}

export default gamesection;
