import React, { Component } from "react";

import "./streamerinfo.scss";

class streamerInfo extends Component {
	render() {
		console.log(this.props.streamer);

		if (this.props.type.streamerID && this.props.streamer !== undefined) {
			return (
				<section className={"streamer-info"}>
					<img className={"streamer-info-logo"} src={this.props.streamer.details.logo} alt="logo" />
					<div className={"streamer-info-name"}>
						<div>{this.props.streamer.details.name}</div>
						<div className={"streamer-info-desc"}>{this.props.streamer.details.description}</div>
					</div>
				</section>
			);
		} else if (this.props.type.gameID && this.props.streamer !== undefined) {
			return <section className={"game-info"}>GAME</section>;
		} else {
			return <div />;
		}
	}
}
export default streamerInfo;
