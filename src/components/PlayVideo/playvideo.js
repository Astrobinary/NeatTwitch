import React, { Component } from "react";
import { Player, BigPlayButton, LoadingSpinner } from "video-react";
import "./playvideo.css";
import "../../../node_modules/video-react/dist/video-react.css";

class playvideo extends Component {
	constructor(props) {
		super(props);
		this.state = { src: "" };
	}

	componentDidMount() {
		let src = this.getMp4();
		this.setState({
			src
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
		let title = this.props.location.state.video.title;
		console.log(this.state.src);
		return (
			<section className="playvideo">
				<Player playsInline src={this.state.src} width={900} fluid={false} autoPlay>
					<BigPlayButton position="center" />
					<LoadingSpinner />
				</Player>
			</section>
		);
	}
}
export default playvideo;
