import React, { Component } from "react";
import moment from "moment";
import Img from "react-image";
import "./videopreview.scss";

import missingPreview from "./404.jpg";
import viewIcon from "./view.svg";

class videoListItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isHovered: false,
			error: false
		};

		this.toggleHover = this.toggleHover.bind(this);
	}

	toggleHover() {
		this.setState({ isHovered: !this.state.isHovered });
	}

	onChange() {}

	render() {
		let image = <Img className="clip-thumb" alt="preview" src={[this.props.video.thumbnails.medium, missingPreview]} loader={<img alt="missing" src={missingPreview} />} />;

		return (
			<div className="clips-item" onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
				{this.state.isHovered && (
					<div className="top-banner">
						<img className="logo-corner" src={this.props.video.broadcaster.logo} alt="logo" />
						<div className="view-container">
							<div className="view-count">{this.props.video.views.toLocaleString()}</div>
							<div className="view-count">{this.props.video.broadcaster.name}</div>
						</div>

						<span className="date-added">{moment(this.props.video.created_at).fromNow()}</span>
					</div>
				)}
				{image}
				<div className="clip-name">{this.props.video.title}</div>
			</div>
		);
	}
}

export default videoListItem;
