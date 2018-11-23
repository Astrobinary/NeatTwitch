import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { uid } from "react-uid";
import { fetchChannel } from "../../actions";
import "./streamersection.css";

import VideoPreview from "../VideoPreview/videopreview";

import loadIcon from "./Preloader_5.gif";

class streamersection extends Component {
	componentWillMount() {
		this.props.fetchChannel(this.props.match.params.streamerID);
	}

	render() {
		const loadGif = (
			<div>
				<img src={loadIcon} alt="load icon" />
			</div>
		);

		let clips;
		if (this.props.channel)
			clips = this.props.channel.clips.map(x => (
				<Link key={uid(x)} to={{ pathname: `${this.props.match.url}/${x.slug}`, state: { video: x } }}>
					<VideoPreview video={x} />
				</Link>
			));

		return (
			<section>
				<h1 className="App-title">{this.props.match.params.streamerID}</h1>
				<section className="clips-container">{this.props.loading ? loadGif : clips}</section>
			</section>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		channel: state.streamerReducer[ownProps.match.params.streamerID],
		loading: state.streamerReducer.loading,
		error: state.streamerReducer.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fetchChannel: id => dispatch(fetchChannel(id))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(streamersection);
