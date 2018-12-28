import React, { Component } from "react";

import "./streamerinfo.scss";
import twitchIcon from "./twitch.svg";

class streamerInfo extends Component {
	render() {
		console.log(this.props.streamer);

		if (this.props.type.streamerID && this.props.streamer !== undefined && this.props.streamer.details !== undefined) {
			return (
				<section className={"streamer-info"}>
					<img className={"streamer-info-logo"} src={this.props.streamer.details.logo} alt="logo" />
					<div className={"streamer-info-name"}>
						<div>
							<a href={this.props.streamer.details.url} target="_blank" rel="noopener noreferrer">
								{this.props.streamer.details.name} <img className={"streamer-info-icon"} src={twitchIcon} alt="twitch icon" />
							</a>
						</div>

						<div className={"streamer-info-desc"}>{this.props.streamer.details.description}</div>
					</div>
				</section>
			);
		} else if (this.props.type.gameID && this.props.streamer !== undefined) {
			return <div className="top-title">{this.props.type.gameID}</div>;
		} else {
			return <div />;
		}
	}
}
export default streamerInfo;
