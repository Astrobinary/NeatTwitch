import React, { Component } from "react";
import moment from "moment";
import Img from "react-image";
import "./videopreview.css";

import missingPreview from "./404.jpg";
import viewIcon from "./view.svg";

class videopreview extends Component {
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
		let image = <Img className="clip-thumb" alt="preview" src={[this.props.video.thumbnails.small, missingPreview]} loader={<img src={missingPreview} />} />;

		return (
			<div className="clips-item" onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
				{image}
				<div className="clip-name">{this.props.video.title}</div>

				{this.state.isHovered && (
					<div className="top-banner">
						<span className="view-icon">
							<img src={viewIcon} alt="views" />
						</span>
						<span className="view-count">{this.props.video.views.toLocaleString()}</span>
						<span className="date-added">{moment(this.props.video.created_at).fromNow()}</span>
					</div>
				)}
			</div>
		);
	}
}

export default videopreview;
