import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Player, ControlBar, ReplayControl, BigPlayButton, PlaybackRateMenuButton } from "video-react";
import SimpleStorage from "react-simple-storage";
import "babel-polyfill";
import "./playvideo.css";
import "../../../node_modules/video-react/dist/video-react.css";

class playvideo extends Component {
	constructor(props) {
		super(props);

		let volume;

		if (localStorage.getItem("_volume") === null || localStorage.getItem("_volume") === undefined) {
			volume = 1;
		} else {
			volume = JSON.parse(localStorage.getItem("_volume"));
		}
		this.state = { src: "", volume, video: this.props.location.state.video };
	}

	componentDidMount() {
		this.setState({
			src: this.getMp4(),
			height: window.innerWidth
		});

		this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
		this.refs.player.volume = this.state.volume;
	}

	handleStateChange(state) {
		this.setState({
			volume: state.volume
		});
	}

	getMp4() {
		let img = this.props.location.state.video.thumbnails.small;
		img = img.split("-");
		img = img.slice(0, img.length - 2);
		img = img.join("-") + ".mp4";
		return img;
	}

	render() {
		return (
			<section className="playvideo">
				<SimpleStorage parent={this} blacklist={["src", "height", "video"]} />
				<div className="player-contain">
					<Player ref="player" src={this.state.src} fluid={true} autoPlay>
						<BigPlayButton position="center" />
						<ControlBar autoHide={false}>
							<ReplayControl seconds={5} order={2.1} />
							<PlaybackRateMenuButton rates={[2, 1.5, 1, 0.5, 0.1]} order={7.1} />
						</ControlBar>
					</Player>
					<div className="player-info">
						<div className="player-logo">
							<img alt="avatar" src={this.state.video.broadcaster.logo} />
						</div>

						<div className="player-title">
							<div className="player-title-text">{this.state.video.title}</div>
							<Link to={"/streamers/" + this.state.video.broadcaster.name}>
								<div className="player-name">{this.state.video.broadcaster.display_name}</div>
							</Link>
						</div>
					</div>
				</div>
			</section>
		);
	}
}
export default playvideo;
