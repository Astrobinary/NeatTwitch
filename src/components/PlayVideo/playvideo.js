import React, { Component } from "react";
import { Player, BigPlayButton } from "video-react";
import SimpleStorage from "react-simple-storage";
import "babel-polyfill";
import "./playvideo.css";
import "../../../node_modules/video-react/dist/video-react.css";

class playvideo extends Component {
	constructor(props) {
		super(props);

		let volume;

		if (JSON.parse(localStorage.getItem("_volume")) === null || JSON.parse(localStorage.getItem("_volume")) === undefined) {
			volume = 1;
		} else {
			volume = JSON.parse(localStorage.getItem("_volume"));
		}
		this.state = { src: "", volume };
	}

	componentDidMount() {
		this.setState({
			src: this.getMp4(),
			height: window.height
		});

		this.updateWindowDimensions();
		window.addEventListener("resize", this.updateWindowDimensions);

		this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
		this.refs.player.volume = this.state.volume;
	}

	componentWillMount() {
		window.removeEventListener("resize", this.updateWindowDimensions);
	}

	handleStateChange(state) {
		this.setState({
			volume: state.volume
		});
	}

	updateWindowDimensions = () => {
		this.setState({ height: window.innerHeight });
	};

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
				<SimpleStorage parent={this} blacklist={["src, height"]} />
				<div className="player-contain">
					<Player ref="player" playsInline src={this.state.src} fluid={true} autoPlay>
						<BigPlayButton position="center" />
					</Player>
				</div>
			</section>
		);
	}
}
export default playvideo;
